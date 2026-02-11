'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Buttons';
import { Toast } from '@/components/Toast';
import { buildQueryString } from '@/utils/decodeParams';
import { sanitizeImageUrl } from '@/utils/sanitize';
import { GENERATOR_MAX_ACTIONS_PER_SESSION } from '@/utils/generatorRateLimit';

const MAX_RECIPIENT = 30;
const MAX_SENDER = 30;
const MAX_MSG = 120;
const MAX_IMGS = 5;

const SESSION_KEY = 'valentine_generator_actions_v1';

function readSessionCount(): number {
  if (typeof window === 'undefined') return 0;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function writeSessionCount(n: number) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SESSION_KEY, String(n));
}

export function GeneratorClient() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [msg, setMsg] = useState('Will you be mine?');
  const [imgs, setImgs] = useState<string[]>(['', '', '', '', '']);

  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Link copied to clipboard!');
  const [actions, setActions] = useState(0);

  const linkInputRef = useRef<HTMLInputElement>(null);
  const linkSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActions(readSessionCount());
  }, []);

  const canAct = actions < GENERATOR_MAX_ACTIONS_PER_SESSION;

  const bumpActions = useCallback(() => {
    setActions((prev) => {
      const next = prev + 1;
      writeSessionCount(next);
      return next;
    });
  }, []);

  const validImgs = useMemo(
    () => imgs.map((u) => sanitizeImageUrl(u)).filter((u): u is string => u != null),
    [imgs]
  );

  const generatedLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const q = buildQueryString({
      to: to.trim(),
      from: from.trim(),
      msg: msg.trim(),
      imgs: validImgs,
    });
    return q ? `${origin}/?${q}` : `${origin}/`;
  }, [to, from, msg, validImgs]);

  const updateImg = useCallback((i: number, value: string) => {
    setImgs((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }, []);

  const handleGenerateLink = useCallback(() => {
    if (!canAct) {
      setToastMsg('Rate limit reached for this session.');
      setToast(true);
      return;
    }
    bumpActions();
    linkSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    requestAnimationFrame(() => linkInputRef.current?.select());
  }, [bumpActions, canAct]);

  const handleCopy = useCallback(() => {
    if (!generatedLink) return;
    if (!canAct) {
      setToastMsg('Rate limit reached for this session.');
      setToast(true);
      return;
    }

    navigator.clipboard.writeText(generatedLink).then(() => {
      bumpActions();
      setToastMsg('Link copied to clipboard!');
      setToast(true);
      linkInputRef.current?.select();
    });
  }, [bumpActions, canAct, generatedLink]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fef2f2] via-[#fce7f3] to-[#fdf2f8] py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-8">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-800">
            Generator
          </h1>
          <p className="text-stone-600 mt-1 text-sm">
            Create a personalized invitation link.
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Session actions: <span className="tabular-nums">{actions}</span> /{' '}
            <span className="tabular-nums">{GENERATOR_MAX_ACTIONS_PER_SESSION}</span>
          </p>
        </header>

        <Card className="space-y-5">
          <Input
            id="to"
            label="Recipient name"
            placeholder="e.g. Ananya"
            value={to}
            onChange={setTo}
            maxLength={MAX_RECIPIENT}
            required
          />
          <Input
            id="from"
            label="Your name"
            placeholder="e.g. Vinoth"
            value={from}
            onChange={setFrom}
            maxLength={MAX_SENDER}
            required
          />
          <Input
            id="msg"
            label="Custom message"
            placeholder="Will you be mine?"
            value={msg}
            onChange={setMsg}
            maxLength={MAX_MSG}
          />
          <div>
            <p className="block text-sm font-medium text-stone-600 mb-2">
              Image URLs (optional, up to 5)
            </p>
            <p className="text-xs text-stone-500 mb-2">
              Only https:// links are accepted. Empty fields are ignored.
            </p>
            <div className="space-y-2">
              {imgs.map((url, i) => (
                <input
                  key={i}
                  type="url"
                  placeholder={`Image ${i + 1} URL`}
                  value={url}
                  onChange={(e) => updateImg(i, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Live preview */}
        <Card className="border-2 border-dashed border-rose-200/60">
          <p className="text-xs font-medium text-rose-600/80 uppercase tracking-wider mb-3">
            Preview
          </p>
          <div className="space-y-1 text-stone-700 prose-break">
            <p className="text-sm">
              To <span className="font-medium">{to || '…'}</span>
            </p>
            <p className="text-lg font-medium text-stone-800">
              {msg || 'Will you be mine?'}
            </p>
            <p className="text-sm">
              From <span className="font-medium">{from || '…'}</span>
            </p>
            {validImgs.length > 0 && (
              <p className="text-xs text-stone-500">
                {validImgs.length} image(s) will show after &quot;Yes&quot;
              </p>
            )}
          </div>
        </Card>

        {/* Generated link */}
        <div ref={linkSectionRef}>
          <Card padding="md" className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-stone-600">Your link</p>
              <Button
                variant="primary"
                onClick={handleGenerateLink}
                className="w-full sm:w-auto"
                disabled={!canAct}
              >
                Generate Link
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                ref={linkInputRef}
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 px-4 py-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-sm font-mono truncate"
                aria-label="Generated link"
              />
              <Button
                variant="primary"
                onClick={handleCopy}
                aria-label="Copy link"
                disabled={!canAct}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-stone-500">
              Share this link. Recipients will only see the experience viewer.
            </p>
          </Card>
        </div>

        <p className="text-center">
          <a href="/" className="text-rose-600 hover:text-rose-700 text-sm font-medium">
            ← Back to home
          </a>
        </p>
      </div>

      <Toast message={toastMsg} visible={toast} onDismiss={() => setToast(false)} />
    </main>
  );
}

