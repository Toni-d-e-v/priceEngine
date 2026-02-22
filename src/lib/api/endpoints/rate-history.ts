import { apiGet } from '../client';
import type { MetalRate } from '@/types';

export async function getRateHistory(): Promise<MetalRate[]> {
  return apiGet<MetalRate[]>('/rate-history');
}
