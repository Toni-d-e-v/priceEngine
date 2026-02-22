'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { getArticles } from '@/lib/api/endpoints/articles';
import { DataTable, type Column } from '@/components/master-data/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { ArticleForm } from '@/components/articles/ArticleForm';
import { SKUParser } from '@/components/articles/SKUParser';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Article } from '@/types';
import { toast } from 'sonner';

export default function ArticlesPage() {
  const [showNew, setShowNew] = useState(false);
  const { data: articles, isLoading } = useApi(() => getArticles(), []);

  if (isLoading) return <LoadingSpinner />;
  if (!articles) return <p className="text-muted-foreground">Keine Daten</p>;

  const columns: Column<Article>[] = [
    { key: 'id', header: 'ID' },
    { key: 'sku', header: 'SKU', render: (a) => <code className="text-xs">{a.sku}</code> },
    { key: 'name', header: 'Name' },
    { key: 'metalId', header: 'Metall', render: (a) => {
      const names: Record<number, string> = { 1: 'Gold', 2: 'Silber', 3: 'Platin', 4: 'Kupfer' };
      return names[a.metalId] ?? a.metalId;
    }},
    { key: 'weightGrams', header: 'Gewicht (g)', render: (a) => <span className="font-mono">{a.weightGrams}</span> },
    { key: 'faconCost', header: 'Facon', render: (a) => (
      <span className="font-mono text-sm">
        {a.faconCost.toLocaleString('de-DE', { minimumFractionDigits: 2 })} {a.faconType === 'absolute' ? '€' : '%'}
      </span>
    )},
    { key: 'taxType', header: 'Besteuerung', render: (a) => (
      <Badge variant={a.taxType === 'regelbesteuert' ? 'default' : 'secondary'}>
        {a.taxType === 'steuerfrei' ? 'Steuerfrei' : 'Regelb. 19%'}
      </Badge>
    )},
    { key: 'isActive', header: 'Status', render: (a) => (
      <Badge variant={a.isActive ? 'default' : 'secondary'} className={a.isActive ? 'bg-green-600' : ''}>
        {a.isActive ? 'Aktiv' : 'Inaktiv'}
      </Badge>
    )},
    { key: 'isInShop', header: 'Shop', render: (a) => (
      <Badge variant={a.isInShop ? 'default' : 'destructive'}>
        {a.isInShop ? 'Im Shop' : 'Nicht im Shop'}
      </Badge>
    )},
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SKU-Parser</CardTitle>
        </CardHeader>
        <CardContent>
          <SKUParser />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artikel-Stammdaten</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={articles}
            columns={columns}
            getKey={(a) => a.id}
            onAdd={() => setShowNew(true)}
            addLabel="Neuer Artikel"
            onEdit={(a) => toast.info(`Artikel "${a.name}" bearbeiten (Mock)`)}
            onDelete={(a) => toast.info(`Artikel "${a.name}" löschen (Mock)`)}
          />
        </CardContent>
      </Card>

      <Modal open={showNew} onOpenChange={setShowNew} title="Neuer Artikel" className="max-w-4xl">
        <ArticleForm onSave={() => setShowNew(false)} onCancel={() => setShowNew(false)} />
      </Modal>
    </div>
  );
}
