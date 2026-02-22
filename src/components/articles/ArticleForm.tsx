'use client';

import { useState, useCallback } from 'react';
import type { SKUComponents } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SKUBuilder } from './SKUBuilder';
import { buildArticleDescription } from '@/lib/sku/builder';
import { toast } from 'sonner';

interface ArticleFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export function ArticleForm({ onSave, onCancel }: ArticleFormProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [weightGrams, setWeightGrams] = useState(0);
  const [priceType, setPriceType] = useState<'verkauf' | 'ankauf'>('verkauf');
  const [faconCost, setFaconCost] = useState(0);
  const [faconType, setFaconType] = useState<'absolute' | 'percentage'>('absolute');
  const [taxType, setTaxType] = useState<'steuerfrei' | 'regelbesteuert'>('steuerfrei');
  const [isActive, setIsActive] = useState(true);
  const [isInShop, setIsInShop] = useState(false);

  const handleSKUChange = useCallback((components: SKUComponents, newSku: string, grams: number) => {
    setSku(newSku);
    setWeightGrams(grams);
    const description = buildArticleDescription(components);
    setName(description);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success(`Artikel "${name}" gespeichert (Mock)`);
    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SKUBuilder onChange={handleSKUChange} />

      <div className="space-y-2">
        <Label>Artikelname</Label>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Gewicht (Gramm)</Label>
          <Input value={weightGrams} readOnly className="font-mono bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>Preis-Typ</Label>
          <Select value={priceType} onValueChange={v => setPriceType(v as 'verkauf' | 'ankauf')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="verkauf">Verkauf</SelectItem>
              <SelectItem value="ankauf">Ankauf</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Faconkosten</Label>
          <Input type="number" step="0.01" value={faconCost} onChange={e => setFaconCost(parseFloat(e.target.value) || 0)} className="font-mono" />
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

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label>Aktiv</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={isInShop} onCheckedChange={setIsInShop} />
          <Label>Im Shop aktiv</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Speichern</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Abbrechen</Button>
      </div>
    </form>
  );
}
