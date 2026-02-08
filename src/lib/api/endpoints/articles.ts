import { apiGet, apiPost, apiPut, apiDelete } from '../client';
import type { Article, ArticlePrice } from '@/types';

export async function getArticles(): Promise<Article[]> {
  return apiGet<Article[]>('/articles');
}

export async function getArticleById(id: number): Promise<Article> {
  return apiGet<Article>(`/articles/${id}`);
}

export async function createArticle(article: Omit<Article, 'id'>): Promise<Article> {
  return apiPost<Article>('/articles', article);
}

export async function updateArticle(id: number, article: Partial<Article>): Promise<Article> {
  return apiPut<Article>(`/articles/${id}`, article);
}

export async function deleteArticle(id: number): Promise<void> {
  return apiDelete(`/articles/${id}`);
}

export async function getArticlePrices(): Promise<ArticlePrice[]> {
  return apiGet<ArticlePrice[]>('/article-prices');
}

export async function getArticlePricesByArticle(articleId: number): Promise<ArticlePrice[]> {
  return apiGet<ArticlePrice[]>(`/article-prices/article/${articleId}`);
}

export async function updateArticlePrice(id: number, price: Partial<ArticlePrice>): Promise<ArticlePrice> {
  return apiPut<ArticlePrice>(`/article-prices/${id}`, price);
}
