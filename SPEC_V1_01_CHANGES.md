# VICTOREANUM PriceEngine — Spezifikation V1.01 (Vollständige Referenz)

> Quelle: `VICTOREANUM.PriceEngine.Umsetzung_V1.01_WORK.pdf`
> Erstellt: 2026-02-22
> Zweck: Source of Truth für Phase 1 (Backend) und alle weiteren Phasen

---

## 1. Systemarchitektur

### 1.1 3-Schichten-Architektur

| Schicht | Technologie | Beschreibung |
|---------|------------|--------------|
| **Frontend** | React (Next.js) | Admin-UI für Kurse, Formeln, Stammdaten, Kalkulation |
| **Kommunikation** | Apache Server | Reverse Proxy / Load Balancer zwischen Frontend und Backend |
| **Backend / Logik** | Node.js (Linux) | Geschäftslogik, Preisaktualisierung, Preiskalkulation, REST-API |
| **Datenbank** | MySQL / MariaDB | Kursarchiv, Kalkulationsparameter, Stammdaten, Auth |

- PriceEngine ist eine **autarke Anwendung** mit eigener Datenbank
- Frontend ist austauschbar — Backend-Logik bleibt unverändert
- Kommunikation ausschließlich über HTTP/REST zwischen Frontend ↔ Backend

### 1.2 Systemkontext

Die PriceEngine agiert als **Middleware** zwischen:
- **Sage 100 (ERP)** → Artikelstammdaten (unidirektional, ERP → PriceEngine)
- **WooCommerce Webshop** ← Kalkulierte Preise (PriceEngine → Webshop via REST-API)
- PriceEngine ist die **alleinige Autorität für Preisfindung**

---

## 2. Kernfunktion: Kursdatenmanagement

### 2.1 Automatischer Kursabruf
- Hintergrundprozess (IHostedService / Cron-Job)
- Intervall: ca. **2 Stunden**
- Metalle: **Gold, Silber, Platin, Kupfer**
- Externe API: REST/JSON-basierter Datenfeed (Anbieter wird noch ermittelt)
- Architektur muss adapterfähig sein (Provider-Pattern)

### 2.2 Kursarchivierung
- Jeder abgerufene Kurs wird mit exaktem Zeitstempel in DB persistiert
- Gilt für automatische UND manuelle Änderungen
- Kurshistorie muss über eigene UI abrufbar sein (durchsuch- und filterbar)

### 2.3 Manuelle Kursanpassung
- Nur Rolle **PriceEditor** darf Kurse manuell überschreiben
- Jede Änderung wird im **Audit-Log** protokolliert (Benutzer + Zeitstempel)

---

## 3. Kernfunktion: Preiskalkulation

### 3.1 Spot-Preise (3-stufiges Modell)

```
Spot(0) = Börsenpreis (nackt, von API)
Spot(1) = Spot(0) + globalSurcharge (pro Metall, editierbar in GUI "Aktuelle Preise")
Spot(2) = Spot(1) + zeitgesteuerte Aufschläge (Wochentag-/Feiertags-Regeln)
```

**WICHTIG: Ausschließlich Spot(2) wird in den Kalkulationsformeln als `$spot` verwendet!**

#### globalSurcharge pro Metall (aktueller Stand)
| Metall | Symbol | globalSurcharge (€/g) |
|--------|--------|----------------------|
| Gold   | XAU    | 1.50 |
| Silber | XAG    | 0.02 |
| Platin | XPT    | 0.80 |
| Kupfer | XCU    | 0.01 |

- Kupfer (XCU) ersetzt Palladium (XPD) als 4. aktives Metall
- Die Formel für Spot(1) muss in der GUI "Aktuelle Preise" pro Metallart eingegeben werden

### 3.2 Preisgruppen (Kundengruppen)

