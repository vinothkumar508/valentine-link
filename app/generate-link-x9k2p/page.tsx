'use client';

import { useEffect, useState } from 'react';
import { GENERATOR_ENABLED } from '@/utils/config';
import { NotFoundView } from '@/components/NotFoundView';
import { GeneratorClient } from './GeneratorClient';

type AuthState = 'checking' | 'authorized' | 'unauthorized';

const ACCESS_FLAG = 'generator_access';

export default function GeneratorPage() {
  const [auth, setAuth] = useState<AuthState>('checking');

  useEffect(() => {
    // Feature flag: hard-disable generator in production without deleting code.
    if (!GENERATOR_ENABLED) {
      setAuth('unauthorized');
      return;
    }

    // Optional hardening: allow reuse for the session after a valid access.
    try {
      if (window.sessionStorage.getItem(ACCESS_FLAG) === 'true') {
        setAuth('authorized');
        return;
      }
    } catch {
      // ignore storage failures; fall back to key check
    }

    const params = new URLSearchParams(window.location.search);
    const key = params.get('key') ?? '';
    const expected = process.env.NEXT_PUBLIC_GENERATOR_KEY ?? '';

    if (key && expected && key === expected) {
      try {
        window.sessionStorage.setItem(ACCESS_FLAG, 'true');
      } catch {
        // ignore
      }
      setAuth('authorized');
    } else {
      setAuth('unauthorized');
    }
  }, []);

  // Prevent any generator flash while checking.
  if (auth === 'checking') return null;

  if (auth === 'unauthorized') return <NotFoundView />;

  return <GeneratorClient />;
}

