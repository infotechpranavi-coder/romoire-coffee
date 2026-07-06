/**
 * Verified coffee stock images — use ixlib Unsplash URLs to avoid 404s with Next/Image optimizer.
 */
const ix = (photoId: string, width = 800) =>
  `https://images.unsplash.com/${photoId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=80`;

export const COFFEE_IMAGES = {
  beans: ix('photo-1447933601403-0c6688de566e'),
  beansDark: ix('photo-1495474472287-4d71bcdd2085'),
  cup: ix('photo-1509042239860-f550ce710b93'),
  latte: ix('photo-1514432324607-a09d9b4aefdd'),
  espresso: ix('photo-1510591509098-f4fdc6d0ff04'),
  pour: ix('photo-1461023058943-07fcbe16d735'),
  shop: ix('photo-1501339847302-ac426a4a7cbb'),
  brew: ix('photo-1442512595331-e89e73853f31'),
  coldBrew: ix('photo-1517487881594-2787f5eba4e0'),
  hero: ix('photo-1447933601403-0c6688de566e', 1920),
  footer: ix('photo-1447933601403-0c6688de566e', 2000),
} as const;

export const DEFAULT_COFFEE_IMAGE = COFFEE_IMAGES.beans;

/** Photo IDs that return 404 from Unsplash — map to fallbacks at runtime */
const BROKEN_PHOTO_IDS = [
  'photo-1497935586351-b67a088e095f',
  'photo-1511920170033-f8396924c10f',
  'photo-1559056199-641a0ac8b55c',
];

const FALLBACK_ROTATION = [
  COFFEE_IMAGES.beans,
  COFFEE_IMAGES.beansDark,
  COFFEE_IMAGES.cup,
  COFFEE_IMAGES.latte,
  COFFEE_IMAGES.espresso,
  COFFEE_IMAGES.pour,
  COFFEE_IMAGES.shop,
  COFFEE_IMAGES.brew,
];

export function coffeeImage(width = 800, variant: keyof typeof COFFEE_IMAGES = 'beans') {
  const base = COFFEE_IMAGES[variant];
  if (width === 800) return base;
  return base.replace(/w=\d+/, `w=${width}`);
}

export function resolveCoffeeImage(url?: string | null, index = 0): string {
  if (!url?.trim()) {
    return FALLBACK_ROTATION[index % FALLBACK_ROTATION.length];
  }
  if (BROKEN_PHOTO_IDS.some((id) => url.includes(id))) {
    return FALLBACK_ROTATION[index % FALLBACK_ROTATION.length];
  }
  // Normalize bare unsplash URLs to ixlib format
  if (url.includes('images.unsplash.com') && !url.includes('ixlib=rb')) {
    const match = url.match(/photo-\d+-[a-f0-9]+/i);
    if (match) {
      const wMatch = url.match(/w=(\d+)/);
      const w = wMatch ? wMatch[1] : '800';
      return ix(match[0], Number(w));
    }
  }
  return url;
}
