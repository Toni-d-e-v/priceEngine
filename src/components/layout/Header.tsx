'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Aktuelle Preise',
  '/spot-rules/verkauf': 'Spotpreis und Regeln Verkauf',
  '/spot-rules/ankauf': 'Spotpreis und Regeln Ankauf',
  '/products': 'Shop Preise',
  '/import': 'Aus PS Importieren',
  '/configurator': 'Konfigurator',
  '/logs': 'Logs',
  '/holidays': 'Feiertage',
  '/master-data/customer-groups': 'Kundengruppen',
  '/master-data/formulas': 'Formeln',
  '/master-data/articles': 'Artikel-Stammdaten',
  '/master-data/manufacturers': 'Hersteller',
  '/master-data/suppliers': 'Lieferanten',
  '/master-data/roles': 'Rollen',
  '/master-data/users': 'Benutzer',
  '/master-data/user-roles': 'Benutzer-Rollen',
};

export function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'PriceEngine';

  return (
    <header className="flex h-14 items-center border-b bg-white px-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="ml-auto text-sm text-muted-foreground">
        Letzte Aktualisierung: {new Date().toLocaleTimeString('de-DE')}
      </div>
    </header>
  );
}
