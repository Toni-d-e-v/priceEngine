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
  Menu,
  X,
  Coins,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import type { SpotRule } from '@/types';

// --- Types & Constants ---

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNav: NavItem[] = [
  { label: 'Aktuelle Preise', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Spot Verkauf', href: '/spot-rules/verkauf', icon: <TrendingUp className="h-4 w-4" /> },
  { label: 'Spot Ankauf', href: '/spot-rules/ankauf', icon: <TrendingDown className="h-4 w-4 text-red-400" /> },
  { label: 'Produktpreise', href: '/products', icon: <ShoppingCart className="h-4 w-4" /> },
  { label: 'Aus PS importieren', href: '/import', icon: <Upload className="h-4 w-4" /> },
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
  { label: 'Rollen zuweisen', href: '/master-data/user-roles', icon: <UserCheck className="h-4 w-4" /> },
];

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- Sub-Components ---

function SpotInfoSection({ rules }: { rules: SpotRule[] | null }) {
  if (!rules) return null;

  const metalNames: Record<number, string> = { 1: 'Au', 2: 'Ag', 3: 'Pt', 4: 'Pd' };
  const activeRules = rules.filter((r) => r.isActive && r.ruleType === 'standard');

  return (
 <div className="mx-2 mt-3 rounded-lg border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-sm">
  {/* Header: Sve u jednoj liniji */}
  <div className="mb-2 flex items-center justify-between px-1">
    <div className="flex items-center gap-1.5">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400"></span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400">Live Spot <span className="opacity-50">(g)</span></span>
    </div>
  </div>

  {/* Grid bez suvišnih okvira */}
  <div className="grid grid-cols-2 gap-4">
    {/* Ankauf Column */}
    <div>
      <p className="mb-1.5 px-1 text-[8px] font-black uppercase tracking-widest text-red-400/70">Ankauf</p>
      <div className="space-y-1">
        {[1, 2, 3, 4].map((metalId) => {
          const rule = activeRules.find((r) => r.metalId === metalId && r.direction === 'ankauf');
          if (!rule) return null;
          return (
            <div key={`ank-${metalId}`} className="flex justify-between border-b border-white/5 px-1 pb-0.5 last:border-0">
              <span className="text-[10px] text-gray-500">{metalNames[metalId]}</span>
              <span className="font-mono text-[10px] font-semibold tabular-nums text-red-200">
                {formatEuro(rule.calculatedValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Verkauf Column */}
    <div className="border-l border-white/10 pl-3">
      <p className="mb-1.5 px-1 text-[8px] font-black uppercase tracking-widest text-emerald-400/70">Verkauf</p>
      <div className="space-y-1">
        {[1, 2, 3, 4].map((metalId) => {
          const rule = activeRules.find((r) => r.metalId === metalId && r.direction === 'verkauf');
          if (!rule) return null;
          return (
            <div key={`vkf-${metalId}`} className="flex justify-between border-b border-white/5 px-1 pb-0.5 last:border-0">
              <span className="text-[10px] text-gray-500">{metalNames[metalId]}</span>
              <span className="font-mono text-[10px] font-semibold tabular-nums text-emerald-200">
                {formatEuro(rule.calculatedValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>
  );
}

function NavItemLink({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200',
        isActive
          ? 'bg-teal-900/30 text-teal-100 shadow-sm ring-1 ring-teal-700/50'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
      )}
    >
      <span className={cn('transition-colors', isActive ? 'text-teal-400' : 'text-zinc-500 group-hover:text-zinc-300')}>
        {item.icon}
      </span>
      <span>{item.label}</span>
      {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />}
    </Link>
  );
}

// --- Main Sidebar Component ---

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isAdmin } = useRBAC();
  const { data: spotRules } = useApi(() => getAllSpotRules(), []);
  
  const [masterDataOpen, setMasterDataOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile Trigger Button (Visible only on mobile) */}
      <div className="fixed top-0 left-0 z-40 flex w-full items-center justify-between bg-zinc-950 px-4 py-3 md:hidden border-b border-zinc-800">
        <div className="flex items-center gap-2">

          <span className="font-bold text-zinc-100 tracking-tight">PriceEngine</span>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-zinc-950 text-zinc-100 shadow-2xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 border-r border-zinc-800',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Logo (Desktop) */}
        <div className="hidden h-16 items-center gap-3 px-6 md:flex border-b border-zinc-800/50 bg-zinc-950/50">

          <h1 className="text-lg font-bold tracking-tight text-white">PriceEngine</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          
          {/* Main Navigation */}
          <nav className="space-y-1 px-3">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase text-zinc-500">Menu</p>
            {mainNav.map((item) => (
              <NavItemLink key={item.href} item={item} isActive={pathname === item.href} />
            ))}
          </nav>

          {/* Spot Ticker Widget */}
          <SpotInfoSection rules={spotRules} />

          {/* Master Data (Admin Section) */}
          {isAdmin && (
            <div className="mt-6 px-3">
              <button
                onClick={() => setMasterDataOpen(!masterDataOpen)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors"
              >
                <span>Stammdaten</span>
                {masterDataOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out overflow-hidden",
                  masterDataOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <ul className="min-h-0 space-y-0.5 border-l border-zinc-800 ml-3 pl-2">
                  {masterDataNav.map((item) => (
                    <li key={item.href}>
                       <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                          pathname === item.href
                            ? 'bg-zinc-800 text-teal-400 font-medium'
                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                        )}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* User Footer */}
        <div className="border-t border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-900/50 text-teal-200 ring-1 ring-teal-700/30">
              <span className="text-xs font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-zinc-200">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {user?.roles?.[0]?.name || 'Benutzer'}
              </p>
            </div>
            <button
              onClick={logout}
              className="group rounded-md p-2 text-zinc-500 hover:bg-red-950/30 hover:text-red-400 transition-colors"
              title="Abmelden"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Spacer for mobile header to prevent content overlap */}
      <div className="h-14 md:hidden" />
    </>
  );
}