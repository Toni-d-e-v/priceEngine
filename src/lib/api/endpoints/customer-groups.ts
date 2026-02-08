import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import type { CustomerGroup } from '@/types';

export async function getCustomerGroups(): Promise<CustomerGroup[]> {
  return apiGet<CustomerGroup[]>('/customer-groups');
}

export async function createCustomerGroup(group: Omit<CustomerGroup, 'id'>): Promise<CustomerGroup> {
  return apiPost<CustomerGroup>('/customer-groups', group);
}

export async function updateCustomerGroup(id: number, group: Partial<CustomerGroup>): Promise<CustomerGroup> {
  return apiPut<CustomerGroup>(`/customer-groups/${id}`, group);
}

export async function deleteCustomerGroup(id: number): Promise<void> {
  return apiDelete(`/customer-groups/${id}`);
}
