import { TOKENS } from './design-tokens';

export const SITE_NAME = 'Romoire';
export const SITE_TAGLINE = 'Cafe style coffee Anywhere you are';
export const LOGO_SRC = '/20260812_Romoire_Logo-01-removebg-preview.png';

/** Brand palette — Coconut Variant */
export const BRAND = {
  espresso: TOKENS.espresso,
  vanilla: TOKENS.vanilla,
  mocha: TOKENS.mocha,
  hazelnut: TOKENS.hazelnut,
  cream: TOKENS.cream,
  burgundy: TOKENS.burgundy,
  text: TOKENS.text,
  muted: TOKENS.muted,
} as const;

export const SITE_DESCRIPTION =
  'Romoire sources and roasts premium coffee beans from the world\'s finest growing regions. Discover single-origin lots, signature blends, and fresh roasts delivered to your door.';

export const DEFAULT_ABOUT_TEXT = `${SITE_NAME} is a specialty coffee roaster dedicated to sourcing exceptional beans, roasting in small batches, and delivering peak freshness with every bag.`;

export const DEFAULT_SERVICES_TEXT =
  'Single-origin beans, Signature blends, Espresso roasts, Whole bean & ground options, Wholesale & subscriptions';

export const CONTACT_EMAIL = 'hello@romoire.coffee';
export const CONTACT_PHONE = '+91 877919 2482';
export const CONTACT_PHONE_TEL = 'tel:+918779192482';
export const CONTACT_EMAIL_MAILTO = 'mailto:hello@romoire.coffee';
export const CONTACT_WHATSAPP = 'https://wa.me/918779192482';
export const CONTACT_ADDRESS = 'Navi Mumbai, Maharashtra 400706';
export const CONTACT_ADDRESS_LINE = 'Head Office — Navi Mumbai, Maharashtra 400706';

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
