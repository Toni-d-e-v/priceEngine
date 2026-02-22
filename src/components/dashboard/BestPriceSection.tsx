'use client';

import type { MetalRate } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const METAL_NAMES: Record<number, string> = {
  1: 'Gold',
  2: 'Silber',
  3: 'Platin',
  4: 'Kupfer',
};

function formatNumber(value: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

interface BestPriceSectionProps {
  rates: MetalRate[];
}

export function BestPriceSection({ rates }: BestPriceSectionProps) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">Beste Preise Gram</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rates.map(rate => (
          <Card key={rate.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{METAL_NAMES[rate.metalId]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span>{rate.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">USD/Gram:</span>
                <span className="font-mono">{formatNumber(rate.rateUsdPerGram)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">EUR/Gram:</span>
                <span className="font-mono font-medium">{formatNumber(rate.rateEurPerGram)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
