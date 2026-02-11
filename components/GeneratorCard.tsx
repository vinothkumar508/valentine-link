"use client";

import { useCallback, useMemo, useState } from 'react';

export function GeneratorCard() {
  const [name, setName] = useState('');
  const [photos, setPhotos] = useState<string[]>(['', '', '']);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const validPhotos = useMemo(
    () => photos.filter((p) => p.trim().startsWith('http')),
    [photos]
  );

  const updatePhoto = useCallback((idx: number, val: string) => {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  }, []);

  const addPhoto = useCallback(() => setPhotos((p) => [...p, '']), []);

  const generateLink = useCallback(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const displayName = name.trim() || 'Someone Special';
    const photoList = validPhotos.map((p) => encodeURIComponent(p.trim()));
    const photosParam = photoList.join(',');
    const qs = new URLSearchParams();
    qs.set('name', displayName);
    if (photosParam) qs.set('photos', photosParam);
    const url = `${origin}/?${qs.toString()}`;
    setGenerated(url);
    setCopied(false);
  }, [name, validPhotos]);

  const copyLink = useCallback(async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // ignore
    }
  }, [generated]);

  const openLink = useCallback(() => {
    if (!generated) return;
    window.open(generated, '_blank');
  }, [generated]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/95 p-6 rounded-2xl shadow-card border border-white/80">
        <h2 className="text-lg font-semibold text-stone-800">Private Generator</h2>
        <p className="text-sm text-stone-500 mt-1">Create a private proposal URL</p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm text-stone-600">Recipient Name</span>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">Photo Links</span>
              <button
                type="button"
                onClick={addPhoto}
                className="text-sm text-rose-600 font-medium"
              >
                + Add Photo
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {photos.map((p, i) => (
                <input
                  key={`${i}-${p}`}
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={p}
                  onChange={(e) => updatePhoto(i, e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 bg-white/80 focus:outline-none"
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={generateLink}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700"
            >
              Generate Link
            </button>
            <button
              type="button"
              onClick={() => {
                setName('');
                setPhotos(['', '', '']);
                setGenerated('');
              }}
              className="px-4 py-2 bg-stone-100 rounded-xl font-medium"
            >
              Reset
            </button>
          </div>

          {generated && (
            <div className="mt-4 space-y-2">
              <label className="block text-sm text-stone-600">Generated URL</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={generated}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 bg-stone-50 text-sm"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="px-3 py-2 bg-stone-800 text-white rounded-lg"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={openLink}
                  className="px-3 py-2 bg-white border border-stone-200 rounded-lg"
                >
                  Open
                </button>
              </div>
              <p className="text-xs text-stone-500">Share this link privately (WhatsApp, SMS).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