| ID | Code | Name | Aufschlag (%) | Richtung |
|----|------|------|---------------|----------|
| 1 | R | VK-REGULÄR | 0 | verkauf |
| 2 | M | VK-MITGLIEDER | 2.6 | verkauf |
| 3 | H | VK-HÄNDLER | 2.0 | verkauf |
| 4 | P | VK+Provision | 4.2 | verkauf |
| 5 | A | ANKAUF | 0 | ankauf |

- Aufschläge werden in eigener GUI **"Preisgruppen"** eingetragen
- Aufschläge gelten **für alle Artikel** (global)
- Der Aufschlag wird als einer der **letzten Schritte** der Preiskalkulation angewendet
- Im Frontend: `discountPercent` → umbenannt zu `surchargePercent`
- Neues Feld: `direction: 'verkauf' | 'ankauf'`

### 3.3 Formel-Engine

#### Unterstützte Komponenten
- **Variablen**: `$spot` (Spot(2)!), `$weight`, `$facon`, `$aufschlag`
- **Konstanten**: Feste numerische Werte (z.B. `23.95`)
- **Operatoren**: `+`, `-`, `*`, `/`
- **Klammerung**: `(Spot*weight+23.95)*1.045`

#### Standard-Formel-Pattern
```
($spot * $weight + $facon) * $aufschlag
```

Wobei:
- `$spot` = Spot(2) — der korrigierte Spotpreis
- `$weight` = Artikelgewicht in Gramm
- `$facon` = Faconkosten des Artikels (aus Artikelstammdaten)
- `$aufschlag` = Preisgruppen-Aufschlag als Multiplikator (1 + surchargePercent/100)

#### Formel-Verwaltung
- Formeln sind **typisiert** und werden als **Stammdaten** erfasst
- In der Kalkulationsliste werden Formeln aus einer **Auswahlliste** ausgewählt
- In Ausnahmefällen kann eine eigene Formel manuell eingegeben werden
  - Dabei können statt `$facon` oder `$aufschlag` auch absolute Zahlen verwendet werden
  - Eigene Formeln werden mit Schlüssel **Artikelnummer + Preisgruppe** gespeichert
- Formeln werden mit mathjs evaluiert (**kein eval()!**)

### 3.4 Faconkosten (Herstellungskosten)

Zwei Berechnungsmuster:

| Typ | Beschreibung | Formel-Beispiel |
|-----|-------------|----------------|
| **Absolut** | Fester EUR-Betrag zum Materialwert addiert | `$spot * $weight + 7.00` |
| **Prozentual** | Prozentualer Aufschlag auf Materialwert | `($spot * $weight) * 1.1252` |

- Faconkosten und deren Art (absolut/prozentual) werden in **Artikelstammdaten** gepflegt
- In Formeln als Variable `$facon` verwendet
- In der Kalkulationsliste müssen Faconkosten **inline editierbar** sein
- Änderung wird sofort im Artikelstamm gespeichert und für alle Preisgruppen-Formeln angewendet

### 3.5 Steuerberechnung

| Code | Besteuerungsart | Steuersatz |
|------|----------------|------------|
| `o` | Steuerfrei (Anlagegold) | 0% |
| `r` | Regelbesteuert (Silber, Platin, Kupfer) | 19% |

- **Differenzbesteuerung gibt es NICHT MEHR** (§ 25 UStG entfällt)
- Besteuerungsart wird pro Artikel in den Stammdaten eingetragen (Auswahlliste)
- Eigene **Mapping-Tabelle** (Besteuerungsart → Steuersatz) erforderlich
- Kalkulations-Ergebnis pro Preisgruppe: **Netto, Brutto, Steuerbetrag**
- Alle drei Felder werden an den Webshop übergeben
- Wenn Steuerbetrag = 0, dann Bruttobetrag = Nettobetrag

### 3.6 Zeitgesteuerte Preisregeln

- **Standard-Regeln**: Pro Wochentag, mit Von/Bis-Uhrzeit und Formel
- **Sonder-Regeln**: Pro Datum (Feiertage), übersteuern Standardregeln
- Die Aufschlag-Formel greift **unabhängig von Öffnungszeiten**
- Wird ggf. nur durch Feiertagsformel übersteuert
- In diesen Formeln wird `$spot` = Spot(1) verwendet → ergibt Spot(2)

