// SKU-Konstanten für das PriceEngine Artikelnummern-System
// Format: [Material]-[Produkt][Besteuerung]-[Hersteller]-[Stückzahl]-[Grammatur]-[Lieferant]

export interface SKUCodeEntry {
  code: string;
  name: string;
}

export interface WeightCodeEntry extends SKUCodeEntry {
  grams: number;
}

export interface QuantityCodeEntry extends SKUCodeEntry {
  quantity: number;
}

export interface TaxCodeEntry extends SKUCodeEntry {
  rate: number;
}

// ============ Material-Codes ============
export const MATERIAL_CODES: SKUCodeEntry[] = [
  { code: 'Au', name: 'Gold' },
  { code: 'Ag', name: 'Silber' },
  { code: 'Os', name: 'Osmium' },
  { code: 'Pt', name: 'Platin' },
  { code: 'Cu', name: 'Kupfer' },
  { code: 'Rh', name: 'Rhodium' },
  { code: 'Ru', name: 'Ruthenium' },
  { code: 'Ir', name: 'Iridium' },
  { code: 'Pd', name: 'Palladium' },
  { code: 'Ti', name: 'Titan' },
  { code: 'Dd', name: 'Diverse' },
];

// ============ Produkt-Codes ============
export const PRODUCT_CODES: SKUCodeEntry[] = [
  { code: 'PB', name: 'Prägebarren' },
  { code: 'GB', name: 'Gussbarren' },
  { code: 'CB', name: 'Combibarren / Boxen' },
  { code: 'CC', name: 'Combibarren / Collection' },
  { code: 'TB', name: 'Tafelbarren' },
  { code: 'FC', name: 'Fine Card' },
  { code: 'SC', name: 'Secaincard' },
  { code: 'MB', name: 'Münzbarren' },
  { code: 'MU', name: 'Münzen' },
  { code: 'ME', name: 'Medaillen' },
  { code: 'MT', name: 'Münz-Tubes' },
  { code: 'BT', name: 'Barren-Tubes' },
  { code: 'EP', name: 'Eigenprodukte' },
  { code: 'GG', name: 'Gourmet-Gold' },
  { code: 'GE', name: 'Geschenkartikel' },
  { code: 'ZB', name: 'Zubehör' },
];

// ============ Besteuerungs-Codes ============
export const TAX_CODES: TaxCodeEntry[] = [
  { code: 'o', name: 'Ohne Steuer', rate: 0 },
  { code: 'r', name: 'Regelbesteuert (19%)', rate: 19 },
  { code: 'd', name: 'Differenzbesteuert', rate: 0 },
];

// ============ Hersteller-Codes ============
export const MANUFACTURER_CODES: SKUCodeEntry[] = [
  { code: 'J0001', name: 'Heimerle & Meule' },
  { code: 'J0002', name: 'C. Hafner' },
  { code: 'J0003', name: 'HERAEUS' },
  { code: 'J0004', name: 'LEV / Geiger' },
  { code: 'J0005', name: 'UMICORE' },
  { code: 'J0006', name: 'IGR / Istanbul Gold Refinery' },
  { code: 'J0007', name: 'DEGUSSA' },
  { code: 'J0008', name: 'Münze Österreich / Wiener Philh.' },
  { code: 'J0009', name: 'LEV / Arche Noah' },
  { code: 'J0010', name: 'United States Mint / American Eagle' },
  { code: 'J0011', name: 'United States Mint / Buffalo' },
  { code: 'J0012', name: 'Rand Refinery / Krüger Rand' },
  { code: 'J0013', name: 'Perth Mint / Känguru' },
  { code: 'J0014', name: 'Perth Mint / Koala' },
  { code: 'J0015', name: 'Royal Canadian Mint / Maple Leaf' },
  { code: 'J0016', name: 'Royal Mint / Britannia' },
  { code: 'J0017', name: 'New Zealand Mint / Kiwi' },
  { code: 'J0018', name: 'HISTORISCH / Kurantmünzen' },
  { code: 'J0019', name: 'Diverse' },
];

