'use client';

import { mockUsers } from '@/lib/api/mock-data';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';
import { toast } from 'sonner';

export default function UsersPage() {
  const columns: Column<User>[] = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: 'Benutzername' },
    { key: 'email', header: 'E-Mail' },
    { key: 'firstName', header: 'Vorname' },
    { key: 'lastName', header: 'Nachname' },
    { key: 'roles', header: 'Rollen', render: (u) => (
      <div className="flex gap-1">
        {u.roles.map(r => <Badge key={r.id} variant="secondary">{r.name}</Badge>)}
      </div>
    )},
    { key: 'isActive', header: 'Status', render: (u) => (
      <Badge variant={u.isActive ? 'default' : 'secondary'} className={u.isActive ? 'bg-green-600' : ''}>
        {u.isActive ? 'Aktiv' : 'Inaktiv'}
      </Badge>
    )},
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benutzer</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={mockUsers}
          columns={columns}
          getKey={(u) => u.id}
          onAdd={() => toast.info('Neuer Benutzer (Mock)')}
          addLabel="Neuer Benutzer"
          onEdit={(u) => toast.info(`"${u.username}" bearbeiten (Mock)`)}
          onDelete={(u) => toast.info(`"${u.username}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
