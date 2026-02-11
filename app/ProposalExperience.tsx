'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { decodeParams } from '@/utils/decodeParams';
import { Card } from '@/components/Card';
import { Button } from '@/components/Buttons';
import { Confetti } from '@/components/Confetti';
import { SuccessExperience } from './SuccessExperience';

const NO_PHRASES = ['Are you sure?', 'Really sure?', 'Think again...', 'Last chance :)', 'Yes?'];

const transition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] };

export function ProposalExperience() {
  const searchParams = useSearchParams();
  const params = useMemo(
    () => decodeParams(new URLSearchParams(searchParams?.toString() ?? '')),
    [searchParams]
  );

  const [accepted, setAccepted] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [confettiActive, setConfettiActive] = useState(false);

  const noPhrase = NO_PHRASES[Math.min(noClicks, NO_PHRASES.length - 1)];

  const moveNoButton = useCallback(() => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 60;
    setNoPosition({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
    });
  }, []);

  const handleNoClick = useCallback(() => {
    setNoClicks((c) => c + 1);
    setYesScale((s) => Math.min(s + 0.08, 1.35));
    moveNoButton();
  }, [moveNoButton]);

  const handleYesClick = useCallback(() => {
    setConfettiActive(true);
    const t = setTimeout(() => setAccepted(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handle = () => moveNoButton();
    const btn = document.getElementById('no-btn');
    if (!btn) return;
    btn.addEventListener('mouseenter', handle);
    btn.addEventListener('focus', handle);
    return () => {
      btn.removeEventListener('mouseenter', handle);
      btn.removeEventListener('focus', handle);
    };
  }, [moveNoButton]);

  return (
    <>
      <Confetti active={confettiActive} />

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="proposal"
            className="w-full max-w-lg mx-auto"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={transition}
          >
            <Card className="space-y-6 text-center">
              <p className="text-stone-600 text-sm">To {params.to}</p>
              <p className="text-2xl sm:text-3xl font-semibold text-stone-800 prose-break">
                {params.msg}
              </p>
              <p className="text-stone-600 text-sm">From {params.from}</p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button
                  variant="yes"
                  onClick={handleYesClick}
                  className="transition-transform duration-200"
                  style={{ transform: `scale(${yesScale})` }}
                >
                  YES
                </Button>
                <div className="relative h-14 w-[120px] flex items-center justify-center">
                  <button
                    id="no-btn"
                    type="button"
                    onClick={handleNoClick}
                    className="absolute min-h-[48px] min-w-[100px] px-6 py-3 rounded-2xl bg-stone-200/80 text-stone-600 font-semibold hover:bg-stone-300/80 active:scale-[0.98] transition-all duration-300 ease-out touch-manipulation"
                    style={{
                      transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                    }}
                  >
                    NO
                  </button>
                </div>
              </div>
              {noClicks > 0 && (
                <p className="text-rose-500/90 text-sm font-medium animate-fade-in">
                  {noPhrase}
                </p>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="w-full min-h-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transition}
          >
            <SuccessExperience params={params} onReplay={() => setAccepted(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
