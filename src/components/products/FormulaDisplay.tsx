'use client';

import { Badge } from '@/components/ui/badge';

interface FormulaDisplayProps {
  formula: string;
}

export function FormulaDisplay({ formula }: FormulaDisplayProps) {
  return (
    <Badge variant="outline" className="font-mono text-xs">
      {formula}
    </Badge>
  );
}
