'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { useApi } from '@/hooks/useApi';
import { getAllSpotRules } from '@/lib/api/endpoints/spot-rules';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Upload,
  Settings,
  FileText,
  Users,
  BookOpen,
  Package,
  Factory,
  Truck,
  Calendar,
  Shield,
  UserCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import type { SpotRule } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNav: NavItem[] = [
  { label: 'Aktuelle Online Preise', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Spotpreis Verkauf', href: '/spot-rules/verkauf', icon: <TrendingUp className="h-4 w-4" /> },
  { label: 'Spotpreis Ankauf', href: '/spot-rules/ankauf', icon: <TrendingDown className="h-4 w-4 text-red-400" /> },
  { label: 'Produktpreise', href: '/products', icon: <ShoppingCart className="h-4 w-4" /> },
  { label: 'Aus PS Importieren', href: '/import', icon: <Upload className="h-4 w-4" /> },
  { label: 'Konfigurator', href: '/configurator', icon: <Settings className="h-4 w-4" /> },
  { label: 'Logs', href: '/logs', icon: <FileText className="h-4 w-4" /> },
];

const masterDataNav: NavItem[] = [
  { label: 'Kundengruppen', href: '/master-data/customer-groups', icon: <Users className="h-4 w-4" /> },
  { label: 'Formeln', href: '/master-data/formulas', icon: <BookOpen className="h-4 w-4" /> },
  { label: 'Artikel', href: '/master-data/articles', icon: <Package className="h-4 w-4" /> },
  { label: 'Hersteller', href: '/master-data/manufacturers', icon: <Factory className="h-4 w-4" /> },
  { label: 'Lieferanten', href: '/master-data/suppliers', icon: <Truck className="h-4 w-4" /> },
  { label: 'Feiertage', href: '/holidays', icon: <Calendar className="h-4 w-4" /> },
  { label: 'Rollen', href: '/master-data/roles', icon: <Shield className="h-4 w-4" /> },
  { label: 'Benutzer', href: '/master-data/users', icon: <Users className="h-4 w-4" /> },
  { label: 'Benutzer-Rollen', href: '/master-data/user-roles', icon: <UserCheck className="h-4 w-4" /> },
];

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function SpotInfoSection({ rules }: { rules: SpotRule[] | null }) {
  if (!rules) return null;

  const metalNames: Record<number, string> = { 1: 'GOLD', 2: 'SILVER', 3: 'PLATIN', 4: 'PALLADIUM' };
  const directions = ['verkauf', 'ankauf'] as const;
  const dirLabels = { verkauf: 'VKF.', ankauf: 'ANK.' };

  const activeRules = rules.filter(r => r.isActive && r.ruleType === 'standard');

  return (
    <div className="space-y-1 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        Spot+Regel Aktuell (Gramm):
      </p>
      {directions.map(dir => (
        [1, 2, 3, 4].map(metalId => {
          const rule = activeRules.find(r => r.metalId === metalId && r.direction === dir);
          if (!rule) return null;
          return (
            <p key={`${dir}-${metalId}`} className="truncate text-[10px] text-gray-300">
              {dirLabels[dir]} {metalNames[metalId]}{' '}
              <span className={dir === 'ankauf' ? 'text-red-300' : 'text-green-300'}>
                {formatEuro(rule.calculatedValue)}
              </span>
            </p>
          );
        })
      ))}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isAdmin } = useRBAC();
  const { data: spotRules } = useApi(() => getAllSpotRules(), []);
  const [masterDataOpen, setMasterDataOpen] = useState(true);

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 text-gray-100">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 bg-teal-700">
        <h1 className="text-lg font-bold tracking-wide">PriceEngine</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {mainNav.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-teal-700/50 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Separator className="my-3 bg-gray-700" />

        {/* Spot Info */}
        <SpotInfoSection rules={spotRules} />

        <Separator className="my-3 bg-gray-700" />

        {/* Stammdaten (Admin) */}
        {isAdmin && (
          <div className="px-2">
            <button
              onClick={() => setMasterDataOpen(!masterDataOpen)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-200"
            >
              {masterDataOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Stammdaten
            </button>
            {masterDataOpen && (
              <ul className="space-y-0.5 mt-1">
                {masterDataNav.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                        pathname === item.href
                          ? 'bg-teal-700/50 text-white font-medium'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium text-gray-200">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400">{user?.roles.map(r => r.name).join(', ')}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            title="Abmelden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
