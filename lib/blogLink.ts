/**
 * External blog link helpers (paste-link blogs)
 */

export type BlogSourceType = 'manual' | 'link';

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Human title from a URL path slug. */
export function titleFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, '').split('/').pop() || 'Linked Page';
    return path
      .replace(/[-_]+/g, ' ')
      .replace(/\.[a-z]+$/i, '')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .slice(0, 120) || 'Linked Page';
  } catch {
    return 'Linked Page';
  }
}

export function getExternalBlogEmbedSrc(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
  } catch {
    return null;
  }
  return `/api/blogs/embed-proxy?url=${encodeURIComponent(trimmed)}`;
}
