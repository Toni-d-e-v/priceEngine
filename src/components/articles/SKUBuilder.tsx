'use client';

import { useState, useEffect } from 'react';
import type { SKUComponents } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MATERIAL_CODES,
  PRODUCT_CODES,
  TAX_CODES,
  MANUFACTURER_CODES,
  QUANTITY_CODES,
  WEIGHT_CODES,
  SUPPLIER_CODES,
} from '@/lib/sku/constants';
import { buildSKU, getWeightFromCode } from '@/lib/sku/builder';
import { validateSKUComponents } from '@/lib/sku/validator';

interface SKUBuilderProps {
  value?: SKUComponents;
  onChange: (components: SKUComponents, sku: string, weightGrams: number) => void;
}

const DEFAULT_COMPONENTS: SKUComponents = {
  material: 'Au',
  product: 'PB',
  taxType: 'o',
  manufacturer: 'J0001',
  quantity: 'S0001',
  weight: 'G70001',
  supplier: 'HM',
};

export function SKUBuilder({ value, onChange }: SKUBuilderProps) {
  const [components, setComponents] = useState<SKUComponents>(value ?? DEFAULT_COMPONENTS);

  useEffect(() => {
    const sku = buildSKU(components);
    const weightGrams = getWeightFromCode(components.weight) ?? 0;
    onChange(components, sku, weightGrams);
  }, [components, onChange]);

  function update(field: keyof SKUComponents, val: string) {
    setComponents(prev => ({ ...prev, [field]: val }));
  }

  const sku = buildSKU(components);
  const validation = validateSKUComponents(components);
  const weightGrams = getWeightFromCode(components.weight);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Material</Label>
          <Select value={components.material} onValueChange={v => update('material', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MATERIAL_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} – {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Produkt</Label>
          <Select value={components.product} onValueChange={v => update('product', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRODUCT_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} – {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Besteuerung</Label>
          <Select value={components.taxType} onValueChange={v => update('taxType', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TAX_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} – {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Hersteller</Label>
          <Select value={components.manufacturer} onValueChange={v => update('manufacturer', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MANUFACTURER_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} – {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Stückzahl</Label>
          <Select value={components.quantity} onValueChange={v => update('quantity', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {QUANTITY_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} – {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Grammatur</Label>
          <Select value={components.weight} onValueChange={v => update('weight', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {WEIGHT_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} – {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Lieferant</Label>
          <Select value={components.supplier} onValueChange={v => update('supplier', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SUPPLIER_CODES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} – {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SKU Preview */}
      <div className="rounded-md border bg-muted p-3">
        <Label className="text-xs text-muted-foreground">Generierte SKU</Label>
        <div className="mt-1 flex items-center gap-2">
          <Input value={sku} readOnly className="font-mono font-bold bg-white" />
          {validation.valid ? (
            <Badge className="bg-green-600">Gültig</Badge>
          ) : (
            <Badge variant="destructive">Ungültig</Badge>
          )}
        </div>
        {weightGrams !== null && (
          <p className="mt-1 text-xs text-muted-foreground">
            Gewicht: {weightGrams} Gramm
          </p>
        )}
        {!validation.valid && validation.errors.map((err, i) => (
          <p key={i} className="mt-1 text-xs text-red-500">{err}</p>
        ))}
      </div>
    </div>
  );
}
