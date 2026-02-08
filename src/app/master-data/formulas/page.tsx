'use client';

import { useApi } from '@/hooks/useApi';
import { getFormulas } from '@/lib/api/endpoints/formulas';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Formula } from '@/types';
import { toast } from 'sonner';

export default function FormulasPage() {
  const { data: formulas, isLoading } = useApi(() => getFormulas(), []);

  if (isLoading) return <LoadingSpinner />;
  if (!formulas) return <p className="text-muted-foreground">Keine Daten</p>;

  const columns: Column<Formula>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'expression', header: 'Formel', render: (f) => <code className="text-xs">{f.expression}</code> },
    { key: 'variables', header: 'Variablen', render: (f) => (
      <div className="flex gap-1">
        {f.variables.map(v => <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>)}
      </div>
    )},
    { key: 'isActive', header: 'Status', render: (f) => (
      <Badge variant={f.isActive ? 'default' : 'secondary'} className={f.isActive ? 'bg-green-600' : ''}>
        {f.isActive ? 'Aktiv' : 'Inaktiv'}
      </Badge>
    )},
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formeln</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={formulas}
          columns={columns}
          getKey={(f) => f.id}
          onAdd={() => toast.info('Neue Formel (Mock)')}
          addLabel="Neue Formel"
          onEdit={(f) => toast.info(`"${f.name}" bearbeiten (Mock)`)}
          onDelete={(f) => toast.info(`"${f.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
