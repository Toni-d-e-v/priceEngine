'use client';

import { useContext } from 'react';
import { AuthContext, type AuthState } from '@/context/AuthContext';

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
}
