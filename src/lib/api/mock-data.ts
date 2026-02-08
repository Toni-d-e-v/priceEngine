import type {
  Metal,
  MetalRate,
  SpotRule,
  CustomerGroup,
  Article,
  ArticlePrice,
  Formula,
  Holiday,
  User,
  Role,
} from '@/types';

// ============ METALS ============
export const mockMetals: Metal[] = [
  { id: 1, symbol: 'XAU', name: 'Gold', unit: 'gram', isActive: true },
  { id: 2, symbol: 'XAG', name: 'Silver', unit: 'gram', isActive: true },
  { id: 3, symbol: 'XPT', name: 'Platin', unit: 'gram', isActive: true },
  { id: 4, symbol: 'XPD', name: 'Palladium', unit: 'gram', isActive: true },
];

// ============ METAL RATES (aus Screenshot Seite 1) ============
export const mockMetalRates: MetalRate[] = [
  {
    id: 1, metalId: 1,
    rateDate: '2025-11-06', rateUsd: 97.20, rateEur: 111.9901,
    rateUsdPerGram: 97.20, rateEurPerGram: 111.9901,
    source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false,
  },
  {
    id: 2, metalId: 2,
    rateDate: '2025-11-06', rateUsd: 1.18, rateEur: 1.3601,
    rateUsdPerGram: 1.18, rateEurPerGram: 1.3601,
    source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false,
  },
  {
    id: 3, metalId: 3,
    rateDate: '2025-11-06', rateUsd: 37.97, rateEur: 43.7564,
    rateUsdPerGram: 37.97, rateEurPerGram: 43.7564,
    source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false,
  },
  {
    id: 4, metalId: 4,
    rateDate: '2025-11-06', rateUsd: 34.37, rateEur: 39.5985,
    rateUsdPerGram: 34.37, rateEurPerGram: 39.5985,
    source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false,
  },
];

// ============ CUSTOMER GROUPS ============
export const mockCustomerGroups: CustomerGroup[] = [
  { id: 1, name: 'Kunde', code: 'K', description: 'Endkunde / Retail', discountPercent: 0, isActive: true },
  { id: 2, name: 'Mitglieder', code: 'M', description: 'Registrierte Mitglieder', discountPercent: 2, isActive: true },
  { id: 3, name: 'Haendler', code: 'H', description: 'Händler', discountPercent: 5, isActive: true },
  { id: 4, name: 'Lizenzpartner', code: 'L', description: 'Partner', discountPercent: 8, isActive: true },
  { id: 5, name: 'Ankauf', code: 'A', description: 'Rückkauf-Preis', discountPercent: 0, isActive: true },
];

