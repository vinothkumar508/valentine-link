'use client';

import { motion } from 'framer-motion';
import type { ProposalParams } from '@/utils/decodeParams';
import { Button } from '@/components/Buttons';
import { PhotoGrid } from '@/components/PhotoGrid';

interface SuccessExperienceProps {
  params: ProposalParams;
  onReplay: () => void;
}

const HEADLINES = [
  'You said YES!',
  "It's the start of something beautiful.",
];

export function SuccessExperience({ params, onReplay }: SuccessExperienceProps) {
  const hasImages = params.imgs.length > 0;
  const mailtoSubject = encodeURIComponent(`From ${params.from} — You said yes!`);
  const mailtoBody = encodeURIComponent(`Hi ${params.from},\n\nI said yes! 💕`);
  const mailto = `mailto:?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="absolute inset-0 min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      {/* Soft animated gradient background */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-rose-50/95 via-pink-50/90 to-fuchsia-50/95"
        aria-hidden
      />
      {/* Subtle floating hearts (CSS-only, lightweight) */}
      <div className="fixed inset-0 -z-[9] overflow-hidden pointer-events-none" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="absolute text-2xl opacity-[0.12] animate-float"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <motion.div
        className="w-full max-w-xl mx-auto flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
          {HEADLINES[0]}
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-stone-600 max-w-md">
          {HEADLINES[1]}
        </p>
        <p className="mt-2 text-stone-500 text-sm">
          {params.from} is over the moon.
        </p>

        {hasImages ? (
          <PhotoGrid imageUrls={params.imgs} />
        ) : (
          <motion.div
            className="mt-8 w-full max-w-sm mx-auto p-8 rounded-3xl bg-white/90 shadow-card border border-white/80"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <span className="text-4xl inline-block animate-float" aria-hidden>💕</span>
            <p className="mt-4 text-stone-700 font-medium">
              Happy Valentine&apos;s Day
            </p>
            <p className="mt-1 text-stone-500 text-sm">
              From {params.from} with love
            </p>
          </motion.div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto sm:justify-center">
          <Button variant="primary" onClick={onReplay}>
            Replay
          </Button>
          <a
            href={mailto}
            className="inline-flex items-center justify-center font-semibold rounded-xl min-h-[48px] px-6 bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200 transition-colors"
          >
            Send a message
          </a>
        </div>
      </motion.div>
    </div>
  );
}
