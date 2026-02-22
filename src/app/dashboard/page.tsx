'use client';

import { useApi } from '@/hooks/useApi';
import { getLatestRates, getMetals } from '@/lib/api/endpoints/rates';
import { getAllSpotRules } from '@/lib/api/endpoints/spot-rules';
import { MetalRateTable } from '@/components/dashboard/MetalRateTable';
import { MetalRateCard } from '@/components/dashboard/MetalRateCard';
import { BestPriceSection } from '@/components/dashboard/BestPriceSection';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { data: rates, isLoading: ratesLoading, refetch } = useApi(() => getLatestRates(), []);
  const { data: metals, isLoading: metalsLoading } = useApi(() => getMetals(), []);
  const { data: spotRules, isLoading: rulesLoading } = useApi(() => getAllSpotRules(), []);

  if (ratesLoading || metalsLoading || rulesLoading) return <LoadingSpinner />;
  if (!rates || !metals || !spotRules) return <p className="text-muted-foreground">Keine Daten verfügbar</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Letzte Seitenaktualisierung: {new Date().toLocaleTimeString('de-DE')}
          </p>
          <p className="text-xs text-muted-foreground">
            Preise, die älter als 650.000 Sekunden sind, werden als ungültig betrachtet
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Neu laden
        </Button>
      </div>

      {/* Rate Cards — Spot(0) only */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rates.map(rate => (
          <MetalRateCard key={rate.id} rate={rate} />
        ))}
      </div>

      {/* Rate Table — Full chain: Spot(0) → Spot(1) → Spot(2) */}
      <Card>
        <CardHeader>
          <CardTitle>Aktuelle Metallkurse</CardTitle>
        </CardHeader>
        <CardContent>
          <MetalRateTable rates={rates} metals={metals} spotRules={spotRules} />
        </CardContent>
      </Card>

      {/* Best Prices */}
      <BestPriceSection rates={rates} />
    </div>
  );
}
