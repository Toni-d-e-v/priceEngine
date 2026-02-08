'use client';

import { useApi } from '@/hooks/useApi';
import { getCustomerGroups } from '@/lib/api/endpoints/customer-groups';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CustomerGroup } from '@/types';
import { toast } from 'sonner';

export default function CustomerGroupsPage() {
  const { data: groups, isLoading } = useApi(() => getCustomerGroups(), []);

  if (isLoading) return <LoadingSpinner />;
  if (!groups) return <p className="text-muted-foreground">Keine Daten</p>;

  const columns: Column<CustomerGroup>[] = [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Code', render: (g) => <Badge variant="outline">{g.code}</Badge> },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Beschreibung' },
    { key: 'discountPercent', header: 'Rabatt (%)', render: (g) => `${g.discountPercent}%` },
    { key: 'isActive', header: 'Status', render: (g) => (
      <Badge variant={g.isActive ? 'default' : 'secondary'} className={g.isActive ? 'bg-green-600' : ''}>
        {g.isActive ? 'Aktiv' : 'Inaktiv'}
      </Badge>
    )},
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundengruppen</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={groups}
          columns={columns}
          getKey={(g) => g.id}
          onAdd={() => toast.info('Neue Kundengruppe (Mock)')}
          addLabel="Neue Kundengruppe"
          onEdit={(g) => toast.info(`"${g.name}" bearbeiten (Mock)`)}
          onDelete={(g) => toast.info(`"${g.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
