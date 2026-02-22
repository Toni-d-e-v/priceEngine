# PriceEngine Progress

## Phase 0 – Frontend mit Mock-Daten

### Step 1: Project Setup ✅ 2026-02-08
- Created Next.js 16.1.6 project with TypeScript, Tailwind CSS v4, App Router, src directory
- Node.js v22.19.0 (set via .nvmrc)
- Initialized shadcn/ui and added components: button, card, input, label, select, table, tabs, dialog, badge, dropdown-menu, sheet, separator, tooltip, calendar, popover, form, command, checkbox, switch, textarea, sonner (toast deprecated → using sonner)
- Installed additional dependencies: lucide-react, recharts, mathjs, date-fns, zustand
- Created complete folder structure per section 5.1 (all directories and placeholder files)
- Created .env.local with NEXT_PUBLIC_USE_MOCK=true
- Created CLAUDE.md with project instructions
- TypeScript strict mode confirmed enabled
- App verified running successfully with npm run dev

### Step 2: TypeScript Types ✅ 2026-02-08
- Defined all interfaces in src/types/index.ts: Metal, MetalRate, SpotRule, CustomerGroup, SKUComponents, Article, ArticlePrice, Formula, Holiday, User, Role, Permission, ApiResponse, PaginatedResponse

### Step 3: SKU System ✅ 2026-02-08
- src/lib/sku/constants.ts: All SKU codes (Material, Product, Tax, Manufacturer, Weight, Quantity, Supplier) with lookup maps
- src/lib/sku/builder.ts: buildSKU(), getWeightFromCode(), buildArticleDescription()
- src/lib/sku/parser.ts: parseSKU(), formatSKUComponents()
- src/lib/sku/validator.ts: validateSKU(), validateSKUComponents()

### Step 4: API Layer + Mock Data ✅ 2026-02-08
- src/lib/api/client.ts: apiGet, apiPost, apiPut, apiDelete with mock/real switch
- src/lib/api/mock-data.ts: All mock data (metals, rates, spot rules for all 4 metals + verkauf/ankauf, customer groups, articles, article prices, formulas, holidays, roles, users) + getMockData router
- src/lib/api/types.ts: Re-exports from types/index.ts
- All 6 endpoint files: rates, spot-rules, articles, customer-groups, formulas, holidays

### Step 5: Formula Engine ✅ 2026-02-08
- src/lib/formula/evaluator.ts: evaluateFormula(), validateFormula(), extractVariables() using mathjs

### Step 6: Auth Context + Mock Login ✅ 2026-02-08
- src/context/AuthContext.tsx: AuthProvider with RBAC permissions per role
- src/hooks/useAuth.ts, useRBAC.ts, useApi.ts
- src/app/login/page.tsx: Mock login (admin/editor/viewer)

### Step 7: Layout ✅ 2026-02-08
- src/components/layout/Sidebar.tsx: Full navigation with main nav, spot info section, collapsible master data (admin only), user info + logout
- src/components/layout/Header.tsx: Dynamic page title + timestamp
- src/components/layout/ProtectedRoute.tsx: Auth guard with redirect to /login
- src/app/client-layout.tsx: Wraps AuthProvider, Toaster, Sidebar+Header for protected routes
- src/app/layout.tsx: Root layout with metadata
- src/app/page.tsx: Redirect to /dashboard
- src/components/common/LoadingSpinner, ConfirmDialog, Modal, FormulaEditor

### Step 8: Dashboard ✅ 2026-02-08
- src/app/dashboard/page.tsx: Rate cards, rate table, best prices section, reload button
- src/components/dashboard/MetalRateCard, MetalRateTable, BestPriceSection

### Step 9: Spot Rules (Verkauf + Ankauf) ✅ 2026-02-08
- src/app/spot-rules/verkauf/page.tsx & ankauf/page.tsx: Metal selector, standard + special rules tables, edit dialog
- src/components/spot-rules/MetalSelector, StandardRulesTable, SpecialRulesTable, RuleEditDialog

### Step 10: Product Prices ✅ 2026-02-08
- src/app/products/page.tsx: Search, article list with customer group prices
- src/components/products/ProductList, ProductPriceRow, FormulaDisplay

### Step 11: Price Detail/Edit ✅ 2026-02-08
- src/app/products/[articleId]/page.tsx: Dynamic route with group param
- src/components/products/ProductDetailForm: Full form with formula editor, weight quick-links, oz conversion table

### Step 12: Article Master Data + SKU Builder ✅ 2026-02-08
- src/app/master-data/articles/page.tsx: CRUD table + new article modal
- src/components/articles/SKUBuilder: 7 dropdown fields, live SKU preview, weight auto-fill
- src/components/articles/SKUParser: Manual SKU input + parse/validate
- src/components/articles/ArticleForm: Complete form with SKU builder

