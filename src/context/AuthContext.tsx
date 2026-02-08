'use client';

import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { User, Role, Permission } from '@/types';
import { mockUsers } from '@/lib/api/mock-data';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roleName: Role['name']) => boolean;
}

const ROLE_PERMISSIONS: Record<Role['name'], Permission[]> = {
  Admin: [
    'view_dashboard', 'fetch_rates', 'adjust_rates', 'view_calculations',
    'edit_prices', 'recalculate', 'publish_prices', 'manage_formulas',
    'view_holidays', 'manage_holidays', 'manage_customer_groups',
    'manage_articles', 'manage_users', 'manage_roles',
  ],
  PriceEditor: [
    'view_dashboard', 'fetch_rates', 'adjust_rates', 'view_calculations',
    'edit_prices', 'recalculate', 'publish_prices', 'manage_formulas',
    'view_holidays', 'manage_holidays', 'manage_customer_groups',
    'manage_articles',
  ],
  Viewer: [
    'view_dashboard', 'view_calculations', 'view_holidays',
  ],
};

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, _password: string): Promise<boolean> => {
    // Mock-Login: Akzeptiert admin/admin, editor/editor, viewer/viewer
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockUser = mockUsers.find(u => u.username === username);
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', `mock-jwt-${mockUser.id}-${Date.now()}`);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  const hasRole = useCallback((roleName: Role['name']): boolean => {
    if (!user) return false;
    return user.roles.some(r => r.name === roleName);
  }, [user]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false;
    return user.roles.some(role => {
      const perms = ROLE_PERMISSIONS[role.name];
      return perms?.includes(permission);
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
