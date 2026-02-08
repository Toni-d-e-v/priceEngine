'use client';

import { cn } from '@/lib/utils';
import type { SpotRule } from '@/types';

const METALS = [
  { id: 1, name: 'GOLD' },
  { id: 2, name: 'SILVER' },
  { id: 3, name: 'PLATIN' },
  { id: 4, name: 'PALLADIUM' },
];

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

interface MetalSelectorProps {
  selectedMetalId: number;
  onSelect: (metalId: number) => void;
  rules: SpotRule[];
}

export function MetalSelector({ selectedMetalId, onSelect, rules }: MetalSelectorProps) {
  return (
    <div className="space-y-1">
      {METALS.map(metal => {
        const activeRule = rules.find(r => r.metalId === metal.id && r.isActive && r.ruleType === 'standard');
        const isSelected = selectedMetalId === metal.id;

        return (
          <button
            key={metal.id}
            onClick={() => onSelect(metal.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors',
              isSelected
                ? 'bg-teal-700 text-white'
                : 'bg-white hover:bg-gray-50 border'
            )}
          >
            <span className="font-medium">{metal.name}</span>
            {activeRule && (
              <span className="font-mono text-xs">
                {formatEuro(activeRule.calculatedValue)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
