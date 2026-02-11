"use client";

import React from 'react';

export function PhotoGrid({ imageUrls }: { imageUrls: string[] }) {
  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <div className="w-full mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imageUrls.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={src + i} className="overflow-hidden rounded-2xl shadow-lg bg-white/80">
            <img
              src={src}
              alt={`photo-${i + 1}`}
              className="w-full h-48 object-cover transition-transform duration-300 ease-out hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