---

## 4. Stammdatenverwaltung

### 4.1 Artikeldaten
Primäre Pflege in PriceEngine (später via Sage 100 Sync):
- Artikelnummer (SKU)
- Bezeichnung
- Gewicht
- Faconkosten + Art (absolut/prozentual)
- Artikelgruppe
- Besteuerungsart

### 4.2 Preisrelevante Stammdaten (in PriceEngine GUI)
- Kundengruppen / Preisgruppen
- Artikelgruppen
- Zuschläge Preisgruppen × Artikelgruppen
- Feiertage
- Formeln
- Steuerzuordnung (Mapping-Tabelle)

### 4.3 Artikelgruppen × Preisgruppen Zuschläge
- Neue Entität: `ArticleGroupSurcharge`
- Felder: `{ id, articleGroupId, customerGroupId, surchargePercent }`
- Verknüpft Artikelgruppen mit Preisgruppen für spezifische Zuschläge

---

## 5. Benutzeroberfläche (GUI)

### 5.1 Startseite (Aktuelle Preise / Dashboard)
- Spot(0) Karten: Gold, Silber, Platin, Kupfer mit EUR/USD pro Gramm
- Aktuelle Metallkurse Tabelle mit **Formel für Spot(1)** Spalte
- Spot(1) muss pro Metallart editierbar sein (globalSurcharge Eingabe)
- Zeitstempel der letzten Aktualisierung prominent anzeigen
- Preise älter als 650.000 Sekunden = ungültig markieren

### 5.2 Kalkulationsliste (Produktpreise / Shop Preise)
- Tabellarische Übersicht aller Artikel × Preisgruppen
- Spalten: Id, Spot-Price×Gewicht, Gewicht, Gruppe, **Formelname**, **Klartext-Formel**, **Faconkosten** (editierbar), **Auf-/Abschlag** (read-only), Netto, Steuer, Brutto
- Filter- und Sortierfunktionen (nach Artikel, Preisgruppe)
- **Inline-Editing** für Faconkosten (Änderung → sofort in Artikelstamm)
- Formel kann aus Auswahlliste oder manuell eingegeben werden

### 5.3 Kalkulations-Detail (Preis-Bearbeitung)
- Detailansicht für einzelnen Artikel
- Bearbeitbare Felder: SKU, Customer Group, Einheit (VK/AK), Preis-Typ (Gramm/Unze), Gewicht, Formula, Country
- Faconkosten, Facon-Typ, Besteuerungsart

### 5.4 Spotpreis-Regeln (Verkauf / Ankauf)
- Standardregeln: 7 Wochentage mit Von/Bis, Aktiv-Status, Formel, berechneter Wert
- Sonderregeln: Datum-basiert (Feiertage)
- Pro Metall auswählbar (Gold, Silber, Platin, Kupfer)

### 5.5 Stammdaten-Seiten
- Kundengruppen (Preisgruppen): Code, Name, Beschreibung, **Aufschlag (%)**, Status
- Formeln: ID, Name, Formel, Variablen-Badges ($spot, $weight, $facon, $aufschlag), Status
- Artikel: SKU, Name, Metall, Gewicht, Faconkosten, Facon-Typ, Besteuerungsart, Status
- Steuerzuordnung: Code, Name, Steuersatz (%) — CRUD
- Hersteller, Lieferanten, Feiertage, Rollen, Benutzer, Rollenzuweisung

### 5.6 Kurshistorie
- Durchsuch- und filterbare Liste aller historischen Kurse
- Zeitstempel, Metall, Kurs, Quelle (automatisch/manuell)

---

## 6. Benutzer- und Rollenverwaltung

| Rolle | Berechtigungen |
|-------|---------------|
| **Admin** | Vollzugriff auf alles, Benutzerverwaltung |
| **PriceEditor** | Formeln bearbeiten, Stammdaten, manuelle Kursanpassung |
| **Viewer** | Nur Lesezugriff auf Kurs- und Preisinformationen |

