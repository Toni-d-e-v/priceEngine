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
