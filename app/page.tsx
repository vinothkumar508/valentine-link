'use client';

import { Suspense } from 'react';
import { ProposalExperience } from './ProposalExperience';

function ProposalFallback() {
  return (
    <div className="w-full max-w-lg animate-pulse">
      <div className="h-64 rounded-2xl bg-white/80 shadow-card" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fef2f2] via-[#fce7f3] to-[#fdf2f8] flex flex-col items-center justify-center p-4 relative overflow-x-hidden">
      <Suspense fallback={<ProposalFallback />}>
        <ProposalExperience />
      </Suspense>
    </main>
  );
}
