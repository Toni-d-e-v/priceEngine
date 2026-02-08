'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { getArticles, getArticlePrices } from '@/lib/api/endpoints/articles';
import { getCustomerGroups } from '@/lib/api/endpoints/customer-groups';
import { ProductList } from '@/components/products/ProductList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState('');

  const { data: articles, isLoading: articlesLoading } = useApi(() => getArticles(), []);
  const { data: prices, isLoading: pricesLoading } = useApi(() => getArticlePrices(), []);
  const { data: customerGroups, isLoading: groupsLoading } = useApi(() => getCustomerGroups(), []);

  if (articlesLoading || pricesLoading || groupsLoading) return <LoadingSpinner />;
  if (!articles || !prices || !customerGroups) return <p className="text-muted-foreground">Keine Daten</p>;

  const filtered = search.trim()
    ? articles.filter(a =>
        a.sku.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="SKU oder Produktname"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Senden</Button>
      </div>

      {/* Results info */}
      <p className="text-sm text-muted-foreground">
        Ergebnisse: {filtered.length} von {articles.length} Artikeln
      </p>

      {/* Product List */}
      <ProductList articles={filtered} prices={prices} customerGroups={customerGroups} />
    </div>
  );
}
