'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockLogs = [
  { id: 1, timestamp: '2025-11-06 11:01:54', action: 'Kurse abgerufen', user: 'system', level: 'info' },
  { id: 2, timestamp: '2025-11-06 10:00:00', action: 'Tagesregel aktiviert: Donnerstag', user: 'system', level: 'info' },
  { id: 3, timestamp: '2025-11-06 09:30:12', action: 'Login: admin', user: 'admin', level: 'info' },
  { id: 4, timestamp: '2025-11-05 18:00:00', action: 'Preise publiziert (42 Artikel)', user: 'editor', level: 'success' },
  { id: 5, timestamp: '2025-11-05 17:45:00', action: 'Formel geändert: Standard Verkauf Kunde', user: 'editor', level: 'warning' },
];

export default function LogsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Platzhalter – In Phase 1+ werden hier echte System-Logs angezeigt.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Zeitstempel</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Benutzer</TableHead>
              <TableHead>Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <Badge
                    variant={log.level === 'warning' ? 'destructive' : 'secondary'}
                    className={log.level === 'success' ? 'bg-green-600 text-white' : ''}
                  >
                    {log.level}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
