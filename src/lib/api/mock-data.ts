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
  TaxMapping,
  ArticleGroup,
  ArticleGroupSurcharge,
} from '@/types';

// ============ METALS ============
export const mockMetals: Metal[] = [
  { id: 1, symbol: 'XAU', name: 'Gold', unit: 'gram', globalSurcharge: 1.50, isActive: true },
  { id: 2, symbol: 'XAG', name: 'Silber', unit: 'gram', globalSurcharge: 0.02, isActive: true },
  { id: 3, symbol: 'XPT', name: 'Platin', unit: 'gram', globalSurcharge: 0.80, isActive: true },
  { id: 4, symbol: 'XCU', name: 'Kupfer', unit: 'gram', globalSurcharge: 0.01, isActive: true },
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
  { id: 1, name: 'VK-REGULÄR', code: 'R', description: 'Endkunde / Retail', surchargePercent: 0, direction: 'verkauf', isActive: true },
  { id: 2, name: 'VK-MITGLIEDER', code: 'M', description: 'Registrierte Mitglieder', surchargePercent: 2.6, direction: 'verkauf', isActive: true },
  { id: 3, name: 'VK-HÄNDLER', code: 'H', description: 'Händler', surchargePercent: 2, direction: 'verkauf', isActive: true },
  { id: 4, name: 'VK+Provision', code: 'P', description: 'Provision', surchargePercent: 4.2, direction: 'verkauf', isActive: true },
  { id: 5, name: 'ANKAUF', code: 'A', description: 'Rückkauf-Preis', surchargePercent: 0, direction: 'ankauf', isActive: true },
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

  // Silber Verkauf – Standardregeln
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

  // Kupfer Verkauf – Standardregeln
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

  // Silber Ankauf
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

  // Kupfer Ankauf
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
  { id: 1, name: 'Standard Verkauf Regulär', expression: '($spot*$weight+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
  { id: 2, name: 'Standard Verkauf Mitglieder', expression: '($spot*$weight+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
  { id: 3, name: 'Standard Verkauf Händler', expression: '($spot*$weight+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
  { id: 4, name: 'Standard Verkauf Provision', expression: '($spot*$weight+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
  { id: 5, name: 'Standard Ankauf', expression: '$spot*$weight', variables: ['$spot', '$weight'], isActive: true },
  { id: 6, name: 'Silber Verkauf Regulär', expression: '($spot*$weight*1.1986+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
  { id: 7, name: 'Silber Verkauf Mitglieder', expression: '($spot*$weight*1.1986+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
  { id: 8, name: 'Silber Verkauf Händler', expression: '($spot*$weight*1.1986+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
  { id: 9, name: 'Silber Verkauf Provision', expression: '($spot*$weight*1.1986+$facon)*$aufschlag', variables: ['$spot', '$weight', '$facon', '$aufschlag'], isActive: true },
];

// ============ ARTICLES (aus Screenshot Seite 3 & 4) ============
export const mockArticles: Article[] = [
  {
    id: 1, sku: 'Ag-MBo-J0019-S0001-G00500-DV',
    skuComponents: { material: 'Ag', product: 'MB', taxType: 'o', manufacturer: 'J0019', quantity: 'S0001', weight: 'G00500', supplier: 'DV' },
    name: '500 Gramm Silber Münzbarren (Cook Islands)', metalId: 2, weightGrams: 500,
    priceType: 'verkauf', faconCost: 0, faconType: 'absolute', taxType: 'steuerfrei',
    isActive: false, isInShop: false, country: 'DE',
  },
  {
    id: 2, sku: 'Au-TBo-J0001-S0020-G00001-HM',
    skuComponents: { material: 'Au', product: 'TB', taxType: 'o', manufacturer: 'J0001', quantity: 'S0020', weight: 'G00001', supplier: 'HM' },
    name: '20 x 1 Gramm Gold Tafelbarren (Heimerle & Meule)', metalId: 1, weightGrams: 20,
    priceType: 'verkauf', formulaId: 3, faconCost: 53.95, faconType: 'absolute', taxType: 'steuerfrei',
    isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 3, sku: 'Au-CBo-J0001-S0100-G00001-HM',
    skuComponents: { material: 'Au', product: 'CB', taxType: 'o', manufacturer: 'J0001', quantity: 'S0100', weight: 'G00001', supplier: 'HM' },
    name: '100 x 1 Gramm Gold Combibarren (Heimerle & Meule)', metalId: 1, weightGrams: 100,
    priceType: 'verkauf', formulaId: 1, faconCost: 180, faconType: 'absolute', taxType: 'steuerfrei',
    isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 4, sku: 'Au-PBo-J0003-S0001-G00100-CH',
    skuComponents: { material: 'Au', product: 'PB', taxType: 'o', manufacturer: 'J0003', quantity: 'S0001', weight: 'G00100', supplier: 'CH' },
    name: '100 Gramm Gold Prägebarren (HERAEUS)', metalId: 1, weightGrams: 100,
    priceType: 'verkauf', formulaId: 1, faconCost: 120, faconType: 'absolute', taxType: 'steuerfrei',
    isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 5, sku: 'Au-MUo-J0015-S0001-G70001-SG',
    skuComponents: { material: 'Au', product: 'MU', taxType: 'o', manufacturer: 'J0015', quantity: 'S0001', weight: 'G70001', supplier: 'SG' },
    name: '1 oz Gold Maple Leaf (Royal Canadian Mint)', metalId: 1, weightGrams: 31.1034768,
    priceType: 'verkauf', formulaId: 1, faconCost: 42, faconType: 'absolute', taxType: 'steuerfrei',
    isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 6, sku: 'Ag-PBo-J0005-S0001-G01000-CH',
    skuComponents: { material: 'Ag', product: 'PB', taxType: 'o', manufacturer: 'J0005', quantity: 'S0001', weight: 'G01000', supplier: 'CH' },
    name: '1000 Gramm Silber Prägebarren (UMICORE)', metalId: 2, weightGrams: 1000,
    priceType: 'verkauf', formulaId: 6, faconCost: 0, faconType: 'absolute', taxType: 'regelbesteuert',
    isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 7, sku: 'Pt-PBo-J0003-S0001-G00050-CH',
    skuComponents: { material: 'Pt', product: 'PB', taxType: 'o', manufacturer: 'J0003', quantity: 'S0001', weight: 'G00050', supplier: 'CH' },
    name: '50 Gramm Platin Prägebarren (HERAEUS)', metalId: 3, weightGrams: 50,
    priceType: 'verkauf', faconCost: 35, faconType: 'absolute', taxType: 'steuerfrei',
    isActive: true, isInShop: true, country: 'DE',
  },
  {
    id: 8, sku: 'Cu-PBo-J0003-S0001-G70001-CH',
    skuComponents: { material: 'Cu', product: 'PB', taxType: 'o', manufacturer: 'J0003', quantity: 'S0001', weight: 'G70001', supplier: 'CH' },
    name: '1 oz Kupfer Prägebarren (HERAEUS)', metalId: 4, weightGrams: 31.1034768,
    priceType: 'verkauf', faconCost: 5, faconType: 'absolute', taxType: 'regelbesteuert',
    isActive: true, isInShop: true, country: 'DE',
  },
];

// ============ ARTICLE PRICES ============
// Berechnung: spotPricePerGram = $spot(Spot2) * $weight
// nettoPrice = evaluateFormula(formula, { $spot, $weight, $facon, $aufschlag })
// taxAmount = taxType === 'regelbesteuert' ? nettoPrice * 0.19 : 0
// bruttoPrice = nettoPrice + taxAmount
//
// Spot(2)-Werte (aktive Regeln):
//   Gold VK: 113.4101 | Gold Ankauf: 111.9901
//   Silber VK: 1.3458  | Silber Ankauf: 1.3601
//   Platin VK: 44.5565 | Platin Ankauf: 43.7564
//   Kupfer VK: 54.5985 | Kupfer Ankauf: 39.5985
//
// Aufschlag-Faktoren ($aufschlag = 1 + surchargePercent/100):
//   R(0%): 1.0 | M(2.6%): 1.026 | H(2%): 1.02 | P(4.2%): 1.042 | A(0%): 1.0

export const mockArticlePrices: ArticlePrice[] = [
  // Artikel 1: Silber 500g, facon=0, steuerfrei
  // VK: ($spot*$weight*1.1986+$facon)*$aufschlag = (1.3458*500*1.1986+0)*$aufschlag = 806.6579*$aufschlag
  { id: 1, articleId: 1, customerGroupId: 1, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 672.9000, weightGrams: 500, taxAmount: 0, nettoPrice: 806.6579, bruttoPrice: 806.6579, priceDate: '2025-11-06', isPublished: true },
  { id: 2, articleId: 1, customerGroupId: 2, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 672.9000, weightGrams: 500, taxAmount: 0, nettoPrice: 827.6310, bruttoPrice: 827.6310, priceDate: '2025-11-06', isPublished: true },
  { id: 3, articleId: 1, customerGroupId: 3, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 672.9000, weightGrams: 500, taxAmount: 0, nettoPrice: 822.7911, bruttoPrice: 822.7911, priceDate: '2025-11-06', isPublished: true },
  { id: 4, articleId: 1, customerGroupId: 4, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 672.9000, weightGrams: 500, taxAmount: 0, nettoPrice: 840.5355, bruttoPrice: 840.5355, priceDate: '2025-11-06', isPublished: true },
  { id: 5, articleId: 1, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 680.0500, weightGrams: 500, taxAmount: 0, nettoPrice: 680.0500, bruttoPrice: 680.0500, priceDate: '2025-11-06', isPublished: true },

  // Artikel 2: Gold 20g, facon=53.95, steuerfrei
  // VK: ($spot*$weight+$facon)*$aufschlag = (113.4101*20+53.95)*$aufschlag = 2322.1520*$aufschlag
  { id: 6, articleId: 2, customerGroupId: 1, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 2268.2020, weightGrams: 20, taxAmount: 0, nettoPrice: 2322.1520, bruttoPrice: 2322.1520, priceDate: '2025-11-06', isPublished: true },
  { id: 7, articleId: 2, customerGroupId: 2, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 2268.2020, weightGrams: 20, taxAmount: 0, nettoPrice: 2382.7280, bruttoPrice: 2382.7280, priceDate: '2025-11-06', isPublished: true },
  { id: 8, articleId: 2, customerGroupId: 3, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 2268.2020, weightGrams: 20, taxAmount: 0, nettoPrice: 2368.5950, bruttoPrice: 2368.5950, priceDate: '2025-11-06', isPublished: true },
  { id: 9, articleId: 2, customerGroupId: 4, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 2268.2020, weightGrams: 20, taxAmount: 0, nettoPrice: 2419.6824, bruttoPrice: 2419.6824, priceDate: '2025-11-06', isPublished: true },
  { id: 10, articleId: 2, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 2239.8020, weightGrams: 20, taxAmount: 0, nettoPrice: 2239.8020, bruttoPrice: 2239.8020, priceDate: '2025-11-06', isPublished: true },

  // Artikel 3: Gold 100g, facon=180, steuerfrei
  // VK: ($spot*$weight+$facon)*$aufschlag = (113.4101*100+180)*$aufschlag = 11521.0100*$aufschlag
  { id: 11, articleId: 3, customerGroupId: 1, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 11341.0100, weightGrams: 100, taxAmount: 0, nettoPrice: 11521.0100, bruttoPrice: 11521.0100, priceDate: '2025-11-06', isPublished: true },
  { id: 12, articleId: 3, customerGroupId: 2, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 11341.0100, weightGrams: 100, taxAmount: 0, nettoPrice: 11824.5583, bruttoPrice: 11824.5583, priceDate: '2025-11-06', isPublished: true },
  { id: 13, articleId: 3, customerGroupId: 3, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 11341.0100, weightGrams: 100, taxAmount: 0, nettoPrice: 11751.4302, bruttoPrice: 11751.4302, priceDate: '2025-11-06', isPublished: true },
  { id: 14, articleId: 3, customerGroupId: 4, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 11341.0100, weightGrams: 100, taxAmount: 0, nettoPrice: 12006.8924, bruttoPrice: 12006.8924, priceDate: '2025-11-06', isPublished: true },
  { id: 15, articleId: 3, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 11199.0100, weightGrams: 100, taxAmount: 0, nettoPrice: 11199.0100, bruttoPrice: 11199.0100, priceDate: '2025-11-06', isPublished: true },

  // Artikel 5: Gold 1oz (31.1034768g), facon=42, steuerfrei
  // VK: ($spot*$weight+$facon)*$aufschlag = (113.4101*31.1034768+42)*$aufschlag = 3569.4476*$aufschlag
  { id: 16, articleId: 5, customerGroupId: 1, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 3527.4476, weightGrams: 31.1034768, taxAmount: 0, nettoPrice: 3569.4476, bruttoPrice: 3569.4476, priceDate: '2025-11-06', isPublished: true },
  { id: 17, articleId: 5, customerGroupId: 2, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 3527.4476, weightGrams: 31.1034768, taxAmount: 0, nettoPrice: 3662.2536, bruttoPrice: 3662.2536, priceDate: '2025-11-06', isPublished: true },
  { id: 18, articleId: 5, customerGroupId: 3, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 3527.4476, weightGrams: 31.1034768, taxAmount: 0, nettoPrice: 3640.8366, bruttoPrice: 3640.8366, priceDate: '2025-11-06', isPublished: true },
  { id: 19, articleId: 5, customerGroupId: 4, formula: '($spot*$weight+$facon)*$aufschlag', spotPricePerGram: 3527.4476, weightGrams: 31.1034768, taxAmount: 0, nettoPrice: 3719.3244, bruttoPrice: 3719.3244, priceDate: '2025-11-06', isPublished: true },
  { id: 20, articleId: 5, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 3483.2808, weightGrams: 31.1034768, taxAmount: 0, nettoPrice: 3483.2808, bruttoPrice: 3483.2808, priceDate: '2025-11-06', isPublished: true },

  // Artikel 6: Silber 1000g, facon=0, REGELBESTEUERT (19%)
  // VK: ($spot*$weight*1.1986+$facon)*$aufschlag = (1.3458*1000*1.1986+0)*$aufschlag = 1613.3159*$aufschlag
  { id: 21, articleId: 6, customerGroupId: 1, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 1345.8000, weightGrams: 1000, taxAmount: 306.5300, nettoPrice: 1613.3159, bruttoPrice: 1919.8459, priceDate: '2025-11-06', isPublished: true },
  { id: 22, articleId: 6, customerGroupId: 2, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 1345.8000, weightGrams: 1000, taxAmount: 314.5006, nettoPrice: 1655.2661, bruttoPrice: 1969.7667, priceDate: '2025-11-06', isPublished: true },
  { id: 23, articleId: 6, customerGroupId: 3, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 1345.8000, weightGrams: 1000, taxAmount: 312.6606, nettoPrice: 1645.5822, bruttoPrice: 1958.2428, priceDate: '2025-11-06', isPublished: true },
  { id: 24, articleId: 6, customerGroupId: 4, formula: '($spot*$weight*1.1986+$facon)*$aufschlag', spotPricePerGram: 1345.8000, weightGrams: 1000, taxAmount: 319.4043, nettoPrice: 1681.0752, bruttoPrice: 2000.4795, priceDate: '2025-11-06', isPublished: true },
  { id: 25, articleId: 6, customerGroupId: 5, formula: '$spot*$weight', spotPricePerGram: 1360.1000, weightGrams: 1000, taxAmount: 258.4190, nettoPrice: 1360.1000, bruttoPrice: 1618.5190, priceDate: '2025-11-06', isPublished: true },
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

// ============ TAX MAPPINGS ============
export const mockTaxMappings: TaxMapping[] = [
  { id: 1, code: 'o', name: 'Steuerfrei', rate: 0 },
  { id: 2, code: 'r', name: 'Regelbesteuert (19%)', rate: 19 },
];

// ============ ARTICLE GROUPS ============
export const mockArticleGroups: ArticleGroup[] = [
  { id: 1, code: 'GB', name: 'Goldbarren', description: 'Barren aus Gold', isActive: true },
  { id: 2, code: 'SB', name: 'Silberbarren', description: 'Barren aus Silber', isActive: true },
  { id: 3, code: 'PB', name: 'Platinbarren', description: 'Barren aus Platin', isActive: true },
  { id: 4, code: 'KB', name: 'Kupferbarren', description: 'Barren aus Kupfer', isActive: true },
  { id: 5, code: 'GM', name: 'Goldmünzen', description: 'Münzen aus Gold', isActive: true },
  { id: 6, code: 'SM', name: 'Silbermünzen', description: 'Münzen aus Silber', isActive: true },
];

// ============ ARTICLE GROUP SURCHARGES ============
export const mockArticleGroupSurcharges: ArticleGroupSurcharge[] = [
  // Goldbarren × Preisgruppen
  { id: 1, articleGroupId: 1, customerGroupId: 1, surchargePercent: 0 },
  { id: 2, articleGroupId: 1, customerGroupId: 2, surchargePercent: 0.5 },
  { id: 3, articleGroupId: 1, customerGroupId: 3, surchargePercent: 0.3 },
  { id: 4, articleGroupId: 1, customerGroupId: 4, surchargePercent: 1.0 },
  // Silberbarren × Preisgruppen
  { id: 5, articleGroupId: 2, customerGroupId: 1, surchargePercent: 0 },
  { id: 6, articleGroupId: 2, customerGroupId: 2, surchargePercent: 0.8 },
  { id: 7, articleGroupId: 2, customerGroupId: 3, surchargePercent: 0.5 },
  { id: 8, articleGroupId: 2, customerGroupId: 4, surchargePercent: 1.2 },
  // Platinbarren × Preisgruppen
  { id: 9, articleGroupId: 3, customerGroupId: 1, surchargePercent: 0 },
  { id: 10, articleGroupId: 3, customerGroupId: 2, surchargePercent: 0.6 },
  { id: 11, articleGroupId: 3, customerGroupId: 3, surchargePercent: 0.4 },
  { id: 12, articleGroupId: 3, customerGroupId: 4, surchargePercent: 1.1 },
  // Kupferbarren × Preisgruppen
  { id: 13, articleGroupId: 4, customerGroupId: 1, surchargePercent: 0 },
  { id: 14, articleGroupId: 4, customerGroupId: 2, surchargePercent: 1.0 },
  { id: 15, articleGroupId: 4, customerGroupId: 3, surchargePercent: 0.7 },
  { id: 16, articleGroupId: 4, customerGroupId: 4, surchargePercent: 1.5 },
  // Goldmünzen × Preisgruppen
  { id: 17, articleGroupId: 5, customerGroupId: 1, surchargePercent: 0 },
  { id: 18, articleGroupId: 5, customerGroupId: 2, surchargePercent: 0.4 },
  { id: 19, articleGroupId: 5, customerGroupId: 3, surchargePercent: 0.2 },
  { id: 20, articleGroupId: 5, customerGroupId: 4, surchargePercent: 0.8 },
  // Silbermünzen × Preisgruppen
  { id: 21, articleGroupId: 6, customerGroupId: 1, surchargePercent: 0 },
  { id: 22, articleGroupId: 6, customerGroupId: 2, surchargePercent: 0.9 },
  { id: 23, articleGroupId: 6, customerGroupId: 3, surchargePercent: 0.6 },
  { id: 24, articleGroupId: 6, customerGroupId: 4, surchargePercent: 1.3 },
];

// ============ RATE HISTORY (Kurshistorie) ============
export const mockRateHistory: MetalRate[] = [
  // Gold Verlauf
  { id: 101, metalId: 1, rateDate: '2025-11-06', rateUsd: 97.20, rateEur: 111.9901, rateUsdPerGram: 97.20, rateEurPerGram: 111.9901, source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false },
  { id: 102, metalId: 1, rateDate: '2025-11-05', rateUsd: 96.85, rateEur: 111.58, rateUsdPerGram: 96.85, rateEurPerGram: 111.58, source: 'boerse-online', fetchedAt: '2025-11-05T13:02:10', isManual: false },
  { id: 103, metalId: 1, rateDate: '2025-11-05', rateUsd: 96.50, rateEur: 111.18, rateUsdPerGram: 96.50, rateEurPerGram: 111.18, source: 'boerse-online', fetchedAt: '2025-11-05T11:01:48', isManual: false },
  { id: 104, metalId: 1, rateDate: '2025-11-04', rateUsd: 97.10, rateEur: 111.87, rateUsdPerGram: 97.10, rateEurPerGram: 111.87, source: 'boerse-online', fetchedAt: '2025-11-04T11:02:01', isManual: false },
  { id: 105, metalId: 1, rateDate: '2025-11-04', rateUsd: 97.45, rateEur: 112.28, rateUsdPerGram: 97.45, rateEurPerGram: 112.28, source: 'manuell', fetchedAt: '2025-11-04T09:15:00', isManual: true },
  { id: 106, metalId: 1, rateDate: '2025-11-03', rateUsd: 96.20, rateEur: 110.83, rateUsdPerGram: 96.20, rateEurPerGram: 110.83, source: 'boerse-online', fetchedAt: '2025-11-03T11:01:55', isManual: false },
  // Silber Verlauf
  { id: 201, metalId: 2, rateDate: '2025-11-06', rateUsd: 1.18, rateEur: 1.3601, rateUsdPerGram: 1.18, rateEurPerGram: 1.3601, source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false },
  { id: 202, metalId: 2, rateDate: '2025-11-05', rateUsd: 1.17, rateEur: 1.3486, rateUsdPerGram: 1.17, rateEurPerGram: 1.3486, source: 'boerse-online', fetchedAt: '2025-11-05T13:02:10', isManual: false },
  { id: 203, metalId: 2, rateDate: '2025-11-04', rateUsd: 1.19, rateEur: 1.3717, rateUsdPerGram: 1.19, rateEurPerGram: 1.3717, source: 'boerse-online', fetchedAt: '2025-11-04T11:02:01', isManual: false },
  { id: 204, metalId: 2, rateDate: '2025-11-03', rateUsd: 1.16, rateEur: 1.3371, rateUsdPerGram: 1.16, rateEurPerGram: 1.3371, source: 'boerse-online', fetchedAt: '2025-11-03T11:01:55', isManual: false },
  // Platin Verlauf
  { id: 301, metalId: 3, rateDate: '2025-11-06', rateUsd: 37.97, rateEur: 43.7564, rateUsdPerGram: 37.97, rateEurPerGram: 43.7564, source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false },
  { id: 302, metalId: 3, rateDate: '2025-11-05', rateUsd: 37.80, rateEur: 43.56, rateUsdPerGram: 37.80, rateEurPerGram: 43.56, source: 'boerse-online', fetchedAt: '2025-11-05T13:02:10', isManual: false },
  { id: 303, metalId: 3, rateDate: '2025-11-04', rateUsd: 38.10, rateEur: 43.91, rateUsdPerGram: 38.10, rateEurPerGram: 43.91, source: 'boerse-online', fetchedAt: '2025-11-04T11:02:01', isManual: false },
  // Kupfer Verlauf
  { id: 401, metalId: 4, rateDate: '2025-11-06', rateUsd: 34.37, rateEur: 39.5985, rateUsdPerGram: 34.37, rateEurPerGram: 39.5985, source: 'boerse-online', fetchedAt: '2025-11-06T11:01:54', isManual: false },
  { id: 402, metalId: 4, rateDate: '2025-11-05', rateUsd: 34.20, rateEur: 39.40, rateUsdPerGram: 34.20, rateEurPerGram: 39.40, source: 'boerse-online', fetchedAt: '2025-11-05T13:02:10', isManual: false },
  { id: 403, metalId: 4, rateDate: '2025-11-04', rateUsd: 34.55, rateEur: 39.82, rateUsdPerGram: 34.55, rateEurPerGram: 39.82, source: 'boerse-online', fetchedAt: '2025-11-04T11:02:01', isManual: false },
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
    '/tax-mappings': mockTaxMappings,
    '/article-groups': mockArticleGroups,
    '/article-group-surcharges': mockArticleGroupSurcharges,
    '/rate-history': mockRateHistory,
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
