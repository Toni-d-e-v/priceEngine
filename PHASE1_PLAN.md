# Phase 1 – Backend-Foundation + Datenbankanbindung

> **Voraussetzung:** Phase 0 (Frontend mit Mock-Daten) ist abgeschlossen. Alle 22 Routen kompilieren, UI ist vollständig mit Mock-Daten funktionsfähig.

## Ziel

Backend aufsetzen, MySQL-Datenbank mit Prisma anbinden, alle CRUD-Endpunkte implementieren, Frontend von Mock-Daten auf echte API umstellen. Am Ende läuft alles via `docker-compose up`.

---

## Reihenfolge der Umsetzung

### Step 1: Docker-Compose Setup
- `docker-compose.yml` mit 3 Services: `mysql`, `backend`, `frontend`
- MySQL 8 mit Volume für Persistenz
- `.env.example` mit allen Umgebungsvariablen
- `mysql/init/` Verzeichnis für initiale SQL-Skripte (optional, Prisma übernimmt)
- Backend auf Port 4000, Frontend auf Port 3000, MySQL auf 3306

### Step 2: Backend-Projekt initialisieren
- `backend/` Verzeichnis mit eigenem `package.json`
- Express.js + TypeScript Setup
- Ordnerstruktur:
  ```
  backend/src/
  ├── index.ts           # Server-Start
  ├── config/
  │   └── database.ts    # DB-Konfiguration
  ├── middleware/
  │   ├── auth.ts        # JWT-Verifikation
  │   ├── rbac.ts        # RBAC-Middleware
  │   ├── errorHandler.ts
  │   └── validation.ts
  ├── routes/
  │   ├── auth.ts
  │   ├── metals.ts
  │   ├── rates.ts
  │   ├── spotRules.ts
  │   ├── articles.ts
  │   ├── articlePrices.ts
  │   ├── customerGroups.ts
  │   ├── formulas.ts
  │   ├── holidays.ts
  │   ├── users.ts
  │   ├── roles.ts
  │   └── sku.ts
  ├── controllers/       # Request-Handler
  ├── services/          # Geschäftslogik
  ├── utils/
  │   └── formula.ts     # mathjs Formel-Engine (Backend)
  └── types/
      └── index.ts       # Shared Types
  ```
