'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { validateFormula, evaluateFormula, extractVariables } from '@/lib/formula/evaluator';

interface FormulaEditorProps {
  value: string;
  onChange: (value: string) => void;
  spotPrice?: number;
  weight?: number;
  label?: string;
}

export function FormulaEditor({
  value,
  onChange,
  spotPrice = 113.4101,
  weight = 1,
  label = 'Formel',
}: FormulaEditorProps) {
  const [focused, setFocused] = useState(false);

  const validation = validateFormula(value);
  const variables = extractVariables(value);
  const preview = validation.valid
    ? evaluateFormula(value, { $spot: spotPrice, $weight: weight })
    : null;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={!validation.valid && value.length > 0 ? 'border-red-500' : ''}
        placeholder="z.B. ($spot*$weight+53.95)*1.045"
      />
      {focused && (
        <div className="space-y-1 text-xs">
          <div className="flex gap-1">
            {variables.map(v => (
              <Badge key={v} variant="secondary" className="text-xs">
                {v}
              </Badge>
            ))}
          </div>
          {!validation.valid && value.length > 0 && (
            <p className="text-red-500">{validation.error}</p>
          )}
          {preview !== null && (
            <p className="text-muted-foreground">
              Vorschau: {preview.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
