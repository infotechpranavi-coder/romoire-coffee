export const SITE_NAME = 'Romoire';
export const SITE_TAGLINE = 'Specialty Coffee Roasters';
export const LOGO_SRC = '/20260812_Romoire_Logo-01-removebg-preview.png';

/** Brand palette from the Romoire logo (burgundy + cream) */
export const BRAND = {
  burgundy: '#6B1F2A',
  burgundyDark: '#4A1520',
  burgundyDeep: '#3D1218',
  cream: '#F5EFE6',
  creamMuted: '#E8DFD0',
  creamSoft: '#FAF6F0',
} as const;

export const SITE_DESCRIPTION =
  'Romoire sources and roasts premium coffee beans from the world\'s finest growing regions. Shop single-origin lots, signature blends, and fresh roasts delivered to your door.';

export const DEFAULT_ABOUT_TEXT = `${SITE_NAME} is a specialty coffee roaster dedicated to sourcing exceptional beans, roasting in small batches, and delivering peak freshness with every bag.`;

export const DEFAULT_SERVICES_TEXT =
  'Single-origin beans, Signature blends, Espresso roasts, Whole bean & ground options, Wholesale & subscriptions';

/** Replace legacy travel branding in stored product copy when rendering. */
export function brandedText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/Explore\s*360/gi, SITE_NAME)
    .replace(/Premium Sky\s*Go Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Premium Skygo Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Sky\s*Go/gi, SITE_NAME)
    .replace(/Skygo/gi, SITE_NAME)
    .replace(/\b(tour|tours|travel package|travel packages|ticketing)\b/gi, (match) => {
      const map: Record<string, string> = {
        tour: 'coffee',
        tours: 'coffees',
        'travel package': 'coffee bag',
        'travel packages': 'coffee bags',
        ticketing: 'ordering',
      };
      return map[match.toLowerCase()] ?? match;
    });
}
