'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function ConfiguratorPage() {
  function handleSave() {
    toast.info('Konfiguration wird in Phase 1+ implementiert');
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Konfigurator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Platzhalter – In Phase 1+ werden hier die System-Einstellungen verwaltet.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Kurs-Provider</Label>
              <Select defaultValue="boerse-online">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="boerse-online">Börse Online</SelectItem>
                  <SelectItem value="metals-api">metals-api.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Aktualisierungsintervall (Sekunden)</Label>
              <Input type="number" defaultValue="300" />
            </div>

            <div className="space-y-2">
              <Label>Max. Alter für gültige Preise (Sekunden)</Label>
              <Input type="number" defaultValue="650000" />
            </div>

            <div className="space-y-2">
              <Label>Standard-Währung</Label>
              <Select defaultValue="EUR">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <Label>Automatische Kursabfrage aktiv</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch />
              <Label>E-Mail-Benachrichtigung bei Kursänderung</Label>
            </div>
          </div>

          <Button onClick={handleSave} disabled>Speichern</Button>
        </CardContent>
      </Card>
    </div>
  );
}