- Dependencies: express, cors, helmet, jsonwebtoken, bcryptjs, mathjs, @prisma/client
- Dev-Dependencies: typescript, ts-node, nodemon, @types/*

### Step 3: Prisma-Schema
- `backend/prisma/schema.prisma` mit allen 17 Tabellen:
  - **Auth:** users, roles, user_roles
  - **Metalle:** metals, metal_rates
  - **Preise:** customer_groups, formulas, articles, article_customer_group_prices, price_archive
  - **Regeln:** spot_rules, holidays
  - **SKU:** material_codes, product_codes, tax_types, manufacturers, weight_codes, quantity_codes, suppliers
- Alle Relationen, Indizes, Enums definieren
- `npx prisma migrate dev` für initiale Migration

### Step 4: Seed-Script
- `backend/prisma/seed.ts` mit allen Stammdaten:
  - 3 Rollen (Admin, PriceEditor, Viewer)
  - 1 Admin-User (admin/admin123)
  - 4 Metalle (XAU, XAG, XPT, XPD)
  - 5 Kundengruppen
  - Alle SKU-Stammdaten (Material-Codes, Produkt-Codes, Besteuerungsarten, Hersteller, Gewichte, Stückzahlen, Lieferanten)
  - Mock-Spotregeln (aus Phase 0 mock-data.ts übernehmen)
  - Mock-Artikel + Preise
  - Feiertage 2025
  - Beispiel-Formeln
- `npx prisma db seed` muss idempotent sein (upsert verwenden)

### Step 5: JWT-Authentifizierung
- POST `/api/auth/login` → JWT-Token
- POST `/api/auth/logout` → Token invalidieren (optional: Blacklist)
- GET `/api/auth/me` → Aktueller User mit Rollen
- PUT `/api/auth/change-password`
- JWT mit 24h Ablauf, Secret aus Umgebungsvariable
- Passwort-Hashing mit bcryptjs (Saltrounds: 12)

### Step 6: RBAC-Middleware
- `requireAuth` Middleware: JWT aus Authorization Header verifizieren
- `requireRole('Admin')` / `requireRole('PriceEditor')` Middleware
- Berechtigungen wie in Phase 0 definiert (ROLE_PERMISSIONS Map)

### Step 7: CRUD-Endpunkte
Alle Endpunkte mit Validierung, Fehlerbehandlung, Pagination:

| Bereich | Endpunkte | Mindest-Rolle |
|---------|-----------|--------------|
| Metalle | GET /api/metals | Viewer |
| Kurse | GET /api/rates, GET /api/rates/latest | Viewer |
| Spot-Regeln | GET, POST, PUT, DELETE /api/spot-rules | Viewer / PriceEditor / Admin |
| Artikel | GET, POST, PUT, DELETE /api/articles | Viewer / PriceEditor / Admin |
| Artikelpreise | GET, PUT /api/article-prices | Viewer / PriceEditor |
| Kundengruppen | GET, POST, PUT, DELETE /api/customer-groups | Viewer / Admin |
| Formeln | GET, POST, PUT, DELETE /api/formulas | Viewer / PriceEditor |
| Feiertage | GET, POST, PUT, DELETE /api/holidays | Viewer / PriceEditor |
| Benutzer | GET, POST, PUT, DELETE /api/users | Admin |
| Rollen | GET, POST, PUT, DELETE /api/roles | Admin |
| User-Rollen | GET, PUT /api/user-roles | Admin |
| SKU | GET /api/sku/*, POST /api/sku/validate, POST /api/sku/parse | Viewer |

### Step 8: Frontend umstellen
- `.env.local` ändern:
  ```
  NEXT_PUBLIC_USE_MOCK=false
  NEXT_PUBLIC_API_URL=http://localhost:4000/api
  ```
- `src/lib/api/client.ts` verifizieren: Der Mock/Real-Switch muss ohne Codeänderungen funktionieren
- Login-Seite: Echten JWT-Token speichern
- AuthContext: `GET /api/auth/me` bei Page-Load aufrufen

### Step 9: Fehlerbehandlung & Validierung
- Globaler Error-Handler im Backend
- Input-Validierung (express-validator oder zod)
- Konsistente API-Responses: `{ success: boolean, data: T, message?: string }`
- CORS konfigurieren (nur Frontend-Origin erlauben)
- Helmet für Security-Header
- Rate-Limiting auf Auth-Endpunkte

### Step 10: Dockerfiles & Integration
- `backend/Dockerfile` (Node.js + Prisma-Client generieren)
- `frontend/Dockerfile` (Next.js Build)
- `docker-compose.yml` mit Health-Checks
- Backend wartet auf MySQL bevor Start (wait-for-it oder healthcheck)
- Volumes: MySQL-Daten persistieren

---

## Technische Entscheidungen

| Entscheidung | Wahl | Begründung |
|-------------|------|-----------|
| ORM | Prisma | Im Projektplan vorgegeben, Type-Safe, Migrationen |
| Auth | JWT | Stateless, einfach, im Plan vorgegeben |
| Validierung | zod | TypeScript-native, kann Schema + Runtime validieren |
| Password Hashing | bcryptjs | Standard, im Plan vorgegeben |
| API Framework | Express.js | Im Projektplan vorgegeben |

---

## Abhängigkeiten & Reihenfolge

```
Step 1 (Docker) ──┐
Step 2 (Backend) ─┤
                   ├── Step 3 (Prisma) ── Step 4 (Seed) ──┐
                   │                                        │
                   └── Step 5 (Auth) ── Step 6 (RBAC) ─────┤
                                                            │
                                          Step 7 (CRUD) ────┤
                                                            │
                                          Step 8 (Frontend) ┤
                                                            │
                                          Step 9 (Fehler) ──┤
                                                            │
                                          Step 10 (Docker) ─┘
```

Steps 1-2 können parallel, Steps 3-4 sequentiell, Steps 5-7 sequentiell, dann 8-10.

---

## Erfolgskriterien

- [ ] `docker-compose up` startet MySQL + Backend + Frontend
- [ ] Login mit admin/admin123 gibt JWT zurück
- [ ] Alle Frontend-Seiten funktionieren identisch zu Phase 0 (aber mit echten Daten)
- [ ] CRUD-Operationen (Erstellen, Bearbeiten, Löschen) funktionieren persistent
- [ ] RBAC wird durchgesetzt (Viewer kann nicht bearbeiten, nur Admin sieht Stammdaten)
- [ ] Kein `NEXT_PUBLIC_USE_MOCK=true` mehr nötig
- [ ] Alle TypeScript-Typen zwischen Frontend und Backend konsistent
