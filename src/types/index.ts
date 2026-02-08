// ============ METAL RATES ============
export interface Metal {
  id: number;
  symbol: 'XAU' | 'XAG' | 'XPT' | 'XPD';
  name: string;
  unit: string;
  isActive: boolean;
}

export interface MetalRate {
  id: number;
  metalId: number;
  metal?: Metal;
  rateDate: string;
  rateEur: number;
  rateUsd: number;
  rateEurPerGram: number;
  rateUsdPerGram: number;
  source: string;
  fetchedAt: string;
  isManual: boolean;
}

// ============ SPOT RULES ============
export type PriceDirection = 'verkauf' | 'ankauf';

export interface SpotRule {
  id: number;
  metalId: number;
  metal?: Metal;
  direction: PriceDirection;
  ruleType: 'standard' | 'special';
  dayOfWeek?: number;
  dayName?: string;
  specialDate?: string;
  description?: string;
  timeFrom: string;
  timeTo: string;
  isActive: boolean;
  formula: string;
  calculatedValue: number;
}

// ============ CUSTOMER GROUPS ============
export interface CustomerGroup {
  id: number;
  name: string;
  code: string;
  description?: string;
  discountPercent: number;
  isActive: boolean;
}

// ============ SKU COMPONENTS ============
export interface SKUComponents {
  material: string;
  product: string;
  taxType: string;
  manufacturer: string;
  quantity: string;
  weight: string;
  supplier: string;
}

// ============ ARTICLES ============
export interface Article {
  id: number;
  sku: string;
  skuComponents: SKUComponents;
  name: string;
  metalId: number;
  metal?: Metal;
  weightGrams: number;
  priceType: PriceDirection;
  formulaId?: number;
  formula?: Formula;
  isActive: boolean;
  isInShop: boolean;
  country: string;
}

// ============ ARTICLE PRICES ============
export interface ArticlePrice {
  id: number;
  articleId: number;
  article?: Article;
  customerGroupId: number;
  customerGroup?: CustomerGroup;
  formula: string;
  spotPricePerGram: number;
  weightGrams: number;
  prestashopPrice: number;
  nettoPrice: number;
  bruttoPrice: number;
  priceDate: string;
  isPublished: boolean;
}

// ============ FORMULAS ============
export interface Formula {
  id: number;
  name: string;
  description?: string;
  expression: string;
  variables: string[];
  isActive: boolean;
}

// ============ HOLIDAYS ============
export interface Holiday {
  id: number;
  name: string;
  holidayDate: string;
  description?: string;
  formula?: string;
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

// ============ API TYPES ============
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
