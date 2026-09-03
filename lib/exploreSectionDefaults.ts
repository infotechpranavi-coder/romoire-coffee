export const EXPLORE_SECTION_DEFAULTS = {
  exploreEyebrow: 'TIME TO TRAVEL',
  exploreHeadingLine1: 'EXPLORE',
  exploreHeadingLine2: 'WITH US',
  exploreSubtitle: 'Everything Handled. You Just Show Up.',
  exploreInclusions: [
    '24x7 Concierge Support',
    'Visa Assistance',
    'Packing & Equipment Rental',
    'Comprehensive Travel Insurance Assistance',
    'Airport Pick Up',
    'Centralized Hotel Locations',
    'Vetted Local Partners',
  ],
  exploreCtaLabel: 'Book Now',
  explorePhone: '+91 877919 2482',
  explorePhoneLabel: 'CALL NOW',
} as const;

export function explorePhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export type ExploreSectionContent = {
  exploreEyebrow: string;
  exploreHeadingLine1: string;
  exploreHeadingLine2: string;
  exploreSubtitle: string;
  exploreInclusions: string[];
  exploreCtaLabel: string;
  explorePhone: string;
  explorePhoneLabel: string;
};

export function resolveExploreSectionContent(
  settings?: Partial<ExploreSectionContent> | null
): ExploreSectionContent {
  const inclusions =
    settings?.exploreInclusions && settings.exploreInclusions.length > 0
      ? settings.exploreInclusions.filter((item) => item.trim())
      : [...EXPLORE_SECTION_DEFAULTS.exploreInclusions];

  return {
    exploreEyebrow: settings?.exploreEyebrow?.trim() || EXPLORE_SECTION_DEFAULTS.exploreEyebrow,
    exploreHeadingLine1:
      settings?.exploreHeadingLine1?.trim() || EXPLORE_SECTION_DEFAULTS.exploreHeadingLine1,
    exploreHeadingLine2:
      settings?.exploreHeadingLine2?.trim() || EXPLORE_SECTION_DEFAULTS.exploreHeadingLine2,
    exploreSubtitle: settings?.exploreSubtitle?.trim() || EXPLORE_SECTION_DEFAULTS.exploreSubtitle,
    exploreInclusions: inclusions,
    exploreCtaLabel: settings?.exploreCtaLabel?.trim() || EXPLORE_SECTION_DEFAULTS.exploreCtaLabel,
    explorePhone: settings?.explorePhone?.trim() || EXPLORE_SECTION_DEFAULTS.explorePhone,
    explorePhoneLabel:
      settings?.explorePhoneLabel?.trim() || EXPLORE_SECTION_DEFAULTS.explorePhoneLabel,
  };
}
