'use client';

import { mockRoles } from '@/lib/api/mock-data';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Role } from '@/types';
import { toast } from 'sonner';

export default function RolesPage() {
  const columns: Column<Role>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name', render: (r) => <Badge variant="outline">{r.name}</Badge> },
    { key: 'description', header: 'Beschreibung' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rollen</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={mockRoles}
          columns={columns}
          getKey={(r) => r.id}
          onAdd={() => toast.info('Neue Rolle (Mock)')}
          addLabel="Neue Rolle"
          onEdit={(r) => toast.info(`"${r.name}" bearbeiten (Mock)`)}
          onDelete={(r) => toast.info(`"${r.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
