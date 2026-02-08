'use client';

import { useState } from 'react';
import type { SpotRule } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormulaEditor } from '@/components/common/FormulaEditor';

interface RuleEditDialogProps {
  rule: SpotRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: SpotRule) => void;
  spotPrice: number;
}

export function RuleEditDialog({ rule, open, onOpenChange, onSave, spotPrice }: RuleEditDialogProps) {
  const [formula, setFormula] = useState(rule?.formula ?? '');
  const [timeFrom, setTimeFrom] = useState(rule?.timeFrom ?? '00:00');
  const [timeTo, setTimeTo] = useState(rule?.timeTo ?? '23:59');
  const [isActive, setIsActive] = useState(rule?.isActive ?? false);

  // Reset when rule changes
  if (rule && formula !== rule.formula && !open) {
    setFormula(rule.formula);
    setTimeFrom(rule.timeFrom);
    setTimeTo(rule.timeTo);
    setIsActive(rule.isActive);
  }

  function handleSave() {
    if (!rule) return;
    onSave({ ...rule, formula, timeFrom, timeTo, isActive });
    onOpenChange(false);
  }

  const title = rule?.ruleType === 'standard'
    ? `Regel bearbeiten: ${rule.dayName}`
    : `Sonderregel bearbeiten: ${rule?.description ?? ''}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Von</Label>
              <Input type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bis</Label>
              <Input type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)} />
            </div>
          </div>
          <FormulaEditor value={formula} onChange={setFormula} spotPrice={spotPrice} />
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Aktiv</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
