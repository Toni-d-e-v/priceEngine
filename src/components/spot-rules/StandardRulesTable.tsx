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
import { cn } from '@/lib/utils';

function formatNumber(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

interface StandardRulesTableProps {
  rules: SpotRule[];
  onEdit: (rule: SpotRule) => void;
  onDelete: (rule: SpotRule) => void;
}

export function StandardRulesTable({ rules, onEdit, onDelete }: StandardRulesTableProps) {
  const standardRules = rules
    .filter(r => r.ruleType === 'standard')
    .sort((a, b) => (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0));

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Standardregeln</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tag</TableHead>
            <TableHead>Von</TableHead>
            <TableHead>Bis</TableHead>
            <TableHead>Aktiv</TableHead>
            <TableHead>Formel</TableHead>
            <TableHead className="text-right">Wert</TableHead>
            <TableHead className="text-right">Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standardRules.map(rule => (
            <TableRow
              key={rule.id}
              className={cn(rule.isActive && 'bg-green-50')}
            >
              <TableCell className={cn('font-medium', rule.isActive && 'font-bold')}>
                {rule.dayName}
              </TableCell>
              <TableCell>{rule.timeFrom}</TableCell>
              <TableCell>{rule.timeTo}</TableCell>
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
