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
