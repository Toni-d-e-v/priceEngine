'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseSKU, formatSKUComponents } from '@/lib/sku/parser';
import { validateSKU } from '@/lib/sku/validator';

interface SKUParserProps {
  onParsed?: (sku: string) => void;
}

export function SKUParser({ onParsed }: SKUParserProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  function handleParse() {
    const validation = validateSKU(input);
    setIsValid(validation.valid);

    if (validation.valid && validation.components) {
      setResult(formatSKUComponents(validation.components));
      onParsed?.(input);
    } else {
      setResult(validation.errors.join('\n'));
    }
  }

  return (
    <div className="space-y-3">
      <Label>SKU eingeben (zum Parsen)</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="z.B. Au-CBo-J0001-S0100-G00001-HM"
          className="font-mono"
        />
        <Button onClick={handleParse} variant="outline">Parsen</Button>
      </div>
      {result && (
        <div className="rounded-md border p-3">
          <div className="mb-2">
            {isValid ? (
              <Badge className="bg-green-600">Gültige SKU</Badge>
            ) : (
              <Badge variant="destructive">Ungültige SKU</Badge>
            )}
          </div>
          <pre className="text-xs whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