// ============ SPOT RULES – GOLD VERKAUF (aus Screenshot Seite 2) ============
export const mockSpotRules: SpotRule[] = [
  // Gold Verkauf – Standardregeln
  { id: 1, metalId: 1, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+3.2)', calculatedValue: 115.1901 },
  { id: 2, metalId: 1, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+0.145)', calculatedValue: 112.1351 },
  { id: 3, metalId: 1, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+1.42)', calculatedValue: 113.4101 },
  { id: 4, metalId: 1, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+1.42)', calculatedValue: 113.4101 },
  { id: 5, metalId: 1, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '($spot+1.42)', calculatedValue: 113.4101 },
  { id: 6, metalId: 1, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+1.82)', calculatedValue: 113.8101 },
  { id: 7, metalId: 1, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+3.2)', calculatedValue: 115.1901 },

  // Gold Verkauf – Sonderregeln
  { id: 101, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-01-02', description: 'Schließzeit XMas', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 102, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-04-18', description: 'Karfreitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 103, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-04-21', description: 'Ostermontag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 104, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-05-01', description: 'Tag der Arbeit', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 105, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-05-29', description: 'Christi Himmelfahrt', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 106, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-06-09', description: 'Pfingstmontag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 107, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-10-03', description: 'Tag der Deutschen Einheit', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+2', calculatedValue: 113.9901 },
  { id: 108, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-12-24', description: 'Heiligabend', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+3.2', calculatedValue: 115.1901 },
  { id: 109, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-12-25', description: '1. Weihnachtsfeiertag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+3.2', calculatedValue: 115.1901 },
  { id: 110, metalId: 1, direction: 'verkauf', ruleType: 'special', specialDate: '2025-12-26', description: '2. Weihnachtsfeiertag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot+3.2', calculatedValue: 115.1901 },

  // Silver Verkauf – Standardregeln
  { id: 201, metalId: 2, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+0.05)', calculatedValue: 1.4101 },
  { id: 202, metalId: 2, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot-0.0143)', calculatedValue: 1.3458 },
  { id: 203, metalId: 2, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot-0.0143)', calculatedValue: 1.3458 },
  { id: 204, metalId: 2, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot-0.0143)', calculatedValue: 1.3458 },
  { id: 205, metalId: 2, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '($spot-0.0143)', calculatedValue: 1.3458 },
  { id: 206, metalId: 2, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot-0.0143)', calculatedValue: 1.3458 },
  { id: 207, metalId: 2, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+0.05)', calculatedValue: 1.4101 },

  // Platin Verkauf – Standardregeln
  { id: 301, metalId: 3, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+1.5)', calculatedValue: 45.2564 },
  { id: 302, metalId: 3, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+0.8001)', calculatedValue: 44.5565 },
  { id: 303, metalId: 3, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+0.8001)', calculatedValue: 44.5565 },
  { id: 304, metalId: 3, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+0.8001)', calculatedValue: 44.5565 },
  { id: 305, metalId: 3, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '($spot+0.8001)', calculatedValue: 44.5565 },
  { id: 306, metalId: 3, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+0.8001)', calculatedValue: 44.5565 },
  { id: 307, metalId: 3, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+1.5)', calculatedValue: 45.2564 },

  // Palladium Verkauf – Standardregeln
  { id: 401, metalId: 4, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+15)', calculatedValue: 54.5985 },
  { id: 402, metalId: 4, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+15)', calculatedValue: 54.5985 },
  { id: 403, metalId: 4, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+15)', calculatedValue: 54.5985 },
  { id: 404, metalId: 4, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+15)', calculatedValue: 54.5985 },
  { id: 405, metalId: 4, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '($spot+15)', calculatedValue: 54.5985 },
  { id: 406, metalId: 4, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+15)', calculatedValue: 54.5985 },
  { id: 407, metalId: 4, direction: 'verkauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '($spot+15)', calculatedValue: 54.5985 },

  // Gold Ankauf – Standardregeln
  { id: 501, metalId: 1, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 111.9901 },
  { id: 502, metalId: 1, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 111.9901 },
  { id: 503, metalId: 1, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 111.9901 },
  { id: 504, metalId: 1, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 111.9901 },
  { id: 505, metalId: 1, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '$spot', calculatedValue: 111.9901 },
  { id: 506, metalId: 1, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 111.9901 },
  { id: 507, metalId: 1, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 111.9901 },

  // Silver Ankauf
  { id: 601, metalId: 2, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 1.3601 },
  { id: 602, metalId: 2, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 1.3601 },
  { id: 603, metalId: 2, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 1.3601 },
  { id: 604, metalId: 2, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 1.3601 },
  { id: 605, metalId: 2, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '$spot', calculatedValue: 1.3601 },
  { id: 606, metalId: 2, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 1.3601 },
  { id: 607, metalId: 2, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 1.3601 },

  // Platin Ankauf
  { id: 701, metalId: 3, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 43.7564 },
  { id: 702, metalId: 3, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 43.7564 },
  { id: 703, metalId: 3, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 43.7564 },
  { id: 704, metalId: 3, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 43.7564 },
  { id: 705, metalId: 3, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '$spot', calculatedValue: 43.7564 },
  { id: 706, metalId: 3, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 43.7564 },
  { id: 707, metalId: 3, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 43.7564 },

  // Palladium Ankauf
  { id: 801, metalId: 4, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 0, dayName: 'Sonntag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 39.5985 },
  { id: 802, metalId: 4, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 1, dayName: 'Montag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 39.5985 },
  { id: 803, metalId: 4, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 2, dayName: 'Dienstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 39.5985 },
  { id: 804, metalId: 4, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 3, dayName: 'Mittwoch', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 39.5985 },
  { id: 805, metalId: 4, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 4, dayName: 'Donnerstag', timeFrom: '00:00', timeTo: '23:59', isActive: true, formula: '$spot', calculatedValue: 39.5985 },
  { id: 806, metalId: 4, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 5, dayName: 'Freitag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 39.5985 },
  { id: 807, metalId: 4, direction: 'ankauf', ruleType: 'standard', dayOfWeek: 6, dayName: 'Samstag', timeFrom: '00:00', timeTo: '23:59', isActive: false, formula: '$spot', calculatedValue: 39.5985 },
];

// ============ FORMULAS ============
export const mockFormulas: Formula[] = [
  { id: 1, name: 'Standard Verkauf Kunde', expression: '($spot*$weight+53.95)*1.021', variables: ['$spot', '$weight'], isActive: true },
  { id: 2, name: 'Standard Verkauf Mitglieder', expression: '($spot*$weight+53.95)*1.017', variables: ['$spot', '$weight'], isActive: true },
  { id: 3, name: 'Standard Verkauf Haendler', expression: '($spot*$weight+53.95)*1.045', variables: ['$spot', '$weight'], isActive: true },
  { id: 4, name: 'Standard Verkauf Lizenzpartner', expression: '($spot*$weight+53.95)*1.0042', variables: ['$spot', '$weight'], isActive: true },
  { id: 5, name: 'Standard Ankauf', expression: '$spot*$weight', variables: ['$spot', '$weight'], isActive: true },
  { id: 6, name: 'Silber Verkauf Kunde', expression: '$spot*$weight*1.1986*1.021', variables: ['$spot', '$weight'], isActive: true },
  { id: 7, name: 'Silber Verkauf Mitglieder', expression: '$spot*$weight*1.1986*1.017', variables: ['$spot', '$weight'], isActive: true },
  { id: 8, name: 'Silber Verkauf Haendler', expression: '$spot*$weight*1.1986*1.065', variables: ['$spot', '$weight'], isActive: true },
  { id: 9, name: 'Silber Verkauf Lizenzpartner', expression: '$spot*$weight*1.1986*1.0042', variables: ['$spot', '$weight'], isActive: true },
];

// ============ ARTICLES (aus Screenshot Seite 3 & 4) ============
export const mockArticles: Article[] = [
  {
    id: 1, sku: 'Ag-MBo-J0019-S0001-G00500-DV',
    skuComponents: { material: 'Ag', product: 'MB', taxType: 'o', manufacturer: 'J0019', quantity: 'S0001', weight: 'G00500', supplier: 'DV' },
    name: '500 Gramm Silber Münzbarren (Cook Islands)', metalId: 2, weightGrams: 500,
    priceType: 'verkauf', isActive: false, isInShop: false, country: 'DE',
  },
  {
    id: 2, sku: 'Au-TBo-J0001-S0020-G00001-HM',
    skuComponents: { material: 'Au', product: 'TB', taxType: 'o', manufacturer: 'J0001', quantity: 'S0020', weight: 'G00001', supplier: 'HM' },
    name: '20 x 1 Gramm Gold Tafelbarren (Heimerle & Meule)', metalId: 1, weightGrams: 20,
    priceType: 'verkauf', formulaId: 3, isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 3, sku: 'Au-CBo-J0001-S0100-G00001-HM',
    skuComponents: { material: 'Au', product: 'CB', taxType: 'o', manufacturer: 'J0001', quantity: 'S0100', weight: 'G00001', supplier: 'HM' },
    name: '100 x 1 Gramm Gold Combibarren (Heimerle & Meule)', metalId: 1, weightGrams: 100,
    priceType: 'verkauf', formulaId: 1, isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 4, sku: 'Au-PBo-J0003-S0001-G00100-CH',
    skuComponents: { material: 'Au', product: 'PB', taxType: 'o', manufacturer: 'J0003', quantity: 'S0001', weight: 'G00100', supplier: 'CH' },
    name: '100 Gramm Gold Prägebarren (HERAEUS)', metalId: 1, weightGrams: 100,
    priceType: 'verkauf', formulaId: 1, isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 5, sku: 'Au-MUo-J0015-S0001-G70001-SG',
    skuComponents: { material: 'Au', product: 'MU', taxType: 'o', manufacturer: 'J0015', quantity: 'S0001', weight: 'G70001', supplier: 'SG' },
    name: '1 oz Gold Maple Leaf (Royal Canadian Mint)', metalId: 1, weightGrams: 31.1034768,
    priceType: 'verkauf', formulaId: 1, isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 6, sku: 'Ag-PBd-J0005-S0001-G01000-CH',
    skuComponents: { material: 'Ag', product: 'PB', taxType: 'd', manufacturer: 'J0005', quantity: 'S0001', weight: 'G01000', supplier: 'CH' },
    name: '1000 Gramm Silber Prägebarren (UMICORE)', metalId: 2, weightGrams: 1000,
    priceType: 'verkauf', formulaId: 6, isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 7, sku: 'Pt-PBo-J0003-S0001-G00050-CH',
    skuComponents: { material: 'Pt', product: 'PB', taxType: 'o', manufacturer: 'J0003', quantity: 'S0001', weight: 'G00050', supplier: 'CH' },
    name: '50 Gramm Platin Prägebarren (HERAEUS)', metalId: 3, weightGrams: 50,
    priceType: 'verkauf', isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 8, sku: 'Pd-PBo-J0003-S0001-G70001-CH',
    skuComponents: { material: 'Pd', product: 'PB', taxType: 'o', manufacturer: 'J0003', quantity: 'S0001', weight: 'G70001', supplier: 'CH' },
    name: '1 oz Palladium Prägebarren (HERAEUS)', metalId: 4, weightGrams: 31.1034768,
    priceType: 'verkauf', isActive: true, isInShop: true, country: 'DE',
  },
];

// ============ ARTICLE PRICES (aus Screenshot Seite 3) ============
export const mockArticlePrices: ArticlePrice[] = [
  // Artikel 1: Silber Münzbarren 500g
  { id: 1, articleId: 1, customerGroupId: 1, formula: '$spot*$weight*1.1986*1.021', spotPricePerGram: 672.90, weightGrams: 500, prestashopPrice: 823.47, nettoPrice: 823.4752, bruttoPrice: 823.4752, priceDate: '2025-11-06', isPublished: true },
  { id: 2, articleId: 1, customerGroupId: 2, formula: '$spot*$weight*1.1986*1.017', spotPricePerGram: 672.90, weightGrams: 500, prestashopPrice: 820.24, nettoPrice: 820.2491, bruttoPrice: 820.2491, priceDate: '2025-11-06', isPublished: true },
  { id: 3, articleId: 1, customerGroupId: 3, formula: '$spot*$weight*1.1986*1.065', spotPricePerGram: 672.90, weightGrams: 500, prestashopPrice: 858.96, nettoPrice: 858.9629, bruttoPrice: 858.9629, priceDate: '2025-11-06', isPublished: true },
  { id: 4, articleId: 1, customerGroupId: 4, formula: '$spot*$weight*1.1986*1.0042', spotPricePerGram: 672.90, weightGrams: 500, prestashopPrice: 809.92, nettoPrice: 809.9254, bruttoPrice: 809.9254, priceDate: '2025-11-06', isPublished: true },
  { id: 5, articleId: 1, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 680.05, weightGrams: 500, prestashopPrice: 680.05, nettoPrice: 680.05, bruttoPrice: 680.05, priceDate: '2025-11-06', isPublished: true },

  // Artikel 2: Gold Tafelbarren 20x1g
  { id: 6, articleId: 2, customerGroupId: 1, formula: '($spot*$weight+53.95)*1.021', spotPricePerGram: 2268.202, weightGrams: 20, prestashopPrice: 2373.41, nettoPrice: 2373.41, bruttoPrice: 2373.41, priceDate: '2025-11-06', isPublished: true },
  { id: 7, articleId: 2, customerGroupId: 2, formula: '($spot*$weight+53.95)*1.017', spotPricePerGram: 2268.202, weightGrams: 20, prestashopPrice: 2364.11, nettoPrice: 2364.11, bruttoPrice: 2364.11, priceDate: '2025-11-06', isPublished: true },
  { id: 8, articleId: 2, customerGroupId: 3, formula: '($spot*$weight+53.95)*1.045', spotPricePerGram: 2268.202, weightGrams: 20, prestashopPrice: 2429.25, nettoPrice: 2429.25, bruttoPrice: 2429.25, priceDate: '2025-11-06', isPublished: true },
  { id: 9, articleId: 2, customerGroupId: 4, formula: '($spot*$weight+53.95)*1.0042', spotPricePerGram: 2268.202, weightGrams: 20, prestashopPrice: 2331.92, nettoPrice: 2331.92, bruttoPrice: 2331.92, priceDate: '2025-11-06', isPublished: true },
  { id: 10, articleId: 2, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 2239.802, weightGrams: 20, prestashopPrice: 2239.80, nettoPrice: 2239.80, bruttoPrice: 2239.80, priceDate: '2025-11-06', isPublished: true },

  // Artikel 3: Gold Combibarren 100x1g
  { id: 11, articleId: 3, customerGroupId: 1, formula: '($spot*$weight+180)*1.021', spotPricePerGram: 11341.01, weightGrams: 100, prestashopPrice: 11751.43, nettoPrice: 11751.43, bruttoPrice: 11751.43, priceDate: '2025-11-06', isPublished: true },
  { id: 12, articleId: 3, customerGroupId: 2, formula: '($spot*$weight+180)*1.017', spotPricePerGram: 11341.01, weightGrams: 100, prestashopPrice: 11705.43, nettoPrice: 11705.43, bruttoPrice: 11705.43, priceDate: '2025-11-06', isPublished: true },
  { id: 13, articleId: 3, customerGroupId: 3, formula: '($spot*$weight+180)*1.045', spotPricePerGram: 11341.01, weightGrams: 100, prestashopPrice: 12029.46, nettoPrice: 12029.46, bruttoPrice: 12029.46, priceDate: '2025-11-06', isPublished: true },
  { id: 14, articleId: 3, customerGroupId: 4, formula: '($spot*$weight+180)*1.0042', spotPricePerGram: 11341.01, weightGrams: 100, prestashopPrice: 11569.38, nettoPrice: 11569.38, bruttoPrice: 11569.38, priceDate: '2025-11-06', isPublished: true },
  { id: 15, articleId: 3, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 11199.01, weightGrams: 100, prestashopPrice: 11199.01, nettoPrice: 11199.01, bruttoPrice: 11199.01, priceDate: '2025-11-06', isPublished: true },

  // Artikel 5: Gold Maple Leaf 1oz
  { id: 16, articleId: 5, customerGroupId: 1, formula: '($spot*$weight+42)*1.034', spotPricePerGram: 3527.26, weightGrams: 31.1034768, prestashopPrice: 3691.64, nettoPrice: 3691.64, bruttoPrice: 3691.64, priceDate: '2025-11-06', isPublished: true },
  { id: 17, articleId: 5, customerGroupId: 2, formula: '($spot*$weight+42)*1.026', spotPricePerGram: 3527.26, weightGrams: 31.1034768, prestashopPrice: 3662.08, nettoPrice: 3662.08, bruttoPrice: 3662.08, priceDate: '2025-11-06', isPublished: true },
  { id: 18, articleId: 5, customerGroupId: 3, formula: '($spot*$weight+42)*1.065', spotPricePerGram: 3527.26, weightGrams: 31.1034768, prestashopPrice: 3800.77, nettoPrice: 3800.77, bruttoPrice: 3800.77, priceDate: '2025-11-06', isPublished: true },
  { id: 19, articleId: 5, customerGroupId: 4, formula: '($spot*$weight+42)*1.0049', spotPricePerGram: 3527.26, weightGrams: 31.1034768, prestashopPrice: 3586.75, nettoPrice: 3586.75, bruttoPrice: 3586.75, priceDate: '2025-11-06', isPublished: true },
  { id: 20, articleId: 5, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 3482.82, weightGrams: 31.1034768, prestashopPrice: 3482.82, nettoPrice: 3482.82, bruttoPrice: 3482.82, priceDate: '2025-11-06', isPublished: true },
];

// ============ HOLIDAYS ============
export const mockHolidays: Holiday[] = [
  { id: 1, name: 'Neujahr', holidayDate: '2025-01-01', description: 'Neujahrstag' },
  { id: 2, name: 'Schließzeit XMas', holidayDate: '2025-01-02', description: 'Nachfeiertag Weihnachten', formula: '$spot+2' },
  { id: 3, name: 'Karfreitag', holidayDate: '2025-04-18', formula: '$spot+2' },
  { id: 4, name: 'Ostermontag', holidayDate: '2025-04-21', formula: '$spot+2' },
  { id: 5, name: 'Tag der Arbeit', holidayDate: '2025-05-01', formula: '$spot+2' },
  { id: 6, name: 'Christi Himmelfahrt', holidayDate: '2025-05-29', formula: '$spot+2' },
  { id: 7, name: 'Pfingstmontag', holidayDate: '2025-06-09', formula: '$spot+2' },
  { id: 8, name: 'Tag der Deutschen Einheit', holidayDate: '2025-10-03', formula: '$spot+2' },
  { id: 9, name: 'Heiligabend', holidayDate: '2025-12-24', formula: '$spot+3.2' },
  { id: 10, name: '1. Weihnachtsfeiertag', holidayDate: '2025-12-25', formula: '$spot+3.2' },
  { id: 11, name: '2. Weihnachtsfeiertag', holidayDate: '2025-12-26', formula: '$spot+3.2' },
  { id: 12, name: 'Silvester', holidayDate: '2025-12-31', formula: '$spot+3.2' },
];

// ============ ROLES ============
export const mockRoles: Role[] = [
  { id: 1, name: 'Admin', description: 'Voller Zugriff auf alle Bereiche' },
  { id: 2, name: 'PriceEditor', description: 'Kann Preise und Regeln bearbeiten' },
  { id: 3, name: 'Viewer', description: 'Nur Leserechte' },
];

// ============ USERS ============
export const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@priceengine.de', firstName: 'Admin', lastName: 'User', isActive: true, roles: [mockRoles[0]] },
  { id: 2, username: 'editor', email: 'editor@priceengine.de', firstName: 'Preis', lastName: 'Editor', isActive: true, roles: [mockRoles[1]] },
  { id: 3, username: 'viewer', email: 'viewer@priceengine.de', firstName: 'Max', lastName: 'Mustermann', isActive: true, roles: [mockRoles[2]] },
];

// ============ MOCK DATA ROUTER ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMockData(endpoint: string): any {
  const routes: Record<string, unknown> = {
    '/metals': mockMetals,
    '/rates': mockMetalRates,
    '/rates/latest': mockMetalRates,
    '/spot-rules': mockSpotRules,
    '/customer-groups': mockCustomerGroups,
    '/articles': mockArticles,
    '/article-prices': mockArticlePrices,
    '/formulas': mockFormulas,
    '/holidays': mockHolidays,
    '/users': mockUsers,
    '/roles': mockRoles,
  };

  // Dynamische Routen
  if (endpoint.startsWith('/spot-rules/')) {
    const parts = endpoint.split('/');
    if (parts.length >= 4) {
      const metalId = parseInt(parts[2]);
      const direction = parts[3];
      return mockSpotRules.filter(r => r.metalId === metalId && r.direction === direction);
    }
  }

  if (endpoint.startsWith('/articles/')) {
    const id = parseInt(endpoint.split('/')[2]);
    return mockArticles.find(a => a.id === id);
  }

  if (endpoint.startsWith('/article-prices/article/')) {
    const articleId = parseInt(endpoint.split('/')[3]);
    return mockArticlePrices.filter(p => p.articleId === articleId);
  }

  return routes[endpoint] ?? null;
}