### Step 13: Other Master Data Pages ✅ 2026-02-08
- Customer Groups, Formulas, Manufacturers, Suppliers, Roles, Users, User-Roles
- All use reusable DataTable component

### Step 14: Holidays ✅ 2026-02-08
- src/app/holidays/page.tsx: CRUD table with formulas

### Step 15: Logs + Import + Configurator ✅ 2026-02-08
- src/app/logs/page.tsx: Mock log entries
- src/app/import/page.tsx: Placeholder with file upload
- src/app/configurator/page.tsx: Placeholder with settings form

### Build Verification ✅
- `npx next build` compiles successfully with 22 routes, no TypeScript errors

---

## Step A – Frontend Update per Spec V1.01 ✅ 2026-02-22

Alle Änderungen gemäß `VICTOREANUM.PriceEngine.Umsetzung_V1.01_WORK.pdf` umgesetzt.
Vollständige Referenz: `SPEC_V1_01_CHANGES.md`

### Types & Data Layer
- `src/types/index.ts`: Metal +XCU +globalSurcharge; CustomerGroup discountPercent→surchargePercent +direction; Article +faconCost +faconType +taxType; ArticlePrice -prestashopPrice +taxAmount; Neue Interfaces: TaxMapping, ArticleGroupSurcharge
- `src/lib/sku/constants.ts`: TAX_CODES -Differenzbesteuert; MATERIAL_TO_SYMBOL +Cu→XCU
- `src/lib/formula/evaluator.ts`: validateFormula Test-Context +$facon +$aufschlag
- `src/lib/api/mock-data.ts`: Metalle Palladium→Kupfer(XCU), +globalSurcharge, Silver→Silber; Kundengruppen neue Namen/Codes/surchargePercent/direction; Formeln +$facon/$aufschlag; Artikel +facon/tax Felder; Preise -prestashopPrice +taxAmount; +mockTaxMappings; Kommentare Silver→Silber
- `src/lib/api/endpoints/tax-mappings.ts`: **Neu** — CRUD Endpunkte

### Dashboard
- `src/app/dashboard/page.tsx`: Fetcht jetzt metals für globalSurcharge, übergibt an MetalRateCard/Table
- `MetalRateCard.tsx`: Zeigt Spot(1) = Spot(0) + globalSurcharge
- `MetalRateTable.tsx`: Neue Spalten: Aufschlag (editierbar), EUR (Spot 1), Formel Spot(1)

### Spot Rules
- `MetalSelector.tsx`: PALLADIUM/SILVER → KUPFER/SILBER
- `verkauf/page.tsx`, `ankauf/page.tsx`: metalNames Palladium→Kupfer, Silver→Silber

### Kalkulationsliste (Produktpreise)
- `ProductList.tsx`: +formulas Prop, Faconkosten/Steuertyp Badges im Header, neue Spalten: Formelname, Klartext-Formel, Faconkosten (inline-edit), Auf-/Abschlag (read-only), Kupferbarren Label
- `ProductPriceRow.tsx`: Formelname Badge (oder "individuell"), Klartext-Formel resolved, Faconkosten inline-editierbar, Aufschlag Badge, taxAmount statt prestashopPrice
- `products/page.tsx`: Fetcht jetzt auch Formeln

### Preis-Detail
- `ProductDetailForm.tsx`: +Faconkosten, +Facon-Typ Selector, +Besteuerung Selector

### Stammdaten
- `customer-groups/page.tsx`: Rabatt(%)→Aufschlag(%)
- `articles/page.tsx`: Palladium→Kupfer
- `ArticleForm.tsx`: +faconCost, +faconType, +taxType Felder
- `tax-mappings/page.tsx`: **Neu** — Steuerzuordnung CRUD-Seite

### Layout
- `Sidebar.tsx`: Pd→Cu/Kupfer, +Steuerzuordnung Nav-Item (+Receipt Icon)
- `BestPriceSection.tsx`: Palladium→Kupfer, Silver→Silber

### Build Verification ✅
- `npx next build` → 23 Routen, 0 TypeScript-Fehler (inkl. neue /master-data/tax-mappings)

---

## Step A.1 – Audit-Fixes ✅ 2026-02-22

Alle kritischen Issues aus dem Deep-Audit behoben.

### FormulaContext Interface
- `src/lib/formula/evaluator.ts`: FormulaContext erweitert um explizite `$facon?: number` und `$aufschlag?: number` Felder; `undefined`-Check in Variable-Substitution

