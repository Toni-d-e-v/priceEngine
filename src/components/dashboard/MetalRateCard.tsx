'use client';

import type { MetalRate } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const METAL_NAMES: Record<number, string> = {
  1: 'Gold',
  2: 'Silver',
  3: 'Platin',
  4: 'Palladium',
};

const METAL_COLORS: Record<number, string> = {
  1: 'text-yellow-600',
  2: 'text-gray-400',
  3: 'text-blue-400',
  4: 'text-purple-400',
};

function formatNumber(value: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

interface MetalRateCardProps {
  rate: MetalRate;
}

export function MetalRateCard({ rate }: MetalRateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium ${METAL_COLORS[rate.metalId] ?? ''}`}>
          {METAL_NAMES[rate.metalId] ?? `Metal ${rate.metalId}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(rate.rateEur)} EUR</div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatNumber(rate.rateUsd)} USD / Gram
        </p>
      </CardContent>
    </Card>
  );
}
