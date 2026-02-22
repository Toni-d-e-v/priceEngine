import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import type { ArticleGroup, ArticleGroupSurcharge } from '@/types';

export async function getArticleGroups(): Promise<ArticleGroup[]> {
  return apiGet<ArticleGroup[]>('/article-groups');
}

export async function createArticleGroup(group: Omit<ArticleGroup, 'id'>): Promise<ArticleGroup> {
  return apiPost<ArticleGroup>('/article-groups', group);
}

export async function updateArticleGroup(id: number, group: Partial<ArticleGroup>): Promise<ArticleGroup> {
  return apiPut<ArticleGroup>(`/article-groups/${id}`, group);
}

export async function deleteArticleGroup(id: number): Promise<void> {
  return apiDelete(`/article-groups/${id}`);
}

export async function getArticleGroupSurcharges(): Promise<ArticleGroupSurcharge[]> {
  return apiGet<ArticleGroupSurcharge[]>('/article-group-surcharges');
}

export async function updateArticleGroupSurcharge(id: number, data: Partial<ArticleGroupSurcharge>): Promise<ArticleGroupSurcharge> {
  return apiPut<ArticleGroupSurcharge>(`/article-group-surcharges/${id}`, data);
}
