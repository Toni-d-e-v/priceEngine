'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { getArticleById, getArticlePricesByArticle } from '@/lib/api/endpoints/articles';
import { getCustomerGroups } from '@/lib/api/endpoints/customer-groups';
import { getLatestRates } from '@/lib/api/endpoints/rates';
import { getAllSpotRules } from '@/lib/api/endpoints/spot-rules';
import { ProductDetailForm } from '@/components/products/ProductDetailForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ProductDetailPage({ params }: { params: Promise<{ articleId: string }> }) {
  const { articleId } = use(params);
  const searchParams = useSearchParams();
  const groupId = parseInt(searchParams.get('group') ?? '1');
  const id = parseInt(articleId);

  const { data: article, isLoading: articleLoading } = useApi(() => getArticleById(id), [id]);
  const { data: prices, isLoading: pricesLoading } = useApi(() => getArticlePricesByArticle(id), [id]);
  const { data: groups, isLoading: groupsLoading } = useApi(() => getCustomerGroups(), []);
  const { data: rates, isLoading: ratesLoading } = useApi(() => getLatestRates(), []);
  const { data: rules, isLoading: rulesLoading } = useApi(() => getAllSpotRules(), []);

  if (articleLoading || pricesLoading || groupsLoading || ratesLoading || rulesLoading) {
    return <LoadingSpinner />;
  }

  if (!article || !prices || !groups || !rates || !rules) {
    return <p className="text-muted-foreground">Artikel nicht gefunden</p>;
  }

  const price = prices.find(p => p.customerGroupId === groupId) ?? prices[0];
  const group = groups.find(g => g.id === (price?.customerGroupId ?? groupId)) ?? groups[0];

  if (!price || !group) {
    return <p className="text-muted-foreground">Keine Preisdaten vorhanden</p>;
  }

  // Find active spot price for this article's metal
  const direction = article.priceType;
  const activeRule = rules.find(
    r => r.metalId === article.metalId && r.direction === direction && r.isActive && r.ruleType === 'standard'
  );
  const rate = rates.find(r => r.metalId === article.metalId);
  const spotPrice = activeRule?.calculatedValue ?? rate?.rateEurPerGram ?? 0;

  return (
    <ProductDetailForm
      article={article}
      price={price}
      customerGroup={group}
      spotPrice={spotPrice}
    />
  );
}
