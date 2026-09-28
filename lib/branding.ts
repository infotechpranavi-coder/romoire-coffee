import { TOKENS } from './design-tokens';

export const SITE_NAME = 'Romoire';
export const SITE_TAGLINE = 'Dairy Free Coffee Premix India | No Refined Sugar';
export const LOGO_SRC = '/20260812_Romoire_Logo-01-removebg-preview.png';

/** Brand palette — Romoire Maroon, Cream & Sand */
export const BRAND = {
  maroon: TOKENS.maroon,
  maroonMid: TOKENS.maroonMid,
  maroonDeep: TOKENS.maroonDeep,
  cream: TOKENS.cream,
  sand: TOKENS.sand,
  gold: TOKENS.gold,
  white: TOKENS.white,
  ink: TOKENS.ink,
  inkSoft: TOKENS.inkSoft,
  inkMute: TOKENS.inkMute,
  espresso: TOKENS.espresso,
  vanilla: TOKENS.vanilla,
  mocha: TOKENS.mocha,
  hazelnut: TOKENS.hazelnut,
  burgundy: TOKENS.burgundy,
  text: TOKENS.text,
  muted: TOKENS.muted,
} as const;

export const SITE_DESCRIPTION =
  'Romoire is a plant based cappuccino premix made with single origin Arabica, coconut milk and monk fruit. Dairy free, lactose free, vegan friendly and no refined sugar. One sachet, hot water, one minute.';

export const DEFAULT_ABOUT_TEXT =
  'Romoire started on the road — long flights, early mornings, and no dairy free coffee worth drinking. So I built one. 100% Arabica from Chikmagalur, no chicory. Coconut milk for real café body and a proper froth. Monk fruit instead of sugar.';

export const DEFAULT_SERVICES_TEXT =
  'Single origin Arabica, Coconut milk premix, Monk fruit sweetened, Dairy free cappuccino, Single-serve sachets';

export const CONTACT_EMAIL = 'hello@romoire.com';
export const CONTACT_PHONE = '+91 877919 2482';
export const CONTACT_PHONE_TEL = 'tel:+918779192482';
export const CONTACT_EMAIL_MAILTO = 'mailto:hello@romoire.com';
export const CONTACT_WHATSAPP = 'https://wa.me/918779192482';
export const CONTACT_ADDRESS = 'Ravance Ventures LLP, Mumbai 400053';
export const CONTACT_ADDRESS_LINE = 'Ravance Ventures LLP · FSSAI Licence No. 11524998000124 · Mumbai 400053';

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
