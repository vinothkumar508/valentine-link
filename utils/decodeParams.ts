/**
 * Decode and sanitize URL query parameters for the proposal page.
 * All values are sanitized before use; never inject raw params into DOM.
 */

import { sanitizeText, sanitizeImageUrls } from './sanitize';

export interface ProposalParams {
  to: string;
  from: string;
  msg: string;
  imgs: string[];
}

const DEFAULTS: ProposalParams = {
  to: 'Someone special',
  from: 'Someone who cares',
  msg: 'Will you be mine?',
  imgs: [],
};

/**
 * Decode proposal params from URL search params (client-side).
 * Safe for SSR/static: pass empty or partial params; we apply defaults and sanitize.
 */
export function decodeParams(searchParams: URLSearchParams): ProposalParams {
  const to = sanitizeText(searchParams.get('to') ?? '', 30) || DEFAULTS.to;
  const from = sanitizeText(searchParams.get('from') ?? '', 30) || DEFAULTS.from;
  const msg = sanitizeText(searchParams.get('msg') ?? '', 120) || DEFAULTS.msg;
  const imgsRaw = searchParams.get('imgs') ?? '';
  const imgs = sanitizeImageUrls(
    imgsRaw.split('|').map((s) => s.trim()).filter(Boolean)
  );

  return { to, from, msg, imgs };
}

/**
 * Build query string from form values (for link generation).
 * Values should be pre-validated and length-limited by the form.
 */
export function buildQueryString(params: {
  to: string;
  from: string;
  msg: string;
  imgs: string[];
}): string {
  const q = new URLSearchParams();
  if (params.to.trim()) q.set('to', params.to.trim());
  if (params.from.trim()) q.set('from', params.from.trim());
  if (params.msg.trim()) q.set('msg', params.msg.trim());
  const validImgs = params.imgs
    .map((u) => u.trim())
    .filter((u) => u && u.startsWith('https://'));
  if (validImgs.length > 0) q.set('imgs', validImgs.join('|'));
  return q.toString();
}
