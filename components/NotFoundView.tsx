'use client';

import { Card } from './Card';
import { Button } from './Buttons';

export function NotFoundView() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fef2f2] via-[#fce7f3] to-[#fdf2f8] flex items-center justify-center p-4">
      <Card className="text-center space-y-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">404</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-800">Page not found</h1>
        <p className="text-stone-600 text-sm">
          This page doesn&apos;t exist.
        </p>
        <div className="pt-2">
          <a href="/" className="inline-block w-full">
            <Button variant="primary" className="w-full">
              Go home
            </Button>
          </a>
        </div>
      </Card>
    </main>
  );
}