- Eigene integrierte Authentifizierung (kein AD/LDAP)
- Auth-Daten in MySQL/MariaDB gespeichert

---

## 7. Schnittstellenanforderungen

### 7.1 REST-API für Drittsysteme
- **Basic-Authentifizierung**
- **JSON-Format**
- Zentraler Endpunkt: `Get.Price(Artikelnummer, Kundengruppe)`

Beispiel-Response:
```json
{
  "artikelnummer": "AuPBo8J00018S00018G00001HM",
  "kundengruppe": "VK-HÄNDLER",
  "kalkulierterPreis": 64.04,
  "waehrung": "EUR",
  "timestamp": "2025-11-06T14:30:00Z"
}
```

### 7.2 Schnittstelle ERP (Sage 100) — Ausbaustufe
- Unidirektional: Sage 100 → PriceEngine
- Artikelstammdaten-Synchronisation in regelmäßigen Abständen
- Zunächst: Pflege direkt in PriceEngine

### 7.3 Schnittstelle Webshop (WooCommerce) — Primäre Umsetzung
- PriceEngine pusht Preise proaktiv zum Webshop
- **Per API** (beschlossen 20.02.2026)
- WooCommerce REST-API: https://woocommerce.github.io/woocommerce-rest-api-docs/
- Pro Preisgruppe: Netto, Brutto, Steuerbetrag
- Im ersten Wurf können ASCII-Dateien als Alternative verwendet werden

---

## 8. Datenimport
- CSV-Import für initiale Einrichtung und Massenänderungen
- Importfunktion für Kalkulationsparameter

---

## 9. Nicht-funktionale Anforderungen

### 9.1 Sicherheit
- Eigenes Auth-System in MySQL/MariaDB
- Rollenbasierte Autorisierung (Admin/PriceEditor/Viewer)
- API-Zugriffe gesondert abgesichert (Basic Auth)

### 9.2 Logging / Audit
- Alle preisrelevanten Aktionen im Audit-Log
- Manuelle Kursanpassungen, Formeländerungen
- Log ist für nicht-Admins schreibgeschützt
- Jeder Eintrag: Benutzer + exakter Zeitstempel
- Bibliothek: Serilog (oder Node.js-Äquivalent wie Winston/Pino)

Zu protokollierende Ereignisse:
- Kritische Anwendungsfehler (Exceptions)
- Fehlgeschlagene Kurs-API-Abrufe
- Erfolgreiche automatische und manuelle Preisaktualisierungen

### 9.3 Usability
- Design/Farbauswahl: ToDo VICTOREANUM (Stylesheet wird bereitgestellt)

---

## 10. Glossar

| Begriff | Beschreibung |
|---------|-------------|
| **Spotpreis** | Aktueller Börsenkurs eines Edelmetalls (pro Unze oder Gramm) |
| **Spot(0)** | Börsenpreis (nackt, von API) |
| **Spot(1)** | Spot(0) + globaler Aufschlag (pro Metall) |
| **Spot(2)** | Spot(1) + zeitgesteuerte Aufschläge → wird in Formeln als $spot verwendet |
| **Faconkosten** | Herstellungs-/Prägekosten, absolut (EUR) oder prozentual |
| **Preisgruppe** | Kundengruppe mit eigener Preiskalkulation (4× VK + 1× Ankauf) |
| **Unze (Troy)** | 31,1034768 Gramm |
| **$spot** | Variable = Spot(2) |
| **$weight** | Variable = Artikelgewicht in Gramm |
| **$facon** | Variable = Faconkosten des Artikels |
| **$aufschlag** | Variable = Preisgruppen-Multiplikator (1 + surchargePercent/100) |

---

## 11. Frontend-Änderungen (Step A, umgesetzt 2026-02-22)

### Geänderte Dateien

