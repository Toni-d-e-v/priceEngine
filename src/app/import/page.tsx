'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportPage() {
  function handleImport() {
    toast.info('Import-Funktion wird in Phase 1+ implementiert');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aus PrestaShop Importieren</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Platzhalter – In Phase 1+ können hier Artikel und Preise aus PrestaShop importiert werden.
        </p>

        <div className="space-y-4 rounded-md border border-dashed p-6">
          <div className="space-y-2">
            <Label>CSV-Datei auswählen</Label>
            <Input type="file" accept=".csv,.xlsx" />
          </div>
          <Button onClick={handleImport} disabled>
            <Upload className="mr-2 h-4 w-4" />
            Import starten
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