// ============ Grammatur-Codes ============
export const WEIGHT_CODES: WeightCodeEntry[] = [
  { code: 'G00000', name: '0,5 g', grams: 0.5 },
  { code: 'G00001', name: '1 g', grams: 1 },
  { code: 'G00005', name: '5 g', grams: 5 },
  { code: 'G00010', name: '10 g', grams: 10 },
  { code: 'G00020', name: '20 g', grams: 20 },
  { code: 'G00025', name: '25 g', grams: 25 },
  { code: 'G00050', name: '50 g', grams: 50 },
  { code: 'G00100', name: '100 g', grams: 100 },
  { code: 'G00250', name: '250 g', grams: 250 },
  { code: 'G00500', name: '500 g', grams: 500 },
  { code: 'G01000', name: '1000 g', grams: 1000 },
  { code: 'G70001', name: '1 oz', grams: 31.1034768 },
  { code: 'G71002', name: '1/2 oz', grams: 15.5517384 },
  { code: 'G71004', name: '1/4 oz', grams: 7.7758692 },
  { code: 'G71010', name: '1/10 oz', grams: 3.11034768 },
  { code: 'G71020', name: '1/20 oz', grams: 1.55517384 },
  { code: 'G71025', name: '1/25 oz', grams: 1.24413907 },
  { code: 'G70002', name: '2 oz', grams: 62.2069536 },
  { code: 'G70003', name: '3 oz', grams: 93.3104304 },
  { code: 'G70005', name: '5 oz', grams: 155.517384 },
  { code: 'G70010', name: '10 oz', grams: 311.034768 },
  { code: 'G70012', name: '12 oz', grams: 373.241722 },
  { code: 'G70100', name: '100 oz', grams: 3110.34768 },
];

// ============ Stückzahl-Codes ============
export const QUANTITY_CODES: QuantityCodeEntry[] = [
  { code: 'S0001', name: '1 Stück', quantity: 1 },
  { code: 'S0020', name: '20 Stück', quantity: 20 },
  { code: 'S0050', name: '50 Stück', quantity: 50 },
  { code: 'S0100', name: '100 Stück', quantity: 100 },
  { code: 'S0250', name: '250 Stück', quantity: 250 },
];

// ============ Lieferanten-Codes ============
export const SUPPLIER_CODES: SKUCodeEntry[] = [
  { code: 'HM', name: 'Heimerle & Meule' },
  { code: 'CH', name: 'C. Hafner' },
  { code: 'SG', name: 'SOLIT Gruppe' },
  { code: 'GE', name: 'LEV / Geiger' },
  { code: 'AG', name: 'Auragentum' },
  { code: 'IG', name: 'IGR / Istanbul Gold Refinery' },
  { code: 'DG', name: 'DEGUSSA' },
  { code: 'MÖ', name: 'Münze Österreich' },
  { code: 'ZI', name: 'Ziemann' },
  { code: 'OI', name: 'Osmiuminstitut' },
  { code: 'EG', name: 'ESG-Edelmetall Service GmbH' },
  { code: 'DV', name: 'Diverse' },
];

// ============ Lookup Maps ============
export const MATERIAL_MAP = new Map(MATERIAL_CODES.map(c => [c.code, c.name]));
export const PRODUCT_MAP = new Map(PRODUCT_CODES.map(c => [c.code, c.name]));
export const TAX_MAP = new Map(TAX_CODES.map(c => [c.code, c.name]));
export const MANUFACTURER_MAP = new Map(MANUFACTURER_CODES.map(c => [c.code, c.name]));
export const WEIGHT_MAP = new Map(WEIGHT_CODES.map(c => [c.code, c]));
export const QUANTITY_MAP = new Map(QUANTITY_CODES.map(c => [c.code, c]));
export const SUPPLIER_MAP = new Map(SUPPLIER_CODES.map(c => [c.code, c.name]));

// Material → Metall-Symbol Mapping (für API-Verknüpfung)
export const MATERIAL_TO_SYMBOL: Record<string, string> = {
  Au: 'XAU',
  Ag: 'XAG',
  Pt: 'XPT',
  Pd: 'XPD',
};
