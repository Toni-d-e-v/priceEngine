import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import type { Holiday } from '@/types';

export async function getHolidays(): Promise<Holiday[]> {
  return apiGet<Holiday[]>('/holidays');
}

export async function createHoliday(holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
  return apiPost<Holiday>('/holidays', holiday);
}

export async function updateHoliday(id: number, holiday: Partial<Holiday>): Promise<Holiday> {
  return apiPut<Holiday>(`/holidays/${id}`, holiday);
}

export async function deleteHoliday(id: number): Promise<void> {
  return apiDelete(`/holidays/${id}`);
}
