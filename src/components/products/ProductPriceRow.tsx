'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Article, ArticlePrice, CustomerGroup } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function resolveFormula(formula: string, spot: number, weight: number, facon: number, aufschlag: number): string {
  return formula
    .replace(/\$spot/g, spot.toFixed(4))
    .replace(/\$weight/g, weight.toFixed(2))
    .replace(/\$facon/g, facon.toFixed(2))
    .replace(/\$aufschlag/g, aufschlag.toFixed(4));
}

interface ProductPriceRowProps {
  price: ArticlePrice;
  customerGroup?: CustomerGroup;
  articleId: number;
  article: Article;
  formulaName?: string;
  faconCost: number;
  onFaconChange: (value: number) => void;
}

export function ProductPriceRow({ price, customerGroup, articleId, article, formulaName, faconCost, onFaconChange }: ProductPriceRowProps) {
  const isAnkauf = customerGroup?.direction === 'ankauf';
  const [editingFacon, setEditingFacon] = useState(false);
  const [faconInput, setFaconInput] = useState(String(faconCost));

  const aufschlag = 1 + (customerGroup?.surchargePercent ?? 0) / 100;
  const klartextFormel = resolveFormula(price.formula, price.spotPricePerGram / price.weightGrams, price.weightGrams, faconCost, aufschlag);

  function handleFaconBlur() {
    setEditingFacon(false);
    const val = parseFloat(faconInput) || 0;
    onFaconChange(val);
  }

  return (
    <TableRow className={isAnkauf ? 'bg-orange-50' : ''}>
      <TableCell>{price.id}</TableCell>
      <TableCell className="font-mono text-sm">{formatEuro(price.spotPricePerGram)}</TableCell>
      <TableCell className="font-mono text-sm">{formatEuro(price.weightGrams)}</TableCell>
      <TableCell className="font-medium">{customerGroup?.name ?? 'Unbekannt'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {formulaName ? (
            <Badge variant="secondary" className="text-xs">{formulaName}</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">individuell</Badge>
          )}
          <Link href={`/products/${articleId}?group=${customerGroup?.id}`}>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Pencil className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <code className="text-xs text-muted-foreground">{klartextFormel}</code>
      </TableCell>
      <TableCell className="text-right">
        {editingFacon ? (
          <Input
            type="number"
            step="0.01"
            value={faconInput}
            onChange={e => setFaconInput(e.target.value)}
            onBlur={handleFaconBlur}
            onKeyDown={e => e.key === 'Enter' && handleFaconBlur()}
            autoFocus
            className="h-7 w-20 text-right font-mono text-xs ml-auto"
          />
        ) : (
          <button
            onClick={() => { setFaconInput(String(faconCost)); setEditingFacon(true); }}
            className="font-mono text-sm hover:underline cursor-pointer"
            title="Klicken zum Bearbeiten"
          >
            {faconCost.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </button>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Badge variant="outline" className="text-xs font-mono">
          {customerGroup?.surchargePercent !== undefined && customerGroup.surchargePercent !== 0
            ? `+${customerGroup.surchargePercent}%`
            : '0%'}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-sm text-right">{formatEuro(price.taxAmount)}</TableCell>
      <TableCell className="font-mono text-sm text-right">{formatEuro(price.nettoPrice)}</TableCell>
      <TableCell className="font-mono text-sm text-right">{formatEuro(price.bruttoPrice)}</TableCell>
    </TableRow>
  );
}
