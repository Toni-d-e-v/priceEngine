'use client';

import { useApi } from '@/hooks/useApi';
import { getHolidays } from '@/lib/api/endpoints/holidays';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Holiday } from '@/types';
import { toast } from 'sonner';

export default function HolidaysPage() {
  const { data: holidays, isLoading } = useApi(() => getHolidays(), []);

  if (isLoading) return <LoadingSpinner />;
  if (!holidays) return <p className="text-muted-foreground">Keine Daten</p>;

  const columns: Column<Holiday>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'holidayDate', header: 'Datum' },
    { key: 'description', header: 'Beschreibung' },
    { key: 'formula', header: 'Formel', render: (h) => h.formula ? <code className="text-xs">{h.formula}</code> : '—' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feiertage</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={holidays}
          columns={columns}
          getKey={(h) => h.id}
          onAdd={() => toast.info('Neuer Feiertag (Mock)')}
          addLabel="Neuer Feiertag"
          onEdit={(h) => toast.info(`"${h.name}" bearbeiten (Mock)`)}
          onDelete={(h) => toast.info(`"${h.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
