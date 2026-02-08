'use client';

import { MANUFACTURER_CODES } from '@/lib/sku/constants';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ManufacturerRow {
  code: string;
  name: string;
}

export default function ManufacturersPage() {
  const columns: Column<ManufacturerRow>[] = [
    { key: 'code', header: 'Code', render: (m) => <Badge variant="outline" className="font-mono">{m.code}</Badge> },
    { key: 'name', header: 'Name' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hersteller</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={MANUFACTURER_CODES}
          columns={columns}
          getKey={(m) => m.code}
          onAdd={() => toast.info('Neuer Hersteller (Mock)')}
          addLabel="Neuer Hersteller"
          onEdit={(m) => toast.info(`"${m.name}" bearbeiten (Mock)`)}
          onDelete={(m) => toast.info(`"${m.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
