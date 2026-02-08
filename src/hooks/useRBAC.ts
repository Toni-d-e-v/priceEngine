'use client';

import { useAuth } from './useAuth';
import type { Permission, Role } from '@/types';

export function useRBAC() {
  const { hasPermission, hasRole, user } = useAuth();

  const isAdmin = hasRole('Admin');
  const isPriceEditor = hasRole('PriceEditor') || isAdmin;
  const isViewer = hasRole('Viewer') || isPriceEditor;

  return {
    user,
    isAdmin,
    isPriceEditor,
    isViewer,
    hasPermission,
    hasRole,
    can: (permission: Permission) => hasPermission(permission),
    canAny: (...permissions: Permission[]) => permissions.some(p => hasPermission(p)),
    canAll: (...permissions: Permission[]) => permissions.every(p => hasPermission(p)),
  };
}
