# PriceEngine – Kompletter Projektplan für Claude Code

> **Zweck dieses Dokuments:** Vollständige Anleitung für Claude Code, um das PriceEngine-Projekt Schritt für Schritt umzusetzen. Beginnt mit Phase 0 (Frontend mit Mock-Daten), so dass dem Kunden schnell etwas gezeigt werden kann, und ist so aufgebaut, dass der Übergang zu echtem Backend nahtlos möglich ist.

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Tech Stack](#2-tech-stack)
3. [Architektur-Philosophie: Frontend-First mit API-Layer-Abstraktion](#3-architektur-philosophie)
4. [SKU-System (SCHLÜSSEL eigene Artikelnummern)](#4-sku-system)
5. [Phase 0 – Frontend mit Mock-Daten (ERSTE PRIORITÄT)](#5-phase-0)
6. [Phase 1 – Backend-Foundation + Datenbankanbindung](#6-phase-1)
7. [Phase 2 – Kernfunktionen](#7-phase-2)
8. [Phase 3 – Integrationen & Polish](#8-phase-3)
9. [Datenbank-Schema](#9-datenbank-schema)
10. [API-Endpunkte (Backend)](#10-api-endpunkte)
11. [Geschäftslogik im Detail](#11-geschäftslogik)
12. [Projektstruktur](#12-projektstruktur)
13. [Docker-Setup](#13-docker-setup)
14. [UI/UX-Anforderungen](#14-ui-ux-anforderungen)
15. [Nicht-funktionale Anforderungen](#15-nicht-funktionale-anforderungen)

---

## 1. Projektübersicht

**PriceEngine** ist eine Web-Anwendung zur Verwaltung von Edelmetall-Preisen. Sie:

- Ruft Live-Kurse von Edelmetallen ab (Gold, Silber, Platin, Palladium)
- Berechnet Artikelpreise pro Kundengruppe mit konfigurierbaren Formeln
- Unterscheidet zwischen **Verkaufs-** und **Ankaufspreisen**
- Hat **Standardregeln** (pro Wochentag) und **Sonderregeln** (Feiertage/besondere Daten)
- Pusht berechnete Preise an WooCommerce WebShop und/oder ERP-Systeme via REST API

**Bestehendes System (Preistool von Victoreanum eG):** Die Screenshots zeigen das aktuelle System. PriceEngine soll dieses ersetzen und modernisieren. Die Kernlogik (Spotpreise, Regeln pro Tag, Formeln pro Kundengruppe) muss 1:1 abgebildet werden.

---

## 2. Tech Stack

| Layer | Technologie |
|-------|------------|
| Frontend | Next.js 14+ (React, TypeScript, App Router) |
| UI Library | Tailwind CSS + shadcn/ui |
| Backend API | Express.js (TypeScript) |
| Datenbank | MySQL 8 |
| ORM | Prisma |
| Auth | JWT mit RBAC (Role-Based Access Control) |
| Container | Docker + docker-compose |
| Externe API | metals-api.com (alternativ: BörseOnline, wie im bestehenden System) |
| Ziel-Integration | WooCommerce REST API, generische ERP-Endpunkte |

---

## 3. Architektur-Philosophie: Frontend-First mit API-Layer-Abstraktion

### Das Schlüsselprinzip

Alle Datenaufrufe im Frontend gehen durch einen **einheitlichen API-Layer** (`/src/lib/api/`). In Phase 0 liefert dieser Mock-Daten zurück. Ab Phase 1 wird der gleiche Layer auf echte Backend-Calls umgestellt – **ohne dass sich eine einzige Komponente ändern muss**.

```
Komponente → useHook() → api-Layer → { Phase 0: mock-data.ts | Phase 1+: fetch(/api/...) }
```

### Umsetzung

```typescript
// src/lib/api/client.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'; // In Phase 0: true

export async function apiGet<T>(endpoint: string): Promise<T> {
  if (USE_MOCK) {
    const { getMockData } = await import('./mock-data');
    return getMockData(endpoint) as T;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const json = await res.json();
  return json.data as T;
}
```

### Umgebungsvariable

```env
# .env.local (Phase 0)
NEXT_PUBLIC_USE_MOCK=true

# .env.local (Phase 1+)
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 4. SKU-System (SCHLÜSSEL eigene Artikelnummern)

### 4.1 SKU-Aufbau

Das SKU-System des Kunden folgt einem strikten Schema:

```
[Material]-[Produkt][Besteuerung]-[Hersteller]-[Stückzahl]-[Grammatur]-[Lieferant]
```

**Beispiel:** `Au-CBo-J0001-S0100-G00001-HM`
- `Au` = Gold
- `CB` = Combibarren
- `o` = Ohne Steuer
- `J0001` = Heimerle & Meule (Hersteller)
- `S0100` = 100 Stück
- `G00001` = 1 Gramm
- `HM` = Heimerle & Meule (Lieferant)

### 4.2 Stammdaten-Tabellen für SKU-Komponenten

Diese Tabellen müssen im System hinterlegt und im Frontend als Dropdowns/Auswahllisten verfügbar sein:

#### Material-Codes

| Code | Material |
|------|----------|
| Au | Gold |
| Ag | Silber |
| Os | Osmium |
| Pt | Platin |
| Cu | Kupfer |
| Rh | Rhodium |
| Ru | Ruthenium |
| Ir | Iridium |
| Pd | Palladium |
| Ti | Titan |
| Dd | Diverse |

#### Produkt-Codes

| Code | Produkt |
|------|---------|
| PB | Prägebarren |
| GB | Gussbarren |
| CB | Combibarren / Boxen |
| CC | Combibarren / Collection |
| TB | Tafelbarren |
| FC | Fine Card |
| SC | Secaincard |
| MB | Münzbarren |
| MU | Münzen |
| ME | Medaillen |
| MT | Münz-Tubes |
| BT | Barren-Tubes |
| EP | Eigenprodukte |
| GG | Gourmet-Gold |
| GE | Geschenkartikel |
| ZB | Zubehör |

#### Besteuerungs-Codes

| Code | Besteuerung |
|------|------------|
| o | Ohne Steuer |
| r | Regelbesteuert (19%) |
| d | Differenzbesteuert |

#### Hersteller-Codes (Auswahl)

| Code | Hersteller |
|------|-----------|
| J0001 | Heimerle & Meule |
| J0002 | C. Hafner |
| J0003 | HERAEUS |
| J0004 | LEV / Geiger |
| J0005 | UMICORE |
| J0006 | IGR / Istanbul Gold Refinery |
| J0007 | DEGUSSA |
| J0008 | Münze Österreich / Wiener Philh. |
| J0009 | LEV / Arche Noah |
| J0010 | United States Mint / American Eagle |
| J0011 | United States Mint / Buffalo |
| J0012 | Rand Refinery / Krüger Rand |
| J0013 | Perth Mint / Känguru |
| J0014 | Perth Mint / Koala |
| J0015 | Royal Canadian Mint / Maple Leaf |
| J0016 | Royal Mint / Britannia |
| J0017 | New Zealand Mint / Kiwi |
| J0018 | HISTORISCH / Kurantmünzen |
| J0019 | Diverse |
| J24XX | Format für Jahrgang 2024 (XX = Herstellercode) |

#### Grammatur-Codes

| Code | Gewicht |
|------|---------|
| G00000 | 0,5 g |
| G00001 | 1 g |
| G00005 | 5 g |
| G00025 | 25 g |
| G70001 | 1 oz |
| G71002 | 1/2 oz |
| G71004 | 1/4 oz |
| G71010 | 1/10 oz |
| G71020 | 1/20 oz |
| G71025 | 1/25 oz |
| G70002 | 2 oz |
| G70003 | 3 oz |
| G70005 | 5 oz |
| G70010 | 10 oz |
| G70012 | 12 oz |
| G70100 | 100 oz |

#### Stückzahl-Codes

| Code | Stückzahl |
|------|-----------|
| S0001 | 1 Stück |
| S0020 | 20 Stück |
| S0050 | 50 Stück |
| S0100 | 100 Stück |
| S0250 | 250 Stück |

#### Lieferanten-Codes

| Code | Lieferant |
|------|-----------|
| HM | Heimerle & Meule |
| CH | C. Hafner |
| SG | SOLIT Gruppe |
| GE | LEV / Geiger |
| AG | Auragentum |
| IG | IGR / Istanbul Gold Refinery |
| DG | DEGUSSA |
| MÖ | Münze Österreich |
| ZI | Ziemann |
| OI | Osmiuminstitut |
| EG | ESG-Edelmetall Service GmbH |
| DV | Diverse |

### 4.3 SKU-Builder im Frontend

Das Frontend braucht einen **SKU-Builder** als Komponente:

- Dropdowns für jede Komponente (Material, Produkt, Besteuerung, Hersteller, Stückzahl, Grammatur, Lieferant)
- Automatische SKU-Generierung aus den Auswahlen
- Validierung des Formats
- Auch manuelles Eingabefeld mit Parsing/Validierung
- Bei Artikelanlage: Gewicht wird automatisch aus Grammatur-Code vorgeschlagen (z.B. G00001 → 1g, G70001 → 31.1035g)

### 4.4 Grammatur → Gewicht Mapping (für Formelberechnung)

```typescript
const GRAMMATUR_TO_GRAMS: Record<string, number> = {
  'G00000': 0.5,
  'G00001': 1,
  'G00005': 5,
  'G00025': 25,
  'G70001': 31.1034768,    // 1 oz
  'G71002': 15.5517384,    // 1/2 oz
  'G71004': 7.7758692,     // 1/4 oz
  'G71010': 3.11034768,    // 1/10 oz
  'G71020': 1.55517384,    // 1/20 oz
  'G71025': 1.24413907,    // 1/25 oz
  'G70002': 62.2069536,    // 2 oz
  'G70003': 93.3104304,    // 3 oz
  'G70005': 155.517384,    // 5 oz
  'G70010': 311.034768,    // 10 oz
  'G70012': 373.241722,    // 12 oz
  'G70100': 3110.34768,    // 100 oz
};
```

---

## 5. Phase 0 – Frontend mit Mock-Daten (ERSTE PRIORITÄT)

### Ziel

Vollständig funktionale UI mit realistischen Mock-Daten. Klient kann navigieren, klicken, Formulare ausfüllen – alles funktioniert visuell. Kein Backend nötig.

### 5.0 Projektsetup

```bash
npx create-next-app@latest price-engine-frontend --typescript --tailwind --app --src-dir
cd price-engine-frontend
npx shadcn@latest init
# Komponenten installieren:
npx shadcn@latest add button card input label select table tabs dialog badge
npx shadcn@latest add dropdown-menu sheet separator tooltip calendar popover
npx shadcn@latest add form command checkbox switch textarea toast sonner
npm install lucide-react recharts mathjs date-fns zustand
```

### 5.1 Ordnerstruktur (Phase 0)

```
src/
├── app/
│   ├── layout.tsx                    # Root-Layout mit Sidebar
│   ├── page.tsx                      # Redirect → /dashboard
│   ├── login/page.tsx
│   ├── dashboard/page.tsx            # Aktuelle Preise (Spotpreise)
│   ├── spot-rules/
│   │   ├── page.tsx                  # Übersicht: Verkauf + Ankauf
│   │   ├── verkauf/page.tsx          # Spotpreis-Regeln Verkauf
│   │   └── ankauf/page.tsx           # Spotpreis-Regeln Ankauf
│   ├── products/
│   │   ├── page.tsx                  # Shop-Preise (Produktliste mit Preisen)
│   │   └── [articleId]/page.tsx      # Preis-Bearbeitung (Detail)
│   ├── holidays/page.tsx
│   ├── import/page.tsx               # "Aus PS Importieren"
│   ├── configurator/page.tsx         # Konfigurator
│   ├── logs/page.tsx
│   └── master-data/
│       ├── customer-groups/page.tsx
│       ├── formulas/page.tsx
│       ├── articles/page.tsx         # Artikel-Stammdaten mit SKU-Builder
│       ├── manufacturers/page.tsx    # Hersteller-Stammdaten
│       ├── suppliers/page.tsx        # Lieferanten-Stammdaten
│       ├── roles/page.tsx
│       ├── users/page.tsx
│       └── user-roles/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Navigation (wie im Screenshot)
│   │   ├── Header.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── MetalRateCard.tsx          # Karte pro Metall
│   │   ├── MetalRateTable.tsx         # Tabelle wie im Screenshot
│   │   └── BestPriceSection.tsx       # "Beste Preise Gram" Bereich
│   ├── spot-rules/
│   │   ├── StandardRulesTable.tsx     # Standardregeln (Mo-So)
│   │   ├── SpecialRulesTable.tsx      # Sonderregeln (Feiertage)
│   │   ├── RuleEditDialog.tsx
│   │   └── MetalSelector.tsx          # Links: Gold/Silver/Platin/Palladium
│   ├── products/
│   │   ├── ProductList.tsx            # Shop-Preise Tabelle
│   │   ├── ProductPriceRow.tsx
│   │   ├── ProductDetailForm.tsx      # Preis-Bearbeitung
│   │   └── FormulaDisplay.tsx
│   ├── articles/
│   │   ├── SKUBuilder.tsx             # SKU-Generator mit Dropdowns
│   │   ├── SKUParser.tsx              # SKU-String → Komponenten
│   │   └── ArticleForm.tsx
│   ├── master-data/
│   │   └── DataTable.tsx              # Wiederverwendbare CRUD-Tabelle
│   └── common/
│       ├── Modal.tsx
│       ├── ConfirmDialog.tsx
│       ├── LoadingSpinner.tsx
│       └── FormulaEditor.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── useRBAC.ts
├── lib/
│   ├── api/
│   │   ├── client.ts                 # API-Abstraktionsschicht
│   │   ├── mock-data.ts              # Alle Mock-Daten
│   │   ├── types.ts                  # Shared TypeScript-Typen
│   │   └── endpoints/
│   │       ├── rates.ts
│   │       ├── articles.ts
│   │       ├── spot-rules.ts
│   │       ├── customer-groups.ts
│   │       ├── formulas.ts
│   │       └── holidays.ts
│   ├── sku/
│   │   ├── builder.ts                # SKU-Generierungslogik
│   │   ├── parser.ts                 # SKU-Parsing
│   │   ├── validator.ts              # SKU-Validierung
│   │   └── constants.ts              # Alle SKU-Codes (Material, Produkt, etc.)
│   ├── formula/
│   │   └── evaluator.ts              # Formel-Auswertung mit mathjs
│   └── utils.ts
├── context/
│   └── AuthContext.tsx
└── types/
    └── index.ts
```

### 5.2 TypeScript-Typen (src/types/index.ts)

```typescript
// ============ METAL RATES ============
export interface Metal {
  id: number;
  symbol: 'XAU' | 'XAG' | 'XPT' | 'XPD';
  name: string;          // 'Gold', 'Silver', 'Platin', 'Palladium'
  unit: string;          // 'oz' oder 'gram'
  isActive: boolean;
}

export interface MetalRate {
  id: number;
  metalId: number;
  metal?: Metal;
  rateDate: string;      // ISO date
  rateEur: number;       // Preis pro Einheit in EUR
  rateUsd: number;       // Preis pro Einheit in USD
  rateEurPerGram: number;// Umgerechnet auf Gramm
  rateUsdPerGram: number;
  source: string;        // 'metals-api', 'boerse-online', 'manual'
  fetchedAt: string;     // ISO timestamp
  isManual: boolean;
}

// ============ SPOT RULES (Kern des Preistool!) ============
export type PriceDirection = 'verkauf' | 'ankauf';

export interface SpotRule {
  id: number;
  metalId: number;
  metal?: Metal;
  direction: PriceDirection;  // Verkauf oder Ankauf
  ruleType: 'standard' | 'special';
  // Standard-Regeln:
  dayOfWeek?: number;         // 0=Sonntag, 1=Montag, ..., 6=Samstag
  dayName?: string;           // 'Montag', 'Dienstag', etc.
  // Sonder-Regeln:
  specialDate?: string;       // ISO date
  description?: string;       // 'Karfreitag', 'Weihnachten', etc.
  // Gemeinsam:
  timeFrom: string;           // '00:00'
  timeTo: string;             // '23:59'
  isActive: boolean;
  formula: string;            // z.B. '($spot+1.42)' oder '$spot*2'
  calculatedValue: number;    // Aktuell berechneter Wert
}

// ============ CUSTOMER GROUPS ============
export interface CustomerGroup {
  id: number;
  name: string;               // 'Kunde', 'Mitglieder', 'Haendler', 'Lizenzpartner'
  code: string;               // 'K', 'M', 'H', 'L'
  description?: string;
  discountPercent: number;
  isActive: boolean;
}

// ============ SKU COMPONENTS ============
export interface SKUComponents {
  material: string;           // 'Au', 'Ag', etc.
  product: string;            // 'CB', 'TB', 'PB', etc.
  taxType: string;            // 'o', 'r', 'd'
  manufacturer: string;       // 'J0001', 'J0002', etc.
  quantity: string;           // 'S0001', 'S0100', etc.
  weight: string;             // 'G00001', 'G70001', etc.
  supplier: string;           // 'HM', 'CH', etc.
}

// ============ ARTICLES ============
export interface Article {
  id: number;
  sku: string;                // Generiert nach SKU-System
  skuComponents: SKUComponents;
  name: string;               // z.B. '20 x 1 Gramm Gold Combibarren (Valcambi)'
  metalId: number;
  metal?: Metal;
  weightGrams: number;
  priceType: PriceDirection;  // 'verkauf' oder 'ankauf'
  formulaId?: number;
  formula?: Formula;
  isActive: boolean;
  isInShop: boolean;          // Im PrestaShop/WooCommerce aktiv?
  country: string;            // 'DE'
}

// ============ ARTICLE PRICES (pro Kundengruppe) ============
export interface ArticlePrice {
  id: number;
  articleId: number;
  article?: Article;
  customerGroupId: number;
  customerGroup?: CustomerGroup;
  formula: string;            // z.B. '($spot*$weight+53.95)*1.045'
  spotPricePerGram: number;   // Aktueller Spot x Gewicht
  weightGrams: number;
  prestashopPrice: number;    // Aktueller Preis im Shop
  nettoPrice: number;         // Berechneter Netto-Preis
  bruttoPrice: number;        // Brutto = DE Steuer
  priceDate: string;
  isPublished: boolean;
}

// ============ FORMULAS ============
export interface Formula {
  id: number;
  name: string;
  description?: string;
  expression: string;         // z.B. '($spot*$weight+53.95)*1.045'
  variables: string[];        // ['$spot', '$weight']
  isActive: boolean;
}

// ============ HOLIDAYS ============
export interface Holiday {
  id: number;
  name: string;
  holidayDate: string;
  description?: string;
  formula?: string;           // Sonderregel-Formel für diesen Tag
}

// ============ AUTH ============
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: Role[];
}

export interface Role {
  id: number;
  name: 'Admin' | 'PriceEditor' | 'Viewer';
  description?: string;
}

export type Permission =
  | 'view_dashboard'
  | 'fetch_rates'
  | 'adjust_rates'
  | 'view_calculations'
  | 'edit_prices'
  | 'recalculate'
  | 'publish_prices'
  | 'manage_formulas'
  | 'view_holidays'
  | 'manage_holidays'
  | 'manage_customer_groups'
  | 'manage_articles'
  | 'manage_users'
  | 'manage_roles';
```

### 5.3 Mock-Daten (src/lib/api/mock-data.ts)

Die Mock-Daten sollen die Screenshots des bestehenden Preistools so realistisch wie möglich abbilden:

```typescript
// WICHTIG: Die Werte stammen aus den Screenshots des bestehenden Preistool

export const mockMetalRates: MetalRate[] = [
  {
    id: 1, metalId: 1,
    rateDate: '2025-11-06',
    rateUsd: 97.20, rateEur: 111.9901,
    rateUsdPerGram: 97.20, rateEurPerGram: 111.9901,
    source: 'boerse-online',
    fetchedAt: '2025-11-06T11:01:54',
    isManual: false,
  },
  // Silver: USD 1.18, EUR 1.3601
  // Platin: USD 37.97, EUR 43.7564
  // Palladium: USD 34.37, EUR 39.5985
];

export const mockSpotRulesGoldVerkauf: SpotRule[] = [
  // Standardregeln (aus Screenshot Seite 2)
  { id: 1, metalId: 1, direction: 'verkauf', ruleType: 'standard',
    dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59',
    isActive: false, formula: '($spot+3.2)', calculatedValue: 115.1901 },
  { id: 2, metalId: 1, direction: 'verkauf', ruleType: 'standard',
    dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59',
    isActive: false, formula: '($spot+0.145)', calculatedValue: 112.1351 },
  { id: 3, metalId: 1, direction: 'verkauf', ruleType: 'standard',
    dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59',
    isActive: false, formula: '($spot+1.42)', calculatedValue: 113.4101 },
  { id: 4, metalId: 1, direction: 'verkauf', ruleType: 'standard',
    dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59',
    isActive: false, formula: '($spot+1.42)', calculatedValue: 113.4101 },
  { id: 5, metalId: 1, direction: 'verkauf', ruleType: 'standard',
    dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59',
    isActive: true, formula: '($spot+1.42)', calculatedValue: 113.4101 },
  { id: 6, metalId: 1, direction: 'verkauf', ruleType: 'standard',
    dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59',
    isActive: false, formula: '($spot+1.82)', calculatedValue: 113.8101 },
  { id: 7, metalId: 1, direction: 'verkauf', ruleType: 'standard',
    dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59',
    isActive: false, formula: '($spot+3.2)', calculatedValue: 115.1901 },

  // Sonderregeln (aus Screenshot Seite 2)
  { id: 101, metalId: 1, direction: 'verkauf', ruleType: 'special',
    specialDate: '2025-01-02', description: 'Schließzeit XMas',
    timeFrom: '00:00', timeTo: '23:59', isActive: false,
    formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 102, metalId: 1, direction: 'verkauf', ruleType: 'special',
    specialDate: '2025-04-18', description: 'Karfreitag',
    timeFrom: '00:00', timeTo: '23:59', isActive: false,
    formula: '$spot+2', calculatedValue: 113.9901 },
  // ... weitere Feiertage
];

// Shop-Preise (aus Screenshot Seite 3)
export const mockArticlePrices: ArticlePrice[] = [
  // SILBERBARREN AG-MB-00500G-CI 500 Gramm Silber Münzbarren (Cook Islands)
  {
    id: 1, articleId: 1, customerGroupId: 1,
    formula: '$spot*$weight*1.1986*1.021',
    spotPricePerGram: 672.90, weightGrams: 500,
    prestashopPrice: 823.4700, nettoPrice: 823.4752, bruttoPrice: 823.4752,
    priceDate: '2025-11-06', isPublished: true,
  },
  // ... weitere wie im Screenshot
];
```

### 5.4 Seiten-Implementierung – Detaillierte Anweisungen

#### 5.4.1 Sidebar-Navigation (wie im Screenshot)

Die Sidebar muss folgende Struktur haben (abgeleitet aus dem bestehenden Preistool):

```
AKTUELLE ONLINE PREISE          → /dashboard
SPOTPREIS VERKAUF                → /spot-rules/verkauf
SPOTPREIS ANKAUF                 → /spot-rules/ankauf  (rot markiert)
PRODUKTPREISE                    → /products
AUS PS IMPORTIEREN               → /import
KONFIGURATOR                     → /configurator
LOGS                             → /logs

--- Separator ---

SPOT+REGEL AKTUELL (GRAMM):     (Info-Bereich, kein Link)
  VKF. GOLD €113.4101 10:00 BOERSO...
  VKF. SILVER €1.3458 10:00 BOERSON...
  VKF. PLATIN €44.5565 10:00 BOERSE0...
  VKF. PALLADIUM €54.5985 10:00 BO...
  ANK. GOLD €111.9901 10:00 BOERSE...
  ANK. SILVER €1.3601 10:00 BOERSE...
  ANK. PLATIN €43.7565 10:00 BOERSE...
  ANK. PALLADIUM €39.5985 10:00 BO...

--- Separator (nur für Admin) ---

STAMMDATEN                       (Bereich)
  Kundengruppen                  → /master-data/customer-groups
  Formeln                        → /master-data/formulas
  Artikel                        → /master-data/articles
  Hersteller                     → /master-data/manufacturers
  Lieferanten                    → /master-data/suppliers
  Feiertage                      → /holidays
  Rollen                         → /master-data/roles
  Benutzer                       → /master-data/users
  Benutzer-Rollen                → /master-data/user-roles
```

#### 5.4.2 Dashboard – Aktuelle Preise (/dashboard)

Basierend auf Screenshot Seite 1:

**Header-Bereich:**
- Titel: "Aktuelle Preise"
- "LETZTE SEITENAKTUALISIERUNG: [Uhrzeit]"
- Hinweis: "Preise, die aelter als 650000 Sekunden sind, werden als ungueltig betrachtet"
- "Dollar in Euro = (aus Börse.de am [Uhrzeit])"

**Haupttabelle:** (Produkt × Dienstleister Matrix)
| | Einheit | USD | EUR | Preisdatum | Aelter |
|---|---|---|---|---|---|
| Gold | Gram | 97.2 | 111.9901 | 06-11-2025 11:01:54 | 3713 Sek. ✓ |
| Platin | Gram | 37.97 | 43.7564 | ... | ... |
| Palladium | Gram | 34.37 | 39.5985 | ... | ... |
| Silver | Gram | 1.18 | 1.3601 | ... | ... |

**Beste Preise Gram** (Detail-Bereich):
- Pro Metall eine Box mit: Provider id, US dollar price, Euro price, Conversion rate, Default price increase

**Buttons:** "Neu laden" (PriceEditor+), Alters-Indikator (grün=aktuell, rot=veraltet)

#### 5.4.3 Spotpreis-Regeln Verkauf (/spot-rules/verkauf)

Basierend auf Screenshot Seite 2:

**Header:**
- Titel: "Spot Preise (Gramm)"
- Untertitel: "Gold Verkauf Spotpreis Aktuell: 111.9901"
- Tabs oder Links oben: "SPOTPREIS UND REGELN VERKAUF / SPOTPREIS UND REGELN ANKAUF"

**Metall-Auswahl (links in Sidebar oder als Tabs):**
- GOLD 00:00 23:59 €113.4101
- SILVER 00:00 23:59 €1.3458
- PLATIN 00:00 23:59 €44.5565
- PALLADIUM 00:00 23:59 €54.5985

**Standardregeln Verkauf + (klickbar zum Hinzufügen):**

| Tag | Von | Bis | Aktiv | Formel | Wert | Aktion |
|-----|-----|-----|-------|--------|------|--------|
| Sonntag | 00:00 | 23:59 | ☐ | ($spot+3.2) | 115.1901 | ✏️ ❌ |
| Montag | 00:00 | 23:59 | ☐ | ($spot+0.145) | 112.1351 | ✏️ ❌ |
| Dienstag | 00:00 | 23:59 | ☐ | ($spot+1.42) | 113.4101 | ✏️ ❌ |
| Mittwoch | 00:00 | 23:59 | ☐ | ($spot+1.42) | 113.4101 | ✏️ ❌ |
| **Donnerstag** | **00:00** | **23:59** | **☑** | **($spot+1.42)** | **113.4101** | ✏️ ❌ |
| Freitag | 00:00 | 23:59 | ☐ | ($spot+1.82) | 113.8101 | ✏️ ❌ |
| Samstag | 00:00 | 23:59 | ☐ | ($spot+3.2) | 115.1901 | ✏️ ❌ |

- Aktiver Tag (heute) wird **grün hervorgehoben**
- "Wert" wird live berechnet aus Formel + aktuellem Spotpreis

**Sonderregeln Verkauf + (klickbar zum Hinzufügen):**

| Datum | Von | Bis | Beschreibung | Aktiv | Formel | Wert | Aktion |
|-------|-----|-----|-------------|-------|--------|------|--------|
| 2025-01-02 | 00:00 | 23:59 | Schließzeit XMas | ☐ | $spot+2 | 113.9901 | ✏️ ❌ |
| 2025-04-18 | 00:00 | 23:59 | Karfreitag | ☐ | $spot+2 | 113.9901 | ✏️ ❌ |
| 2025-04-21 | 00:00 | 23:59 | Ostermontag | ☐ | $spot+2 | 113.9901 | ✏️ ❌ |
| ... | | | | | | | |

#### 5.4.4 Shop-Preise / Produktpreise (/products)

Basierend auf Screenshot Seite 3:

**Header:**
- Titel: "Shop Preise"
- Suchfeld: "SKU oder Produktname" + "Senden"-Button
- Pagination: "Ergebnisse [1-25] | Seite(n): >> 1 << | 2 | 3 | ... | 14 oder alle Produkte anzeigen"

**Pro Artikel ein Block:**
```
[SILBERBARREN] [AG-MB-00500G-CI] 500 GRAMM SILBER MÜNZBARREN (COOK ISLANDS) [INAKTIVE IN PRESTASHOP]
```

| Id | Spot-Price x Gewicht (Gramm) | Gewicht (Gramm) | Prestashop-Price (€) | Gruppe | Formel | Netto (€) | Brutto + DE Steuer (€) |
|---|---|---|---|---|---|---|---|
| 1 | 672.90 | 500.0000 | 823.4700 | Kunde | $spot*$weight*1.1986*1.021 ✏️ | 823.4752 | 823.4752 |
| 1 | 672.90 | 500.0000 | 820.2400 | Mitglieder | $spot*$weight*1.1986*1.017 ✏️ | 820.2491 | 820.2491 |
| 1 | 672.90 | 500.0000 | 858.9600 | Haendler | $spot*$weight*1.1986*1.065 ✏️ | 858.9629 | 858.9629 |
| 1 | 672.90 | 500.0000 | 809.9200 | Lizenzpartner | $spot*$weight*1.1986*1.0042 ✏️ | 809.9254 | 809.9254 |
| 1 | 680.05 | 500.0000 | 680.0500 | Ankauf | $spot*$weight ✏️ | 680.0500 | 680.0500 |

- Farbcodierung: Grün-Header = aktiv im Shop, Rot-Label = "INAKTIVE IN PRESTASHOP"
- Formel-Spalte hat Edit-Icon (✏️) zum Öffnen der Detail-Seite
- Ankauf-Zeile hat einen anderen Spot-Preis (Ankauf-Regel statt Verkauf-Regel)

#### 5.4.5 Preis-Bearbeitung (/products/[articleId])

Basierend auf Screenshot Seite 4:

**Artikel-Header:** "20 x 1 Gramm Gold Combibarren (Valcambi)" (mit Produktbild-Platzhalter)

**Detail-Formular:**

| Key | Value |
|-----|-------|
| SKU | Au-TB-00020g-VC (Id: 2) |
| Customer Group | [H] HAENDLER |
| Einheit | Gram |
| Preis-Typ | Verkauf |
| Gewicht (Gramms) | [20.0000000] — Quick-Links: 1/4U 1/3U 1/2U 1U 2U 3U 4U |
| Formula | [($spot*$weight+53.95)*1.045] — Link: ( $spot * = $weight ) |
| Country | DE |

**Buttons:** [Save] [Cancel]

**Hinweis-Bereich:**
| Einheit | Gramm |
|---------|-------|
| 1 Unze | 31.1034768 Grams |
| 1/4 Unzen | 7.7758692 Grams |
| 1/3 Unzen | 10.3678256 Grams |
| 1/2 Unzen | 15.5517384 Grams |
| 2 Unzen | 62.2069536 Grams |
| 3 Unzen | 93.3104304 Grams |
| 4 Unzen | 124.4139072 Grams |

#### 5.4.6 Artikel-Stammdaten mit SKU-Builder (/master-data/articles)

**Neue Seite (nicht im bestehenden Preistool):**

- CRUD-Tabelle aller Artikel
- "Neuer Artikel"-Button öffnet Dialog mit SKU-Builder
- SKU-Builder: 7 Dropdown-Felder (Material, Produkt, Besteuerung, Hersteller, Stückzahl, Grammatur, Lieferant)
- Automatische SKU-Generierung: Live-Vorschau der generierten SKU
- Gewicht wird automatisch aus Grammatur-Code vorgeschlagen
- Validierung: Existiert die SKU bereits?
- Manuelles SKU-Feld mit Parse-Funktion (SKU eingeben → Dropdowns werden gesetzt)

### 5.5 Formel-Engine (Phase 0 – clientseitig)

Die Formeln aus den Screenshots verwenden `$spot` und `$weight` als Variablen:

```typescript
// src/lib/formula/evaluator.ts
import { evaluate } from 'mathjs';

interface FormulaContext {
  $spot: number;      // Aktueller Spotpreis (nach Regel) in EUR/Gramm
  $weight: number;    // Gewicht in Gramm
  // Weitere mögliche Variablen:
  factor?: number;
  margin?: number;
  processing_fee?: number;
}

export function evaluateFormula(formula: string, context: FormulaContext): number {
  // Ersetze Variablen im Formel-String
  let expr = formula;
  for (const [key, value] of Object.entries(context)) {
    expr = expr.replaceAll(key, String(value));
  }
  try {
    return evaluate(expr);
  } catch (e) {
    console.error('Formel-Fehler:', formula, context, e);
    return 0;
  }
}

// Beispiel:
// evaluateFormula('($spot*$weight+53.95)*1.045', { $spot: 113.4101, $weight: 20 })
// → (113.4101 * 20 + 53.95) * 1.045 = 2427.49...
```

### 5.6 Login (Mock)

In Phase 0 akzeptiert die Login-Seite jeden Benutzernamen/Passwort und setzt einen Mock-JWT:

```typescript
// Mock-Login: admin/admin → Admin-Rolle
// Mock-Login: editor/editor → PriceEditor-Rolle
// Mock-Login: viewer/viewer → Viewer-Rolle
```

### 5.7 Phase 0 Checkliste

- [ ] Next.js Projekt mit shadcn/ui aufsetzen
- [ ] TypeScript-Typen definieren
- [ ] API-Abstraktionsschicht mit Mock-Data-Switch
- [ ] Mock-Daten basierend auf Screenshots erstellen
- [ ] Layout: Sidebar + Header + ProtectedRoute
- [ ] Login-Seite (Mock-Auth)
- [ ] Dashboard: Aktuelle Preise (Tabelle + Beste Preise)
- [ ] Spotpreis-Regeln Verkauf (Standardregeln + Sonderregeln)
- [ ] Spotpreis-Regeln Ankauf (gleiche Struktur wie Verkauf)
- [ ] Shop-Preise / Produktpreise (Artikelliste mit Kundengruppen-Preisen)
- [ ] Preis-Bearbeitung (Detail-Formular pro Artikel/Kundengruppe)
- [ ] SKU-System: Constants, Builder, Parser, Validator
- [ ] SKU-Builder-Komponente (Dropdowns + Live-Vorschau)
- [ ] Artikel-Stammdaten mit SKU-Builder
- [ ] Kundengruppen CRUD
- [ ] Formeln CRUD mit Formel-Editor
- [ ] Hersteller CRUD
- [ ] Lieferanten CRUD
- [ ] Feiertage CRUD
- [ ] Benutzer CRUD (Admin)
- [ ] Rollen CRUD (Admin)
- [ ] Benutzer-Rollen-Zuweisung (Admin)
- [ ] Formel-Engine (clientseitig mit mathjs)
- [ ] Konfigurationsseite
- [ ] Import-Seite (Platzhalter)
- [ ] Logs-Seite (Platzhalter)
- [ ] Responsive Design / Mobile-Friendly
- [ ] Deutsche UI-Labels durchgehend

---

## 6. Phase 1 – Backend-Foundation + Datenbankanbindung

### Ziel
Backend aufsetzen, Datenbank migrieren, API-Layer im Frontend umstellen.

### 6.1 Tasks

- [ ] Docker-Compose mit MySQL + Backend + Frontend
- [ ] Prisma-Schema basierend auf Kapitel 9 (inkl. SKU-Tabellen)
- [ ] Seed-Script (Rollen, Admin-User, Metalle, SKU-Stammdaten)
- [ ] Express.js Backend mit TypeScript
- [ ] JWT-Auth (Login, Logout, Me, Change-Password)
- [ ] RBAC-Middleware
- [ ] CRUD-Endpunkte für alle Entities
- [ ] Frontend: `NEXT_PUBLIC_USE_MOCK=false` → Echte API-Calls
- [ ] Fehlerbehandlung und Validierung

### 6.2 Erweiterte DB-Tabellen (für SKU-System)

```sql
-- Zusätzlich zum Basis-Schema:

CREATE TABLE material_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(5) NOT NULL UNIQUE,      -- 'Au', 'Ag', etc.
  name VARCHAR(50) NOT NULL,            -- 'Gold', 'Silber', etc.
  metal_id INT,                         -- Referenz auf metals-Tabelle
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (metal_id) REFERENCES metals(id)
);

CREATE TABLE product_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(5) NOT NULL UNIQUE,      -- 'PB', 'GB', 'CB', etc.
  name VARCHAR(100) NOT NULL,           -- 'Prägebarren', etc.
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE tax_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code CHAR(1) NOT NULL UNIQUE,         -- 'o', 'r', 'd'
  name VARCHAR(100) NOT NULL,           -- 'Ohne Steuer', etc.
  rate DECIMAL(5,2) DEFAULT 0,          -- 0, 19, etc.
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE manufacturers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,     -- 'J0001', 'J0002', etc.
  name VARCHAR(255) NOT NULL,           -- 'Heimerle & Meule', etc.
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE weight_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,     -- 'G00001', 'G70001', etc.
  grams DECIMAL(12,7) NOT NULL,         -- Gewicht in Gramm
  label VARCHAR(50),                    -- '1 g', '1 oz', '1/4 oz', etc.
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE quantity_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,     -- 'S0001', 'S0100', etc.
  quantity INT NOT NULL,                -- 1, 20, 50, 100, 250
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(5) NOT NULL UNIQUE,      -- 'HM', 'CH', etc.
  name VARCHAR(255) NOT NULL,           -- 'Heimerle & Meule', etc.
  is_active BOOLEAN DEFAULT TRUE
);

-- Spot-Regeln (Kern des Systems)
CREATE TABLE spot_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  metal_id INT NOT NULL,
  direction ENUM('verkauf', 'ankauf') NOT NULL,
  rule_type ENUM('standard', 'special') NOT NULL,
  day_of_week TINYINT,                  -- 0-6 für Standardregeln
  special_date DATE,                    -- Für Sonderregeln
  description VARCHAR(255),
  time_from TIME DEFAULT '00:00:00',
  time_to TIME DEFAULT '23:59:59',
  is_active BOOLEAN DEFAULT FALSE,
  formula VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (metal_id) REFERENCES metals(id),
  INDEX idx_metal_direction (metal_id, direction),
  INDEX idx_special_date (special_date)
);
```

---

## 7. Phase 2 – Kernfunktionen

- [ ] Metallkurs-Abruf von metals-api.com (oder BörseOnline)
- [ ] Kurshistorie + Dashboard-Chart (letzten 30 Tage, Recharts)
- [ ] Formel-Engine im Backend (mathjs, kein eval())
- [ ] Spot-Regel-Engine: Automatische Bestimmung der aktiven Regel basierend auf Wochentag/Datum/Uhrzeit
- [ ] Preisberechnung: Für jeden Artikel × Kundengruppe
- [ ] Live-Neuberechnung wenn Spotpreis sich ändert
- [ ] Import-Funktion (aus PrestaShop-CSV oder ähnlich)
- [ ] Konfigurator (Einstellungen für Rate-Provider, Intervalle, etc.)

---

## 8. Phase 3 – Integrationen & Polish

- [ ] Preis-Publishing an WooCommerce/PrestaShop
- [ ] Öffentliche REST-API (Basic Auth für WebShop/ERP)
- [ ] Preis-Archivierung
- [ ] Feiertagsbewusstes Scheduling (kein Rate-Fetch an Feiertagen → Sonderregel)
- [ ] Automatischer Tagesregel-Wechsel (Cron: Aktiviere die Regel für den aktuellen Tag)
- [ ] Logging-System (Seite /logs)
- [ ] UI-Polish: Ladeanimationen, Error-States, Toast-Benachrichtigungen
- [ ] Auto-Refresh der Spotpreise (einstellbares Intervall)
- [ ] E-Mail-Benachrichtigungen bei großen Kursänderungen

---

## 9. Datenbank-Schema

(Siehe Kapitel 6.2 für SKU-Erweiterungen. Das vollständige Basis-Schema ist im Original-Spec-Dokument in Kapitel 4 detailliert beschrieben.)

### Zusammenfassung aller Tabellen

| Tabelle | Beschreibung |
|---------|-------------|
| users | Benutzer |
| roles | Rollen (Admin, PriceEditor, Viewer) |
| user_roles | Benutzer-Rollen-Zuweisung |
| metals | Metall-Stammdaten (XAU, XAG, XPT, XPD) |
| metal_rates | Tägliche Metallkurse |
| customer_groups | Kundengruppen (Kunde, Mitglieder, Haendler, Lizenzpartner, Ankauf) |
| formulas | Formel-Definitionen |
| articles | Artikel mit SKU |
| article_customer_group_prices | Preise pro Artikel × Kundengruppe |
| price_archive | Historische Preise |
| holidays | Feiertage |
| spot_rules | Spotpreis-Regeln (Standard + Sonder) |
| material_codes | SKU: Material-Codes |
| product_codes | SKU: Produkt-Codes |
| tax_types | SKU: Besteuerungs-Arten |
| manufacturers | SKU: Hersteller |
| weight_codes | SKU: Grammatur-Codes |
| quantity_codes | SKU: Stückzahl-Codes |
| suppliers | SKU: Lieferanten |

---

## 10. API-Endpunkte

(Vollständig dokumentiert im Original-Spec. Hier nur die Ergänzungen:)

### Zusätzliche Endpunkte für PriceEngine

| Method | Endpoint | Role | Beschreibung |
|--------|----------|------|-------------|
| GET | `/api/spot-rules` | Viewer+ | Alle Spot-Regeln |
| GET | `/api/spot-rules/:metalId/:direction` | Viewer+ | Regeln pro Metall+Richtung |
| POST | `/api/spot-rules` | PriceEditor+ | Neue Regel erstellen |
| PUT | `/api/spot-rules/:id` | PriceEditor+ | Regel bearbeiten |
| DELETE | `/api/spot-rules/:id` | Admin | Regel löschen |
| POST | `/api/spot-rules/activate` | PriceEditor+ | Tagesregel aktivieren |
| GET | `/api/sku/materials` | Viewer+ | Material-Codes |
| GET | `/api/sku/products` | Viewer+ | Produkt-Codes |
| GET | `/api/sku/manufacturers` | Viewer+ | Hersteller |
| GET | `/api/sku/weights` | Viewer+ | Grammatur-Codes |
| GET | `/api/sku/quantities` | Viewer+ | Stückzahl-Codes |
| GET | `/api/sku/suppliers` | Viewer+ | Lieferanten |
| POST | `/api/sku/validate` | Viewer+ | SKU validieren |
| POST | `/api/sku/parse` | Viewer+ | SKU parsen |

---

## 11. Geschäftslogik im Detail

### 11.1 Spotpreis-Bestimmung (KERNLOGIK)

So bestimmt das System den aktuellen Verkaufs-/Ankaufspreis:

1. **Basis-Spotpreis** holen: Aktueller EUR/Gramm-Kurs vom Rate-Provider
2. **Prüfe Sonderregeln:** Gibt es für heute ein passendes Datum in `spot_rules` (ruleType=special, direction=verkauf/ankauf)?
   - Ja → Verwende diese Formel
   - Nein → Weiter zu Schritt 3
3. **Verwende Standardregel:** Finde die Regel für den aktuellen Wochentag (ruleType=standard, direction=verkauf/ankauf)
4. **Formel anwenden:** Ersetze `$spot` mit dem Basis-Spotpreis und berechne
5. **Ergebnis** = "Verkauf Spotpreis Aktuell" bzw. "Ankauf Spotpreis Aktuell"

### 11.2 Artikelpreis-Berechnung

Für jeden Artikel × Kundengruppe:

1. **Spot holen:** Den berechneten Spotpreis (nach Regel, siehe 11.1)
2. **Gewicht:** Aus dem Artikel
3. **Formel:** Die individuelle Formel für diesen Artikel/Kundengruppe
4. **Berechne:** z.B. `($spot * $weight + 53.95) * 1.045`
5. **Steuer:** Je nach Besteuerungsart (aus SKU-Code) ggf. 19% aufschlagen

### 11.3 Kundengruppen (aus Screenshots)

| Gruppe | Beschreibung | Typischer Faktor |
|--------|-------------|-----------------|
| Kunde | Endkunde / Retail | Höchster Aufschlag (z.B. *1.021 - *1.034) |
| Mitglieder | Registrierte Mitglieder | Leichter Rabatt (z.B. *1.017 - *1.026) |
| Haendler | Händler | Mittlerer Aufschlag (z.B. *1.045 - *1.065) |
| Lizenzpartner | Partner | Niedrigster Aufschlag (z.B. *1.0042 - *1.0049) |
| Ankauf | Rückkauf-Preis | Kein Aufschlag, oft unter Spot ($weight*$spot*0.98) |

---

## 12. Projektstruktur (Gesamtprojekt)

```
price-engine/
├── docker-compose.yml
├── .env.example
├── README.md
├── CLAUDE.md                         # ← Claude Code Anweisungen
│
├── frontend/                         # Phase 0 startet hier
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── .env.local                    # NEXT_PUBLIC_USE_MOCK=true
│   └── src/
│       └── (siehe Phase 0 Ordnerstruktur)
│
├── backend/                          # Ab Phase 1
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── index.ts
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── jobs/
│       ├── utils/
│       └── types/
│
└── mysql/
    └── init/
        └── 01-schema.sql
```

---

## 13. Docker-Setup

(Vollständig dokumentiert im Original-Spec, Kapitel 9. Für Phase 0 wird nur das Frontend gestartet: `npm run dev` im frontend/-Ordner.)

---

## 14. UI/UX-Anforderungen

### 14.1 Sprache
- **Primär: Deutsch** – Alle Labels, Buttons, Fehlermeldungen
- Navigation, Formular-Labels, Tabellen-Header: alles auf Deutsch
- Beispiele: "Speichern", "Abbrechen", "Neuer Eintrag", "Bearbeiten", "Löschen", "Aktiv", "Inaktiv"

### 14.2 Zahlenformat
- **Deutsches Locale:** Komma als Dezimaltrenner, Punkt als Tausender
- Ausnahme: In Formeln und internen Berechnungen → englisches Format (Punkt als Dezimal)
- Anzeige: 1.234,5678 €
- API/Intern: 1234.5678

### 14.3 Farbschema (abgeleitet vom bestehenden Preistool)
- Sidebar: Dunkel (dark-gray/charcoal)
- Header/Breadcrumb: Grün/Teal (#2d7d6d oder ähnlich)
- Aktive Regel: Grüne Zeile
- Sonderregeln: Orange/Gelbe Header
- Inaktiv im Shop: Rotes Label
- Aktiv im Shop: Grünes Label

### 14.4 Responsiveness
- Desktop-First (Hauptanwendungsfall)
- Sidebar collapsible auf kleineren Bildschirmen
- Tabellen mit horizontalem Scroll auf Mobile

---

## 15. Nicht-funktionale Anforderungen

- **Sicherheit:** Alle Endpunkte geschützt, kein SQL-Injection (Prisma), XSS-Prävention, Rate-Limiting auf Auth
- **Performance:** Produktliste mit 500+ Artikeln × 5 Kundengruppen ohne Lag
- **Deployment:** `docker-compose up` startet alles
- **Backup:** MySQL-Volume persistiert, regelmäßige Dumps empfohlen
- **Browser:** Chrome, Firefox, Edge, Safari (aktuell)

---

## CLAUDE.md – Anweisungen für Claude Code

Wenn du dieses Projekt mit Claude Code umsetzt, lege eine `CLAUDE.md` im Root an mit folgendem Inhalt:

```markdown
# PriceEngine – Claude Code Instructions

## Projekt
PriceEngine ist eine Edelmetall-Preisverwaltung. Siehe PRICEENGINE_PROJECT_PLAN.md für alle Details.

## Aktuelle Phase: Phase 0 (Frontend mit Mock-Daten)

## Wichtige Regeln
1. **IMMER** deutschen Text für UI-Labels verwenden
2. **IMMER** shadcn/ui Komponenten nutzen (nicht eigene bauen)
3. **IMMER** TypeScript strict mode
4. **IMMER** API-Calls über den api-Layer (src/lib/api/client.ts) – NIEMALS direkte fetches in Komponenten
5. **IMMER** Mock-Daten in src/lib/api/mock-data.ts zentral halten
6. **NIEMALS** eval() für Formeln – immer mathjs verwenden
7. **NIEMALS** Tailwind-Klassen hardcoden wenn shadcn eine Komponente dafür hat
8. Zahlen-Anzeige: Deutsches Format (1.234,5678)
9. Formeln intern: Englisches Format (1234.5678)

## Reihenfolge der Umsetzung (Phase 0)
1. Projektsetup (Next.js + shadcn + Dependencies)
2. TypeScript-Typen (src/types/index.ts)
3. SKU-System (src/lib/sku/) – Constants, Builder, Parser, Validator
4. API-Layer + Mock-Daten (src/lib/api/)
5. Formel-Engine (src/lib/formula/evaluator.ts)
6. Auth-Context + Mock-Login
7. Layout (Sidebar, Header, ProtectedRoute)
8. Dashboard (Aktuelle Preise)
9. Spotpreis-Regeln (Verkauf + Ankauf)
10. Shop-Preise / Produktpreise
11. Preis-Bearbeitung (Detail)
12. Artikel-Stammdaten mit SKU-Builder
13. Restliche Stammdaten-Seiten
14. Feiertage
15. Logs + Import + Konfigurator (Platzhalter)

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript (strict)
- Tailwind CSS + shadcn/ui
- mathjs (Formel-Auswertung)
- recharts (Charts)
- zustand (State Management)
- date-fns (Datum)
- lucide-react (Icons)

## Umgebungsvariablen (.env.local)
NEXT_PUBLIC_USE_MOCK=true
```

---

> **Nächster Schritt:** Dieses Dokument an Claude Code geben und mit Phase 0, Schritt 1 starten. Das Frontend kann sofort auf `localhost:3000` laufen – ohne Docker, ohne Backend, ohne Datenbank.
