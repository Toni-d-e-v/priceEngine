'use client';

import { mockUsers, mockRoles } from '@/lib/api/mock-data';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function UserRolesPage() {
  function handleToggle(username: string, roleName: string) {
    toast.info(`Rolle "${roleName}" für "${username}" umgeschaltet (Mock)`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benutzer-Rollen-Zuweisung</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Benutzer</TableHead>
              {mockRoles.map(role => (
                <TableHead key={role.id} className="text-center">{role.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({user.username})</span>
                  </div>
                </TableCell>
                {mockRoles.map(role => {
                  const hasRole = user.roles.some(r => r.id === role.id);
                  return (
                    <TableCell key={role.id} className="text-center">
                      <Checkbox
                        checked={hasRole}
                        onCheckedChange={() => handleToggle(user.username, role.name)}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
