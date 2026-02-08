'use client';

import type { Article, ArticlePrice, CustomerGroup } from '@/types';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProductPriceRow } from './ProductPriceRow';

interface ProductListProps {
  articles: Article[];
  prices: ArticlePrice[];
  customerGroups: CustomerGroup[];
}

export function ProductList({ articles, prices, customerGroups }: ProductListProps) {
  return (
    <div className="space-y-6">
      {articles.map(article => {
        const articlePrices = prices.filter(p => p.articleId === article.id);

        return (
          <div key={article.id} className="rounded-lg border">
            {/* Article Header */}
            <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3">
              <Badge variant="outline" className="uppercase">
                {article.skuComponents.material === 'Au' ? 'GOLDBARREN' :
                  article.skuComponents.material === 'Ag' ? 'SILBERBARREN' :
                  article.skuComponents.material === 'Pt' ? 'PLATINBARREN' : 'BARREN'}
              </Badge>
              <Badge variant="secondary" className="font-mono">{article.sku}</Badge>
              <span className="text-sm font-medium uppercase">{article.name}</span>
              <div className="ml-auto">
                {article.isInShop ? (
                  <Badge className="bg-green-600">Aktiv im Shop</Badge>
                ) : (
                  <Badge variant="destructive">Inaktiv in PrestaShop</Badge>
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
                    <TableHead>Prestashop-Price</TableHead>
                    <TableHead>Gruppe</TableHead>
                    <TableHead>Formel</TableHead>
                    <TableHead className="text-right">Netto</TableHead>
                    <TableHead className="text-right">Brutto + DE Steuer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articlePrices.map(price => {
                    const group = customerGroups.find(g => g.id === price.customerGroupId);
                    return (
                      <ProductPriceRow
                        key={price.id}
                        price={price}
                        customerGroup={group}
                        articleId={article.id}
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
