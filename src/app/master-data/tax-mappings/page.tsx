'use client';

import { useApi } from '@/hooks/useApi';
import { getTaxMappings } from '@/lib/api/endpoints/tax-mappings';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TaxMapping } from '@/types';
import { toast } from 'sonner';

export default function TaxMappingsPage() {
  const { data: mappings, isLoading } = useApi(() => getTaxMappings(), []);

  if (isLoading) return <LoadingSpinner />;
  if (!mappings) return <p className="text-muted-foreground">Keine Daten</p>;

  const columns: Column<TaxMapping>[] = [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    { key: 'rate', header: 'Steuersatz (%)', render: (m) => `${m.rate}%` },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Steuerzuordnung</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={mappings}
          columns={columns}
          getKey={(m) => m.id}
          onAdd={() => toast.info('Neue Steuerzuordnung (Mock)')}
          addLabel="Neue Steuerzuordnung"
          onEdit={(m) => toast.info(`"${m.name}" bearbeiten (Mock)`)}
          onDelete={(m) => toast.info(`"${m.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
