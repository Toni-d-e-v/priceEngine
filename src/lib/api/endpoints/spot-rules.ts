import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import type { SpotRule, PriceDirection } from '@/types';

export async function getAllSpotRules(): Promise<SpotRule[]> {
  return apiGet<SpotRule[]>('/spot-rules');
}

export async function getSpotRulesByMetalAndDirection(
  metalId: number,
  direction: PriceDirection
): Promise<SpotRule[]> {
  return apiGet<SpotRule[]>(`/spot-rules/${metalId}/${direction}`);
}

export async function createSpotRule(rule: Omit<SpotRule, 'id'>): Promise<SpotRule> {
  return apiPost<SpotRule>('/spot-rules', rule);
}

export async function updateSpotRule(id: number, rule: Partial<SpotRule>): Promise<SpotRule> {
  return apiPut<SpotRule>(`/spot-rules/${id}`, rule);
}

export async function deleteSpotRule(id: number): Promise<void> {
  return apiDelete(`/spot-rules/${id}`);
}
