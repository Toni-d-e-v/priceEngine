'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SpotRulesPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/spot-rules/verkauf'); }, [router]);
  return null;
}
