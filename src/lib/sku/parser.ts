import type { SKUComponents } from '@/types';
import {
  MATERIAL_MAP,
  PRODUCT_MAP,
  TAX_MAP,
  MANUFACTURER_MAP,
  WEIGHT_MAP,
  QUANTITY_MAP,
  SUPPLIER_MAP,
} from './constants';

/**
 * Parst eine SKU-Zeichenkette in ihre Einzelkomponenten.
 * Format: [Material]-[Produkt][Besteuerung]-[Hersteller]-[Stückzahl]-[Grammatur]-[Lieferant]
 * Beispiel: Au-CBo-J0001-S0100-G00001-HM
 */
export function parseSKU(sku: string): SKUComponents | null {
  const parts = sku.split('-');
  if (parts.length !== 6) return null;

  const material = parts[0];
  const productTax = parts[1];
  const manufacturer = parts[2];
  const quantity = parts[3];
  const weight = parts[4];
  const supplier = parts[5];

  if (productTax.length < 3) return null;
  const product = productTax.slice(0, 2);
  const taxType = productTax.slice(2);

  return {
    material,
    product,
    taxType,
    manufacturer,
    quantity,
    weight,
    supplier,
  };
}

/**
 * Formatiert SKU-Komponenten als lesbaren String.
 */
export function formatSKUComponents(components: SKUComponents): string {
  const lines = [
    `Material: ${MATERIAL_MAP.get(components.material) ?? components.material} (${components.material})`,
    `Produkt: ${PRODUCT_MAP.get(components.product) ?? components.product} (${components.product})`,
    `Besteuerung: ${TAX_MAP.get(components.taxType) ?? components.taxType} (${components.taxType})`,
    `Hersteller: ${MANUFACTURER_MAP.get(components.manufacturer) ?? components.manufacturer} (${components.manufacturer})`,
    `Stückzahl: ${QUANTITY_MAP.get(components.quantity)?.name ?? components.quantity} (${components.quantity})`,
    `Grammatur: ${WEIGHT_MAP.get(components.weight)?.name ?? components.weight} (${components.weight})`,
    `Lieferant: ${SUPPLIER_MAP.get(components.supplier) ?? components.supplier} (${components.supplier})`,
  ];

  return lines.join('\n');
}
