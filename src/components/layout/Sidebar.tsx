'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { useApi } from '@/hooks/useApi';
import { getAllSpotRules } from '@/lib/api/endpoints/spot-rules';
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
  Receipt,
  Calendar,
  Shield,
  UserCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  History,
  Layers,
  Grid3X3,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { SpotRule } from '@/types';

// ─────────────────────────────────────────────
// Types & Configuration
// ─────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const METAL_LABELS: Record<number, { symbol: string; name: string }> = {
  1: { symbol: 'Au', name: 'Gold' },
  2: { symbol: 'Ag', name: 'Silber' },
  3: { symbol: 'Pt', name: 'Platin' },
  4: { symbol: 'Cu', name: 'Kupfer' },
};

const mainNav: NavItem[] = [
  { label: 'Aktuelle Preise', href: '/dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { label: 'Spot Verkauf', href: '/spot-rules/verkauf', icon: <TrendingUp className="h-[18px] w-[18px]" /> },
  { label: 'Spot Ankauf', href: '/spot-rules/ankauf', icon: <TrendingDown className="h-[18px] w-[18px]" /> },
  { label: 'Produktpreise', href: '/products', icon: <ShoppingCart className="h-[18px] w-[18px]" /> },
  { label: 'Kurshistorie', href: '/rate-history', icon: <History className="h-[18px] w-[18px]" /> },
  { label: 'PS Import', href: '/import', icon: <Upload className="h-[18px] w-[18px]" /> },
  { label: 'Konfigurator', href: '/configurator', icon: <Settings className="h-[18px] w-[18px]" /> },
  { label: 'Logs', href: '/logs', icon: <FileText className="h-[18px] w-[18px]" /> },
];

const masterDataNav: NavItem[] = [
  { label: 'Kundengruppen', href: '/master-data/customer-groups', icon: <Users className="h-[18px] w-[18px]" /> },
  { label: 'Formeln', href: '/master-data/formulas', icon: <BookOpen className="h-[18px] w-[18px]" /> },
  { label: 'Artikel', href: '/master-data/articles', icon: <Package className="h-[18px] w-[18px]" /> },
  { label: 'Artikelgruppen', href: '/master-data/article-groups', icon: <Layers className="h-[18px] w-[18px]" /> },
  { label: 'Gruppen-Zuschläge', href: '/master-data/article-group-surcharges', icon: <Grid3X3 className="h-[18px] w-[18px]" /> },
  { label: 'Hersteller', href: '/master-data/manufacturers', icon: <Factory className="h-[18px] w-[18px]" /> },
  { label: 'Lieferanten', href: '/master-data/suppliers', icon: <Truck className="h-[18px] w-[18px]" /> },
  { label: 'Steuerzuordnung', href: '/master-data/tax-mappings', icon: <Receipt className="h-[18px] w-[18px]" /> },
  { label: 'Feiertage', href: '/holidays', icon: <Calendar className="h-[18px] w-[18px]" /> },
  { label: 'Rollen', href: '/master-data/roles', icon: <Shield className="h-[18px] w-[18px]" /> },
  { label: 'Benutzer', href: '/master-data/users', icon: <Users className="h-[18px] w-[18px]" /> },
  { label: 'Rollenzuweisung', href: '/master-data/user-roles', icon: <UserCheck className="h-[18px] w-[18px]" /> },
];

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ─────────────────────────────────────────────
// Spot Price Ticker
// ─────────────────────────────────────────────

function SpotPriceTicker({ rules }: { rules: SpotRule[] | null }) {
  if (!rules) return null;

  const activeRules = rules.filter((r) => r.isActive && r.ruleType === 'standard');
  if (activeRules.length === 0) return null;

  return (
    <div className="mx-3 mt-5">
      {/* Section label */}
      <div className="mb-2.5 flex items-center gap-2 px-1">
        <div className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Live Spot · €/g
        </span>
      </div>

      {/* Price card */}
      <div className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/60">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-zinc-800/60 px-3 py-1.5">
          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-600" />
          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.1em] text-red-400/60">
            Ankauf
          </span>
          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-400/60">
            Verkauf
          </span>
        </div>

        {/* Metal rows */}
        <div className="divide-y divide-zinc-800/40">
          {[1, 2, 3, 4].map((metalId) => {
            const ankauf = activeRules.find((r) => r.metalId === metalId && r.direction === 'ankauf');
            const verkauf = activeRules.find((r) => r.metalId === metalId && r.direction === 'verkauf');
            if (!ankauf && !verkauf) return null;

            const metal = METAL_LABELS[metalId];

            return (
              <div
                key={metalId}
                className="grid grid-cols-[1fr_1fr_1fr] items-center px-3 py-1.5 transition-colors hover:bg-zinc-800/20"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-zinc-300">{metal.symbol}</span>
                </div>
                <span className="text-right font-mono text-[11px] tabular-nums text-red-300/90">
                  {ankauf ? formatEuro(ankauf.calculatedValue) : '—'}
                </span>
                <span className="text-right font-mono text-[11px] tabular-nums text-emerald-300/90">
                  {verkauf ? formatEuro(verkauf.calculatedValue) : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Navigation Link
// ─────────────────────────────────────────────

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
        isActive
          ? 'bg-zinc-800/80 text-white'
          : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-emerald-400" />
      )}

      <span
        className={cn(
          'flex-shrink-0 transition-colors duration-150',
          isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-400'
        )}
      >
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

// ─────────────────────────────────────────────
// Main Sidebar
// ─────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isAdmin } = useRBAC();
  const { data: spotRules } = useApi(() => getAllSpotRules(), []);

  const [masterDataOpen, setMasterDataOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  // Close on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const initials = `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const roleName = user?.roles?.[0]?.name ?? 'Benutzer';

  const sidebarContent = (
    <>
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.3s ease;
        }
        .sidebar-scroll:hover {
          scrollbar-color: rgba(113, 113, 122, 0.3) transparent;
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 9999px;
          transition: background 0.3s ease;
        }
        .sidebar-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(113, 113, 122, 0.25);
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.45);
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:active {
          background: rgba(113, 113, 122, 0.6);
        }
      `}</style>

      {/* ── Brand ── */}
      <div className="flex h-[60px] items-center gap-3 border-b border-zinc-800/60 px-5">
        {/* Logomark */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 4.5L8 1.5L14 4.5V11.5L8 14.5L2 11.5V4.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="text-emerald-400"
            />
            <path
              d="M2 4.5L8 7.5M8 7.5L14 4.5M8 7.5V14.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="text-emerald-400/60"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold tracking-tight text-white">
            PriceEngine
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-500">
            Edelmetall
          </span>
        </div>
      </div>

      {/* ── Scrollable Navigation ── */}
      <div className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
        {/* Main nav */}
        <nav className="space-y-0.5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
            Navigation
          </p>
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onClick={closeMobile}
            />
          ))}
        </nav>

        {/* Spot ticker */}
        <SpotPriceTicker rules={spotRules} />

        {/* Master Data — Admin only */}
        {isAdmin && (
          <div className="mt-6">
            <button
              onClick={() => setMasterDataOpen((o) => !o)}
              className="group flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-zinc-800/30"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600 group-hover:text-zinc-400">
                Stammdaten
              </span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-zinc-600 transition-transform duration-200 group-hover:text-zinc-400',
                  !masterDataOpen && '-rotate-90'
                )}
              />
            </button>

            <div
              className={cn(
                'grid transition-all duration-200 ease-in-out',
                masterDataOpen
                  ? 'grid-rows-[1fr] opacity-100 mt-0.5'
                  : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <nav className="ml-2 space-y-0.5 border-l border-zinc-800/60 pl-2">
                  {masterDataNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
                        pathname === item.href
                          ? 'bg-zinc-800/70 text-white'
                          : 'text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-300'
                      )}
                    >
                      <span
                        className={cn(
                          'flex-shrink-0',
                          pathname === item.href ? 'text-emerald-400' : 'text-zinc-600'
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── User Footer ── */}
      <div className="border-t border-zinc-800/60 p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-800/30">
          {/* Avatar */}
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/20">
            <span className="text-[11px] font-bold text-emerald-300">{initials}</span>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-zinc-200">{fullName}</p>
            <p className="truncate text-[11px] text-zinc-500">{roleName}</p>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="group flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Abmelden"
            aria-label="Abmelden"
          >
            <LogOut className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-px" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile Header ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2 4.5L8 1.5L14 4.5V11.5L8 14.5L2 11.5V4.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="text-emerald-400"
              />
              <path
                d="M2 4.5L8 7.5M8 7.5L14 4.5M8 7.5V14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="text-emerald-400/60"
              />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">PriceEngine</span>
        </div>

        <button
          onClick={() => setIsMobileOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          aria-label={isMobileOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* ── Mobile Backdrop ── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:pointer-events-none md:hidden',
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── Sidebar Panel ── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-zinc-800/60 bg-zinc-950 transition-transform duration-250 ease-out',
          'md:static md:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile header spacer */}
      <div className="h-14 md:hidden" />
    </>
  );
}