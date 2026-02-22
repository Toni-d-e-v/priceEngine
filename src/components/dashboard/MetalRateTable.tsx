'use client';

import { useState } from 'react';
import type { Metal, MetalRate, SpotRule } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const METAL_NAMES: Record<number, string> = {
  1: 'Gold',
  2: 'Silber',
  3: 'Platin',
  4: 'Kupfer',
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
  metals?: Metal[];
  spotRules?: SpotRule[];
}

export function MetalRateTable({ rates, metals, spotRules }: MetalRateTableProps) {
  const [surcharges, setSurcharges] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    metals?.forEach(m => { initial[m.id] = m.globalSurcharge; });
    return initial;
  });

  function handleSurchargeChange(metalId: number, value: string) {
    const num = parseFloat(value) || 0;
    setSurcharges(prev => ({ ...prev, [metalId]: num }));
    toast.success(`Globaler Aufschlag für ${METAL_NAMES[metalId]} geändert (Mock)`);
  }

  function getActiveRule(metalId: number): SpotRule | undefined {
    return spotRules?.find(
      r => r.metalId === metalId && r.direction === 'verkauf' && r.isActive
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metall</TableHead>
          <TableHead>Einheit</TableHead>
          <TableHead className="text-right">USD</TableHead>
          <TableHead className="text-right">EUR Spot(0)</TableHead>
          <TableHead className="text-right">Aufschlag</TableHead>
          <TableHead className="text-right">EUR Spot(1)</TableHead>
          <TableHead>Zeitregel</TableHead>
          <TableHead className="text-right font-bold">EUR Spot(2)</TableHead>
          <TableHead>Preisdatum</TableHead>
          <TableHead>Alter</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map(rate => {
          const age = getAgeSeconds(rate.fetchedAt);
          const isOld = age > 650000;
          const surcharge = surcharges[rate.metalId] ?? 0;
          const spot1 = rate.rateEurPerGram + surcharge;
          const activeRule = getActiveRule(rate.metalId);
          const spot2 = activeRule ? activeRule.calculatedValue : spot1;

          return (
            <TableRow key={rate.id}>
              <TableCell className="font-medium">{METAL_NAMES[rate.metalId] ?? `Metal ${rate.metalId}`}</TableCell>
              <TableCell>Gram</TableCell>
              <TableCell className="text-right font-mono">{formatNumber(rate.rateUsd)}</TableCell>
              <TableCell className="text-right font-mono">{formatNumber(rate.rateEur)}</TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  step="0.01"
                  value={surcharge}
                  onChange={e => handleSurchargeChange(rate.metalId, e.target.value)}
                  className="h-7 w-20 text-right font-mono text-xs ml-auto"
                />
              </TableCell>
              <TableCell className="text-right font-mono">{formatNumber(spot1)}</TableCell>
              <TableCell>
                {activeRule ? (
                  <div className="space-y-0.5">
                    <code className="text-xs text-muted-foreground">{activeRule.formula}</code>
                    <p className="text-xs text-muted-foreground">
                      {activeRule.dayName ?? activeRule.description}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right font-mono font-bold text-emerald-700">
                {formatNumber(spot2)}
              </TableCell>
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
