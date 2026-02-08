import type { SKUComponents } from '@/types';
import {
  MATERIAL_MAP,
  PRODUCT_MAP,
  MANUFACTURER_MAP,
  WEIGHT_MAP,
  QUANTITY_MAP,
} from './constants';

/**
 * Baut eine SKU-Zeichenkette aus den einzelnen Komponenten zusammen.
 * Format: [Material]-[Produkt][Besteuerung]-[Hersteller]-[Stückzahl]-[Grammatur]-[Lieferant]
 * Beispiel: Au-CBo-J0001-S0100-G00001-HM
 */
export function buildSKU(components: SKUComponents): string {
  const { material, product, taxType, manufacturer, quantity, weight, supplier } = components;
  return `${material}-${product}${taxType}-${manufacturer}-${quantity}-${weight}-${supplier}`;
}

/**
 * Gibt das Gewicht in Gramm für einen Grammatur-Code zurück.
 * z.B. 'G00001' → 1, 'G70001' → 31.1034768
 */
export function getWeightFromCode(weightCode: string): number | null {
  const entry = WEIGHT_MAP.get(weightCode);
  return entry ? entry.grams : null;
}

/**
 * Erstellt eine Beschreibung aus den SKU-Komponenten.
 * z.B. "20 x 1 Gramm Gold Combibarren (Heimerle & Meule)"
 */
export function buildArticleDescription(components: SKUComponents): string {
  const materialName = MATERIAL_MAP.get(components.material) ?? components.material;
  const productName = PRODUCT_MAP.get(components.product) ?? components.product;
  const quantityEntry = QUANTITY_MAP.get(components.quantity);
  const weightEntry = WEIGHT_MAP.get(components.weight);
  const manufacturerName = MANUFACTURER_MAP.get(components.manufacturer) ?? components.manufacturer;

  const qty = quantityEntry ? quantityEntry.quantity : 1;
  const weightLabel = weightEntry ? weightEntry.name : components.weight;

  if (qty > 1) {
    return `${qty} x ${weightLabel} ${materialName} ${productName} (${manufacturerName})`;
  }
  return `${weightLabel} ${materialName} ${productName} (${manufacturerName})`;
}
