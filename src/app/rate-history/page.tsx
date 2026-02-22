'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { getRateHistory } from '@/lib/api/endpoints/rate-history';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

export default function RateHistoryPage() {
  const { data: history, isLoading } = useApi(() => getRateHistory(), []);
  const [metalFilter, setMetalFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (!history) return <p className="text-muted-foreground">Keine Daten</p>;

  let filtered = history;

  if (metalFilter !== 'all') {
    filtered = filtered.filter(r => r.metalId === parseInt(metalFilter));
  }
  if (sourceFilter === 'manuell') {
    filtered = filtered.filter(r => r.isManual);
  } else if (sourceFilter === 'automatisch') {
    filtered = filtered.filter(r => !r.isManual);
  }
  if (dateFrom) {
    filtered = filtered.filter(r => r.rateDate >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter(r => r.rateDate <= dateTo);
  }

  // Sortierung: neueste zuerst
  filtered = [...filtered].sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt));

  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Kurshistorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Metall</Label>
              <Select value={metalFilter} onValueChange={setMetalFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Metalle</SelectItem>
                  <SelectItem value="1">Gold</SelectItem>
                  <SelectItem value="2">Silber</SelectItem>
                  <SelectItem value="3">Platin</SelectItem>
                  <SelectItem value="4">Kupfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quelle</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Quellen</SelectItem>
                  <SelectItem value="automatisch">Automatisch</SelectItem>
                  <SelectItem value="manuell">Manuell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Von</Label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bis</Label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {filtered.length} von {history.length} Einträgen
          </p>
        </CardContent>
      </Card>

      {/* Tabelle */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zeitstempel</TableHead>
                <TableHead>Metall</TableHead>
                <TableHead className="text-right">USD / Gramm</TableHead>
                <TableHead className="text-right">EUR / Gramm</TableHead>
                <TableHead>Kursdatum</TableHead>
                <TableHead>Quelle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(rate => (
                <TableRow key={rate.id}>
                  <TableCell className="text-sm">
                    {new Date(rate.fetchedAt).toLocaleString('de-DE')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{METAL_NAMES[rate.metalId] ?? rate.metalId}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatNumber(rate.rateUsdPerGram)}</TableCell>
                  <TableCell className="text-right font-mono">{formatNumber(rate.rateEurPerGram)}</TableCell>
                  <TableCell className="text-sm">{new Date(rate.rateDate).toLocaleDateString('de-DE')}</TableCell>
                  <TableCell>
                    <Badge variant={rate.isManual ? 'destructive' : 'default'} className={rate.isManual ? '' : 'bg-green-600'}>
                      {rate.isManual ? 'Manuell' : 'Automatisch'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Keine Einträge gefunden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
