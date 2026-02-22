'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { getArticles, getArticlePrices } from '@/lib/api/endpoints/articles';
import { getCustomerGroups } from '@/lib/api/endpoints/customer-groups';
import { getFormulas } from '@/lib/api/endpoints/formulas';
import { ProductList } from '@/components/products/ProductList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  const { data: articles, isLoading: articlesLoading } = useApi(() => getArticles(), []);
  const { data: prices, isLoading: pricesLoading } = useApi(() => getArticlePrices(), []);
  const { data: customerGroups, isLoading: groupsLoading } = useApi(() => getCustomerGroups(), []);
  const { data: formulas, isLoading: formulasLoading } = useApi(() => getFormulas(), []);

  if (articlesLoading || pricesLoading || groupsLoading || formulasLoading) return <LoadingSpinner />;
  if (!articles || !prices || !customerGroups || !formulas) return <p className="text-muted-foreground">Keine Daten</p>;

  // Filter Artikel nach Suchbegriff
  const filteredArticles = search.trim()
    ? articles.filter(a =>
        a.sku.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  // Filter Preise nach Preisgruppe
  const filteredPrices = groupFilter !== 'all'
    ? prices.filter(p => p.customerGroupId === parseInt(groupFilter))
    : prices;

  return (
    <div className="space-y-6">
      {/* Filter-Leiste */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] max-w-md space-y-1">
          <Label className="text-xs">Suche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="SKU oder Produktname"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="min-w-[180px] space-y-1">
          <Label className="text-xs">Preisgruppe</Label>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Preisgruppen</SelectItem>
              {customerGroups.map(g => (
                <SelectItem key={g.id} value={String(g.id)}>
                  [{g.code}] {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">Senden</Button>
      </div>

      {/* Ergebnisse */}
      <p className="text-sm text-muted-foreground">
        Ergebnisse: {filteredArticles.length} von {articles.length} Artikeln
        {groupFilter !== 'all' && (
          <span> · Preisgruppe: {customerGroups.find(g => g.id === parseInt(groupFilter))?.name}</span>
        )}
      </p>

      {/* Product List */}
      <ProductList articles={filteredArticles} prices={filteredPrices} customerGroups={customerGroups} formulas={formulas} />
    </div>
  );
}
