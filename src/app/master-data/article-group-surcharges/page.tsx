'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { getArticleGroups, getArticleGroupSurcharges } from '@/lib/api/endpoints/article-groups';
import { getCustomerGroups } from '@/lib/api/endpoints/customer-groups';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

export default function ArticleGroupSurchargesPage() {
  const { data: articleGroups, isLoading: agLoading } = useApi(() => getArticleGroups(), []);
  const { data: customerGroups, isLoading: cgLoading } = useApi(() => getCustomerGroups(), []);
  const { data: surcharges, isLoading: sLoading } = useApi(() => getArticleGroupSurcharges(), []);

  const [overrides, setOverrides] = useState<Record<string, number>>({});

  if (agLoading || cgLoading || sLoading) return <LoadingSpinner />;
  if (!articleGroups || !customerGroups || !surcharges) return <p className="text-muted-foreground">Keine Daten</p>;

  // Nur VK-Gruppen (Ankauf hat keine Zuschläge)
  const vkGroups = customerGroups.filter(g => g.direction === 'verkauf');

  function getSurcharge(articleGroupId: number, customerGroupId: number): number {
    const key = `${articleGroupId}-${customerGroupId}`;
    if (overrides[key] !== undefined) return overrides[key];
    const found = surcharges?.find(s => s.articleGroupId === articleGroupId && s.customerGroupId === customerGroupId);
    return found?.surchargePercent ?? 0;
  }

  function handleChange(articleGroupId: number, customerGroupId: number, value: string) {
    const key = `${articleGroupId}-${customerGroupId}`;
    const num = parseFloat(value) || 0;
    setOverrides(prev => ({ ...prev, [key]: num }));
    const ag = articleGroups?.find(g => g.id === articleGroupId);
    const cg = customerGroups?.find(g => g.id === customerGroupId);
    toast.success(`Zuschlag ${ag?.name} × ${cg?.name} → ${num}% (Mock)`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artikelgruppen × Preisgruppen Zuschläge</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Zuschläge in Prozent (%) pro Artikelgruppe und Verkaufs-Preisgruppe.
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Artikelgruppe</TableHead>
                {vkGroups.map(cg => (
                  <TableHead key={cg.id} className="text-center min-w-[120px]">
                    <div className="space-y-1">
                      <Badge variant="outline">{cg.code}</Badge>
                      <p className="text-xs font-normal">{cg.name}</p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {articleGroups.map(ag => (
                <TableRow key={ag.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{ag.code}</Badge>
                      <span>{ag.name}</span>
                    </div>
                  </TableCell>
                  {vkGroups.map(cg => {
                    const val = getSurcharge(ag.id, cg.id);
                    return (
                      <TableCell key={cg.id} className="text-center">
                        <Input
                          type="number"
                          step="0.1"
                          value={val}
                          onChange={e => handleChange(ag.id, cg.id, e.target.value)}
                          className="h-8 w-20 text-center font-mono text-sm mx-auto"
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
