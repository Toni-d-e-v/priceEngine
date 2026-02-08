import type { SKUComponents } from '@/types';
import { parseSKU } from './parser';
import {
  MATERIAL_MAP,
  PRODUCT_MAP,
  TAX_MAP,
  MANUFACTURER_MAP,
  WEIGHT_MAP,
  QUANTITY_MAP,
  SUPPLIER_MAP,
} from './constants';

export interface SKUValidationResult {
  valid: boolean;
  errors: string[];
  components?: SKUComponents;
}

/**
 * Validiert eine SKU-Zeichenkette.
 * Prüft Format und ob alle Codes in den Stammdaten existieren.
 */
export function validateSKU(sku: string): SKUValidationResult {
  const errors: string[] = [];

  if (!sku || sku.trim().length === 0) {
    return { valid: false, errors: ['SKU darf nicht leer sein'] };
  }

  const components = parseSKU(sku.trim());
  if (!components) {
    return {
      valid: false,
      errors: ['Ungültiges SKU-Format. Erwartet: [Material]-[Produkt][Steuer]-[Hersteller]-[Stückzahl]-[Grammatur]-[Lieferant]'],
    };
  }

  return validateSKUComponents(components);
}

/**
 * Validiert einzelne SKU-Komponenten.
 */
export function validateSKUComponents(components: SKUComponents): SKUValidationResult {
  const errors: string[] = [];

  if (!MATERIAL_MAP.has(components.material)) {
    errors.push(`Unbekannter Material-Code: "${components.material}"`);
  }

  if (!PRODUCT_MAP.has(components.product)) {
    errors.push(`Unbekannter Produkt-Code: "${components.product}"`);
  }

  if (!TAX_MAP.has(components.taxType)) {
    errors.push(`Unbekannter Besteuerungs-Code: "${components.taxType}"`);
  }

  // Hersteller: Regex J + 4 Ziffern ODER aus der Map
  const manufacturerValid = MANUFACTURER_MAP.has(components.manufacturer) ||
    /^J\d{4}$/.test(components.manufacturer);
  if (!manufacturerValid) {
    errors.push(`Unbekannter Hersteller-Code: "${components.manufacturer}"`);
  }

  if (!QUANTITY_MAP.has(components.quantity)) {
    errors.push(`Unbekannter Stückzahl-Code: "${components.quantity}"`);
  }

  if (!WEIGHT_MAP.has(components.weight)) {
    errors.push(`Unbekannter Grammatur-Code: "${components.weight}"`);
  }

  if (!SUPPLIER_MAP.has(components.supplier)) {
    errors.push(`Unbekannter Lieferanten-Code: "${components.supplier}"`);
  }

  return {
    valid: errors.length === 0,
    errors,
    components,
  };
}
