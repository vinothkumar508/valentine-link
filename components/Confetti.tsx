'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fecdd3', '#fbbf24'];
const COUNT = 55;

export function Confetti({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete?: () => void;
}) {
  const [particles] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      tx: (Math.random() - 0.5) * 120,
      ty: 80 + Math.random() * 40,
      rotation: Math.random() * 720,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 8,
      duration: 2.2 + Math.random() * 1,
      delay: Math.random() * 0.25,
    }))
  );

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => onComplete?.(), 4000);
    return () => clearTimeout(t);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
      aria-hidden
    >
      <style jsx global>{`
        @keyframes confettiDrop {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(
                calc(var(--tx, 0) * 1vw),
                calc(var(--ty, 100) * 1vh)
              )
              rotate(var(--rot, 360deg));
          }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/3 rounded-sm"
          style={
            {
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
              '--tx': p.tx,
              '--ty': p.ty,
              '--rot': `${p.rotation}deg`,
              animation: `confettiDrop ${p.duration}s ease-out ${p.delay}s forwards`,
              opacity: 0,
            } as React.CSSProperties & { '--tx': number; '--ty': number; '--rot': string }
          }
        />
      ))}
    </div>
  );
}
