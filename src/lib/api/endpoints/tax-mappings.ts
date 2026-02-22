import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import type { TaxMapping } from '@/types';

export async function getTaxMappings(): Promise<TaxMapping[]> {
  return apiGet<TaxMapping[]>('/tax-mappings');
}

export async function createTaxMapping(mapping: Omit<TaxMapping, 'id'>): Promise<TaxMapping> {
  return apiPost<TaxMapping>('/tax-mappings', mapping);
}

export async function updateTaxMapping(id: number, mapping: Partial<TaxMapping>): Promise<TaxMapping> {
  return apiPut<TaxMapping>(`/tax-mappings/${id}`, mapping);
}

export async function deleteTaxMapping(id: number): Promise<void> {
  return apiDelete(`/tax-mappings/${id}`);
}