| Datei | Änderungen |
|-------|-----------|
| `src/types/index.ts` | Metal: +XCU, +globalSurcharge; CustomerGroup: discountPercent→surchargePercent, +direction; Article: +faconCost, +faconType, +taxType; ArticlePrice: -prestashopPrice, +taxAmount; Neue Interfaces: TaxMapping, ArticleGroupSurcharge |
| `src/lib/sku/constants.ts` | TAX_CODES: -Differenzbesteuert; MATERIAL_TO_SYMBOL: +Cu→XCU |
| `src/lib/formula/evaluator.ts` | validateFormula Test-Context: +$facon, +$aufschlag |
| `src/lib/api/mock-data.ts` | Metalle: Palladium→Kupfer, +globalSurcharge; Kundengruppen: neue Namen/Codes/surchargePercent; Formeln: +$facon/$aufschlag; Artikel: +facon/tax Felder; Preise: -prestashopPrice, +taxAmount; +mockTaxMappings |
| `src/lib/api/endpoints/tax-mappings.ts` | **Neu** — CRUD für Steuerzuordnung |
| `src/components/layout/Sidebar.tsx` | Pd→Cu/Kupfer, +Steuerzuordnung Nav-Item |
| `src/components/dashboard/MetalRateCard.tsx` | Palladium→Kupfer, purple→orange |
| `src/components/dashboard/MetalRateTable.tsx` | Palladium→Kupfer, Silver→Silber |
| `src/components/dashboard/BestPriceSection.tsx` | Palladium→Kupfer, Silver→Silber |
| `src/app/spot-rules/verkauf/page.tsx` | Palladium→Kupfer, Silver→Silber |
| `src/app/spot-rules/ankauf/page.tsx` | Palladium→Kupfer, Silver→Silber |
| `src/app/master-data/customer-groups/page.tsx` | Rabatt(%)→Aufschlag(%) |
| `src/app/master-data/articles/page.tsx` | Palladium→Kupfer |
| `src/app/master-data/formulas/page.tsx` | Variablen-Badges zeigen $facon/$aufschlag |
| `src/app/master-data/tax-mappings/page.tsx` | **Neu** — Steuerzuordnung CRUD-Seite |
| `src/components/products/ProductList.tsx` | -Prestashop-Price Spalte, +Steuer Spalte |
| `src/components/products/ProductPriceRow.tsx` | prestashopPrice→taxAmount |
| `src/components/articles/ArticleForm.tsx` | +faconCost, +faconType, +taxType Felder |

### Datenbank-Schema Änderungen (für Phase 1)

```sql
-- metals Tabelle
ALTER TABLE metals ADD COLUMN global_surcharge DECIMAL(10,4) NOT NULL DEFAULT 0;

-- customer_groups Tabelle
ALTER TABLE customer_groups RENAME COLUMN discount_percent TO surcharge_percent;
ALTER TABLE customer_groups ADD COLUMN direction ENUM('verkauf', 'ankauf') NOT NULL DEFAULT 'verkauf';

-- articles Tabelle
ALTER TABLE articles ADD COLUMN facon_cost DECIMAL(10,4) NOT NULL DEFAULT 0;
ALTER TABLE articles ADD COLUMN facon_type ENUM('absolute', 'percentage') NOT NULL DEFAULT 'absolute';
ALTER TABLE articles ADD COLUMN tax_type ENUM('steuerfrei', 'regelbesteuert') NOT NULL DEFAULT 'steuerfrei';

-- article_prices Tabelle
ALTER TABLE article_prices DROP COLUMN prestashop_price;
ALTER TABLE article_prices ADD COLUMN tax_amount DECIMAL(10,4) NOT NULL DEFAULT 0;

-- Neue Tabellen
CREATE TABLE tax_mappings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  rate DECIMAL(5,2) NOT NULL DEFAULT 0
);

CREATE TABLE article_group_surcharges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  article_group_id INT NOT NULL,
  customer_group_id INT NOT NULL,
  surcharge_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (customer_group_id) REFERENCES customer_groups(id)
);
```
