'use client';

import { useApi } from '@/hooks/useApi';
import { getArticleGroups } from '@/lib/api/endpoints/article-groups';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ArticleGroup } from '@/types';
import { toast } from 'sonner';

export default function ArticleGroupsPage() {
  const { data: groups, isLoading } = useApi(() => getArticleGroups(), []);

  if (isLoading) return <LoadingSpinner />;
  if (!groups) return <p className="text-muted-foreground">Keine Daten</p>;

  const columns: Column<ArticleGroup>[] = [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Code', render: (g) => <Badge variant="outline" className="font-mono">{g.code}</Badge> },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Beschreibung' },
    { key: 'isActive', header: 'Status', render: (g) => (
      <Badge variant={g.isActive ? 'default' : 'secondary'} className={g.isActive ? 'bg-green-600' : ''}>
        {g.isActive ? 'Aktiv' : 'Inaktiv'}
      </Badge>
    )},
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artikelgruppen</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={groups}
          columns={columns}
          getKey={(g) => g.id}
          onAdd={() => toast.info('Neue Artikelgruppe (Mock)')}
          addLabel="Neue Artikelgruppe"
          onEdit={(g) => toast.info(`"${g.name}" bearbeiten (Mock)`)}
          onDelete={(g) => toast.info(`"${g.name}" löschen (Mock)`)}
        />
      </CardContent>
    </Card>
  );
}
