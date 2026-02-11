/**
 * XSS-safe sanitization. Strip HTML and escape for safe text rendering.
 * Never use raw params in DOM; always pass through these helpers.
 */

const HTML_TAG_REGEX = /<[^>]*>/g;
const MAX_SAFE_LENGTH = 500;

/**
 * Strip all HTML tags from a string.
 */
export function stripHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(HTML_TAG_REGEX, '').trim();
}

/**
 * Escape HTML entities for safe text content (no dangerouslySetInnerHTML).
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return text.replace(/[&<>"'`=/]/g, (char) => map[char] ?? char);
}

/**
 * Sanitize for display: strip HTML then escape. Safe to render as text.
 */
export function sanitizeText(input: string, maxLength = MAX_SAFE_LENGTH): string {
  const stripped = stripHtml(input);
  const truncated = stripped.length > maxLength ? stripped.slice(0, maxLength) : stripped;
  return escapeHtml(truncated);
}

/**
 * Validate and sanitize a single URL. Accept only https.
 */
export function sanitizeImageUrl(url: string): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith('https://')) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Sanitize array of image URLs; return only valid https URLs.
 */
export function sanitizeImageUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) return [];
  const result: string[] = [];
  for (const u of urls) {
    const safe = sanitizeImageUrl(u);
    if (safe && !result.includes(safe)) result.push(safe);
  }
  return result.slice(0, 5);
}
