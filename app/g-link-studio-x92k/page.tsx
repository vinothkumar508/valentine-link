"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GeneratorCard } from '@/components/GeneratorCard';
import { GENERATOR_SECRET } from '@/utils/config';

export default function PrivateGeneratorPage() {
  const searchParams = useSearchParams();
  const key = searchParams?.get('key') ?? '';
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // prevent UI flash: keep null until validated
    const valid = Boolean(key && key === GENERATOR_SECRET);
    setAuthorized(valid);
  }, [key]);

  if (authorized === null) return null;

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef2f2] via-[#fce7f3] to-[#fdf2f8]">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold text-stone-700">404</h1>
          <p className="mt-2 text-stone-500">Not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fef2f2] via-[#fce7f3] to-[#fdf2f8] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <GeneratorCard />
      </div>
    </main>
  );
}