### Mock-Preise Neuberechnung
- `src/lib/api/mock-data.ts`: Alle mockArticlePrices komplett neuberechnet mit korrekten Spot(2)-Werten und Formel-Auswertung
  - Gold VK Spot(2)=113.4101, Silber VK=1.3458, Ankauf-Spots korrekt
  - Aufschlag-Faktoren: R(1.0), M(1.026), H(1.02), P(1.042), A(1.0)
  - Jeder Preis hat dokumentierte Berechnungsherleitung als Kommentar
- **Artikel 6 (Silber 1kg, regelbesteuert)**: 5 neue Preise mit korrekter Steuerberechnung
  - taxAmount = nettoPrice * 0.19, bruttoPrice = nettoPrice + taxAmount

### Stammdaten-Seiten
- `articles/page.tsx`: +Facon-Spalte (Betrag + Typ), +Besteuerung-Spalte (Badge)
- `customer-groups/page.tsx`: +Richtung-Spalte (Verkauf/Ankauf Badge)

### Build Verification ✅
- `npx next build` → 23 Routen, 0 TypeScript-Fehler

---

## Step A.2 – Spot(2) Integration auf Dashboard ✅ 2026-02-22

Dashboard zeigt jetzt den kompletten Spot-Preis-Kette: Spot(0) → Spot(1) → Spot(2).

### Dashboard Page
- `src/app/dashboard/page.tsx`: Fetcht jetzt zusätzlich `getAllSpotRules()`, berechnet aktive VK-Regel pro Metall, übergibt `activeRule` an Cards und Table

### MetalRateCard
- `MetalRateCard.tsx`: Komplett überarbeitet — zeigt Spot(2) als Hauptpreis ("Kalkulationspreis"), darunter aufgeschlüsselt: Spot(0) Börse, +Aufschlag, =Spot(1), Zeitregel mit Formel

### MetalRateTable
- `MetalRateTable.tsx`: Neue Spalten "Zeitregel" (aktive Regel mit Formel + Name) und "EUR Spot(2)" (fett, grün hervorgehoben); Spot(2) wird aus `activeRule.calculatedValue` gelesen; alte "Formel Spot(1)" Spalte entfernt

### Build Verification ✅
- `npx next build` → 23 Routen, 0 TypeScript-Fehler

---

## Step A.3 – Dashboard Spot(0)-Kartice + Fehlende Spec-Seiten ✅ 2026-02-22

Dashboard-Kartice zeigen jetzt nur Spot(0) (wie im PDF), Tabelle zeigt den Spot-Lanac.
4 fehlende Features aus der Spec V1.01 ergänzt.

### Dashboard
- `MetalRateCard.tsx`: Zurück auf reines Spot(0) — nur Börsenpreis + USD (wie im PDF-Screenshot)
- `MetalRateTable.tsx`: Komplettkette Spot(0) → Aufschlag → Spot(1) → Zeitregel → **Spot(2)** (grün, bold)
- `dashboard/page.tsx`: Vereinfacht — Cards bekommen nur `rate`, Table bekommt `spotRules`

### Neue Seiten (3 Stück, +3 Routen)
- `/master-data/article-groups` — **Artikelgruppen** CRUD (GB, SB, PB, KB, GM, SM)
- `/master-data/article-group-surcharges` — **Artikelgruppen × Preisgruppen Zuschläge** Matrix-Tabelle (editierbar, VK-Gruppen)
- `/rate-history` — **Kurshistorie** mit Filter nach Metall, Quelle (Auto/Manuell), Datum-Von/Bis

### Neue Dateien
- `src/lib/api/endpoints/article-groups.ts` — CRUD + Surcharges Endpunkte
- `src/lib/api/endpoints/rate-history.ts` — getRateHistory()
- `src/types/index.ts`: Neues Interface `ArticleGroup { id, code, name, description, isActive }`; Article +articleGroupId

### Mock-Daten
- `mockArticleGroups` (6 Gruppen: Gold/Silber/Platin/Kupfer-Barren, Gold/Silber-Münzen)
- `mockArticleGroupSurcharges` (24 Einträge: 6 Gruppen × 4 VK-Preisgruppen)
- `mockRateHistory` (17 historische Kurseinträge inkl. 1 manuell, 4 Metalle, mehrere Tage)

### Kalkulationsliste (Produktpreise)
- `products/page.tsx`: Neuer **Preisgruppe-Filter** (Dropdown mit allen Kundengruppen), filtert Preise nach Gruppe

### Sidebar
- +Kurshistorie Nav-Item (History Icon) in Hauptnavigation
- +Artikelgruppen Nav-Item (Layers Icon) in Stammdaten
- +Gruppen-Zuschläge Nav-Item (Grid3X3 Icon) in Stammdaten

### Build Verification ✅
- `npx next build` → **26 Routen**, 0 TypeScript-Fehler
- Nächster Schritt: Phase 1 (Backend + Datenbankanbindung)
