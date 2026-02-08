'use client';

import { SUPPLIER_CODES } from '@/lib/sku/constants';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SupplierRow {
  code: string;
  name: string;
}

export default function SuppliersPage() {
  const columns: Column<SupplierRow>[] = [
    { key: 'code', header: 'Code', render: (s) => <Badge variant="outline" className="font-mono">{s.code}</Badge> },
    { key: 'name', header: 'Name' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lieferanten</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={SUPPLIER_CODES}
          columns={columns}
          getKey={(s) => s.code}
          onAdd={() => toast.info('Neuer Lieferant (Mock)')}
          addLabel="Neuer Lieferant"
          onEdit={(s) => toast.info(`"${s.name}" bearbeiten (Mock)`)}
          onDelete={(s) => toast.info(`"${s.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
