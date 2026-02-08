'use client';

import Link from 'next/link';
import type { ArticlePrice, CustomerGroup } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

interface ProductPriceRowProps {
  price: ArticlePrice;
  customerGroup?: CustomerGroup;
  articleId: number;
}

export function ProductPriceRow({ price, customerGroup, articleId }: ProductPriceRowProps) {
  const isAnkauf = customerGroup?.code === 'A';

  return (
    <TableRow className={isAnkauf ? 'bg-orange-50' : ''}>
      <TableCell>{price.id}</TableCell>
      <TableCell className="font-mono text-sm">{formatEuro(price.spotPricePerGram)}</TableCell>
      <TableCell className="font-mono text-sm">{formatEuro(price.weightGrams)}</TableCell>
      <TableCell className="font-mono text-sm">{formatEuro(price.prestashopPrice)}</TableCell>
      <TableCell className="font-medium">{customerGroup?.name ?? 'Unbekannt'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <code className="text-xs">{price.formula}</code>
          <Link href={`/products/${articleId}?group=${customerGroup?.id}`}>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Pencil className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm text-right">{formatEuro(price.nettoPrice)}</TableCell>
      <TableCell className="font-mono text-sm text-right">{formatEuro(price.bruttoPrice)}</TableCell>
    </TableRow>
  );
}
