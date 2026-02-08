import { apiGet } from '../client';
import type { Metal, MetalRate } from '@/types';

export async function getMetals(): Promise<Metal[]> {
  return apiGet<Metal[]>('/metals');
}

export async function getLatestRates(): Promise<MetalRate[]> {
  return apiGet<MetalRate[]>('/rates/latest');
}

export async function getAllRates(): Promise<MetalRate[]> {
  return apiGet<MetalRate[]>('/rates');
}
