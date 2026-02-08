import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import type { Formula } from '@/types';

export async function getFormulas(): Promise<Formula[]> {
  return apiGet<Formula[]>('/formulas');
}

export async function createFormula(formula: Omit<Formula, 'id'>): Promise<Formula> {
  return apiPost<Formula>('/formulas', formula);
}

export async function updateFormula(id: number, formula: Partial<Formula>): Promise<Formula> {
  return apiPut<Formula>(`/formulas/${id}`, formula);
}

export async function deleteFormula(id: number): Promise<void> {
  return apiDelete(`/formulas/${id}`);
}
