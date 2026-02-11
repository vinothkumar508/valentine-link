'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ProposalParams } from '@/utils/decodeParams';
import { Button } from '@/components/Buttons';

interface SuccessExperienceProps {
  params: ProposalParams;
  onReplay: () => void;
}

const HEADLINES = [
  'You said YES!',
  "It's the start of something beautiful.",
];

function SuccessCarousel({ imageUrls }: { imageUrls: string[] }) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % imageUrls.length);
  }, [imageUrls.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  }, [imageUrls.length]);

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) (diff > 0 ? goNext : goPrev)();
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [goPrev, goNext]);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900/5"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {imageUrls.map((url, i) => (
        <div
          key={url}
          className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300"
          style={{
            opacity: i === index ? 1 : 0,
            pointerEvents: i === index ? 'auto' : 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="w-full h-full max-h-[50vh] object-contain rounded-2xl shadow-lg"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
      {imageUrls.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow soft text-stone-700 flex items-center justify-center hover:bg-white transition-colors touch-manipulation"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-soft text-stone-700 flex items-center justify-center hover:bg-white transition-colors touch-manipulation"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-stone-500 bg-white/80 px-3 py-1 rounded-full">
            {index + 1} / {imageUrls.length}
          </p>
        </>
      )}
    </div>
  );
}

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
          <div className="mt-8 w-full">
            <SuccessCarousel imageUrls={params.imgs} />
          </div>
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
