'use client';

import type { MetalRate } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const METAL_NAMES: Record<number, string> = {
  1: 'Gold',
  2: 'Silver',
  3: 'Platin',
  4: 'Palladium',
};

function formatNumber(value: number, decimals = 4): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function getAgeSeconds(fetchedAt: string): number {
  return Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 1000);
}

interface MetalRateTableProps {
  rates: MetalRate[];
}

export function MetalRateTable({ rates }: MetalRateTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metall</TableHead>
          <TableHead>Einheit</TableHead>
          <TableHead className="text-right">USD</TableHead>
          <TableHead className="text-right">EUR</TableHead>
          <TableHead>Preisdatum</TableHead>
          <TableHead>Alter</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map(rate => {
          const age = getAgeSeconds(rate.fetchedAt);
          const isOld = age > 650000;
          return (
            <TableRow key={rate.id}>
              <TableCell className="font-medium">{METAL_NAMES[rate.metalId] ?? `Metal ${rate.metalId}`}</TableCell>
              <TableCell>Gram</TableCell>
              <TableCell className="text-right font-mono">{formatNumber(rate.rateUsd)}</TableCell>
              <TableCell className="text-right font-mono">{formatNumber(rate.rateEur)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(rate.fetchedAt).toLocaleString('de-DE')}
              </TableCell>
              <TableCell>
                <Badge variant={isOld ? 'destructive' : 'default'} className={isOld ? '' : 'bg-green-600'}>
                  {age.toLocaleString('de-DE')} Sek.
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
