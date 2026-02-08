'use client';

import type { SpotRule } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

function formatNumber(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

interface SpecialRulesTableProps {
  rules: SpotRule[];
  onEdit: (rule: SpotRule) => void;
  onDelete: (rule: SpotRule) => void;
}

export function SpecialRulesTable({ rules, onEdit, onDelete }: SpecialRulesTableProps) {
  const specialRules = rules
    .filter(r => r.ruleType === 'special')
    .sort((a, b) => (a.specialDate ?? '').localeCompare(b.specialDate ?? ''));

  if (specialRules.length === 0) {
    return (
      <div>
        <h3 className="mb-2 text-sm font-semibold">Sonderregeln</h3>
        <p className="text-sm text-muted-foreground">Keine Sonderregeln vorhanden</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Sonderregeln</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Von</TableHead>
            <TableHead>Bis</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead>Aktiv</TableHead>
            <TableHead>Formel</TableHead>
            <TableHead className="text-right">Wert</TableHead>
            <TableHead className="text-right">Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialRules.map(rule => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.specialDate}</TableCell>
              <TableCell>{rule.timeFrom}</TableCell>
              <TableCell>{rule.timeTo}</TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell>
                <Badge variant={rule.isActive ? 'default' : 'secondary'} className={rule.isActive ? 'bg-green-600' : ''}>
                  {rule.isActive ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{rule.formula}</TableCell>
              <TableCell className="text-right font-mono">{formatNumber(rule.calculatedValue)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(rule)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
