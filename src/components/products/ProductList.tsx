'use client';

import { useState } from 'react';
import type { Article, ArticlePrice, CustomerGroup, Formula } from '@/types';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProductPriceRow } from './ProductPriceRow';
import { toast } from 'sonner';

interface ProductListProps {
  articles: Article[];
  prices: ArticlePrice[];
  customerGroups: CustomerGroup[];
  formulas: Formula[];
}

export function ProductList({ articles, prices, customerGroups, formulas }: ProductListProps) {
  const [faconOverrides, setFaconOverrides] = useState<Record<number, number>>({});

  function handleFaconChange(articleId: number, value: number) {
    setFaconOverrides(prev => ({ ...prev, [articleId]: value }));
    toast.success(`Faconkosten für Artikel ${articleId} geändert (Mock)`);
  }

  return (
    <div className="space-y-6">
      {articles.map(article => {
        const articlePrices = prices.filter(p => p.articleId === article.id);
        const currentFacon = faconOverrides[article.id] ?? article.faconCost;

        return (
          <div key={article.id} className="rounded-lg border">
            {/* Article Header */}
            <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3">
              <Badge variant="outline" className="uppercase">
                {article.skuComponents.material === 'Au' ? 'GOLDBARREN' :
                  article.skuComponents.material === 'Ag' ? 'SILBERBARREN' :
                  article.skuComponents.material === 'Pt' ? 'PLATINBARREN' :
                  article.skuComponents.material === 'Cu' ? 'KUPFERBARREN' : 'BARREN'}
              </Badge>
              <Badge variant="secondary" className="font-mono">{article.sku}</Badge>
              <span className="text-sm font-medium uppercase">{article.name}</span>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Facon: {currentFacon.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {article.faconType === 'absolute' ? '€' : '%'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {article.taxType === 'steuerfrei' ? 'Steuerfrei' : 'Regelbesteuert 19%'}
                </Badge>
                {article.isInShop ? (
                  <Badge className="bg-green-600">Aktiv im Shop</Badge>
                ) : (
                  <Badge variant="destructive">Inaktiv</Badge>
                )}
              </div>
            </div>

            {/* Price Table */}
            {articlePrices.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Spot-Price x Gewicht</TableHead>
                    <TableHead>Gewicht (Gramm)</TableHead>
                    <TableHead>Gruppe</TableHead>
                    <TableHead>Formelname</TableHead>
                    <TableHead>Klartext-Formel</TableHead>
                    <TableHead className="text-right">Faconkosten</TableHead>
                    <TableHead className="text-right">Auf-/Abschlag</TableHead>
                    <TableHead className="text-right">Steuer</TableHead>
                    <TableHead className="text-right">Netto</TableHead>
                    <TableHead className="text-right">Brutto + DE Steuer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articlePrices.map(price => {
                    const group = customerGroups.find(g => g.id === price.customerGroupId);
                    const formula = formulas.find(f => f.expression === price.formula);
                    return (
                      <ProductPriceRow
                        key={price.id}
                        price={price}
                        customerGroup={group}
                        articleId={article.id}
                        article={article}
                        formulaName={formula?.name}
                        faconCost={currentFacon}
                        onFaconChange={(val) => handleFaconChange(article.id, val)}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        );
      })}
    </div>
  );
}
