'use client';

import { useState } from 'react';
import type { Article, ArticlePrice, CustomerGroup } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormulaEditor } from '@/components/common/FormulaEditor';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

const OZ_CONVERSIONS = [
  { label: '1/4U', grams: 7.7758692 },
  { label: '1/3U', grams: 10.3678256 },
  { label: '1/2U', grams: 15.5517384 },
  { label: '1U', grams: 31.1034768 },
  { label: '2U', grams: 62.2069536 },
  { label: '3U', grams: 93.3104304 },
  { label: '4U', grams: 124.4139072 },
];

interface ProductDetailFormProps {
  article: Article;
  price: ArticlePrice;
  customerGroup: CustomerGroup;
  spotPrice: number;
}

export function ProductDetailForm({ article, price, customerGroup, spotPrice }: ProductDetailFormProps) {
  const [formula, setFormula] = useState(price.formula);
  const [weight, setWeight] = useState(String(article.weightGrams));
  const [faconCost, setFaconCost] = useState(article.faconCost);
  const [faconType, setFaconType] = useState(article.faconType);
  const [taxType, setTaxType] = useState(article.taxType);

  function handleSave() {
    toast.success('Preis gespeichert (Mock)');
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{article.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input value={`${article.sku} (Id: ${article.id})`} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Kundengruppe</Label>
              <Input value={`[${customerGroup.code}] ${customerGroup.name.toUpperCase()}`} readOnly className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Einheit</Label>
              <Input value="Gram" readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Preis-Typ</Label>
              <Input value={article.priceType === 'verkauf' ? 'Verkauf' : 'Ankauf'} readOnly className="bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gewicht (Gramms)</Label>
            <div className="flex gap-2">
              <Input
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="font-mono"
              />
              <div className="flex gap-1">
                {OZ_CONVERSIONS.map(conv => (
                  <Button
                    key={conv.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setWeight(String(conv.grams))}
                    className="text-xs"
                  >
                    {conv.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Faconkosten</Label>
              <Input
                type="number"
                step="0.01"
                value={faconCost}
                onChange={e => setFaconCost(parseFloat(e.target.value) || 0)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Facon-Typ</Label>
              <Select value={faconType} onValueChange={v => setFaconType(v as 'absolute' | 'percentage')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="absolute">Absolut (EUR)</SelectItem>
                  <SelectItem value="percentage">Prozentual (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Besteuerung</Label>
              <Select value={taxType} onValueChange={v => setTaxType(v as 'steuerfrei' | 'regelbesteuert')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="steuerfrei">Steuerfrei</SelectItem>
                  <SelectItem value="regelbesteuert">Regelbesteuert (19%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <FormulaEditor
            value={formula}
            onChange={setFormula}
            spotPrice={spotPrice}
            weight={parseFloat(weight) || 0}
          />

          <div className="space-y-2">
            <Label>Land</Label>
            <Input value={article.country} readOnly className="bg-muted" />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>Speichern</Button>
            <Button variant="outline">Abbrechen</Button>
          </div>
        </CardContent>
      </Card>

      {/* Unzen-Referenz */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Unzen-Umrechnung</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Einheit</TableHead>
                <TableHead>Gramm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OZ_CONVERSIONS.map(conv => (
                <TableRow key={conv.label}>
                  <TableCell>{conv.label.replace('U', ' Unze(n)')}</TableCell>
                  <TableCell className="font-mono">{conv.grams} Grams</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
