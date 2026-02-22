'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { getAllSpotRules } from '@/lib/api/endpoints/spot-rules';
import { getLatestRates } from '@/lib/api/endpoints/rates';
import { MetalSelector } from '@/components/spot-rules/MetalSelector';
import { StandardRulesTable } from '@/components/spot-rules/StandardRulesTable';
import { SpecialRulesTable } from '@/components/spot-rules/SpecialRulesTable';
import { RuleEditDialog } from '@/components/spot-rules/RuleEditDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SpotRule } from '@/types';
import { toast } from 'sonner';

export default function SpotRulesAnkaufPage() {
  const [selectedMetalId, setSelectedMetalId] = useState(1);
  const [editRule, setEditRule] = useState<SpotRule | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { data: allRules, isLoading: rulesLoading } = useApi(() => getAllSpotRules(), []);
  const { data: rates, isLoading: ratesLoading } = useApi(() => getLatestRates(), []);

  if (rulesLoading || ratesLoading) return <LoadingSpinner />;
  if (!allRules || !rates) return <p className="text-muted-foreground">Keine Daten</p>;

  const ankaufRules = allRules.filter(r => r.direction === 'ankauf' && r.metalId === selectedMetalId);
  const currentRate = rates.find(r => r.metalId === selectedMetalId);
  const spotPrice = currentRate?.rateEurPerGram ?? 0;

  const activeRule = ankaufRules.find(r => r.isActive && r.ruleType === 'standard');
  const currentSpot = activeRule?.calculatedValue ?? spotPrice;

  const metalNames: Record<number, string> = { 1: 'Gold', 2: 'Silber', 3: 'Platin', 4: 'Kupfer' };

  function handleEdit(rule: SpotRule) {
    setEditRule(rule);
    setEditOpen(true);
  }

  function handleDelete(rule: SpotRule) {
    toast.info(`Regel "${rule.dayName ?? rule.description}" würde gelöscht (Mock)`);
  }

  function handleSave(rule: SpotRule) {
    toast.success(`Regel "${rule.dayName ?? rule.description}" gespeichert (Mock)`);
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ankauf">
        <TabsList>
          <TabsTrigger value="verkauf" asChild>
            <Link href="/spot-rules/verkauf">Spotpreis und Regeln Verkauf</Link>
          </TabsTrigger>
          <TabsTrigger value="ankauf" asChild>
            <Link href="/spot-rules/ankauf">Spotpreis und Regeln Ankauf</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="text-sm text-muted-foreground">
        {metalNames[selectedMetalId]} Ankauf Spotpreis Aktuell:{' '}
        <span className="font-mono font-bold text-red-600">
          {currentSpot.toLocaleString('de-DE', { minimumFractionDigits: 4 })}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
        <MetalSelector
          selectedMetalId={selectedMetalId}
          onSelect={setSelectedMetalId}
          rules={allRules.filter(r => r.direction === 'ankauf')}
        />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Standardregeln Ankauf</CardTitle>
            </CardHeader>
            <CardContent>
              <StandardRulesTable rules={ankaufRules} onEdit={handleEdit} onDelete={handleDelete} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sonderregeln Ankauf</CardTitle>
            </CardHeader>
            <CardContent>
              <SpecialRulesTable rules={ankaufRules} onEdit={handleEdit} onDelete={handleDelete} />
            </CardContent>
          </Card>
        </div>
      </div>

      <RuleEditDialog
        rule={editRule}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
        spotPrice={spotPrice}
      />
    </div>
  );
}
