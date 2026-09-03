import { SITE_NAME } from './branding';
import { COFFEE_IMAGES } from './coffeeImages';

export interface PackageMiniCategory {
  slug: string;
  label: string;
  value: string;
  href: string;
  subcategorySlug: string;
  groupSlug: string;
}

export interface PackageExperienceCategory {
  value: string;
  label: string;
  slug: string;
  href: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  emptyMessage: string;
  accent: 'amber' | 'orange' | 'blue' | 'green' | 'teal' | 'cyan' | 'violet';
  group: string;
  isFuture?: boolean;
  legacyValues?: string[];
  miniItems?: PackageMiniCategory[];
}

export interface PackageNavGroup {
  label: string;
  slug: string;
  items: PackageExperienceCategory[];
}

export const CATEGORY_IMAGES = {
  'ethiopian-yirgacheffe': COFFEE_IMAGES.beans,
  'colombian-supremo': COFFEE_IMAGES.beansDark,
  'brazilian-santos': COFFEE_IMAGES.latte,
  'kenyan-aa': COFFEE_IMAGES.cup,
  'light-roast': COFFEE_IMAGES.cup,
  'medium-roast': COFFEE_IMAGES.beansDark,
  'dark-roast': COFFEE_IMAGES.latte,
  'espresso-roast': COFFEE_IMAGES.espresso,
  'house-blend': COFFEE_IMAGES.pour,
  'breakfast-blend': COFFEE_IMAGES.shop,
  'signature-blend': COFFEE_IMAGES.brew,
  'decaf-swiss-water': COFFEE_IMAGES.latte,
  'cold-brew-blend': COFFEE_IMAGES.coldBrew,
  'limited-edition': COFFEE_IMAGES.beans,
  'monthly-subscription': COFFEE_IMAGES.beansDark,
  'gift-sets': COFFEE_IMAGES.beansDark,
  'new-arrivals': COFFEE_IMAGES.cup,
} as const;

export const GROUP_HERO_IMAGES: Record<string, string> = {
  'single-origin': CATEGORY_IMAGES['ethiopian-yirgacheffe'],
  roasts: CATEGORY_IMAGES['medium-roast'],
  blends: CATEGORY_IMAGES['house-blend'],
  specialty: CATEGORY_IMAGES['decaf-swiss-water'],
  subscribe: CATEGORY_IMAGES['monthly-subscription'],
};

const img = (slug: keyof typeof CATEGORY_IMAGES) => CATEGORY_IMAGES[slug];

export const PACKAGE_NAV_GROUPS: PackageNavGroup[] = [
  {
    label: 'Single Origin',
    slug: 'single-origin',
    items: [
      {
        value: 'Ethiopian Yirgacheffe',
        label: 'Ethiopian Yirgacheffe',
        slug: 'ethiopian-yirgacheffe',
        href: '/packages/category/ethiopian-yirgacheffe',
        heroTitle: 'Ethiopian Yirgacheffe',
        heroSubtitle: 'Bright floral notes with bergamot, jasmine, and a tea-like finish — washed process, high altitude',
        heroImage: img('ethiopian-yirgacheffe'),
        emptyMessage: 'No Ethiopian Yirgacheffe beans in stock yet',
        accent: 'amber',
        group: 'single-origin',
        legacyValues: ['Yachts & Sailing Cruises', 'Kayaking Boat Rides'],
      },
      {
        value: 'Colombian Supremo',
        label: 'Colombian Supremo',
        slug: 'colombian-supremo',
        href: '/packages/category/colombian-supremo',
        heroTitle: 'Colombian Supremo',
        heroSubtitle: 'Balanced caramel sweetness, red apple acidity, and a smooth chocolate body',
        heroImage: img('colombian-supremo'),
        emptyMessage: 'No Colombian Supremo beans in stock yet',
        accent: 'orange',
        group: 'single-origin',
        legacyValues: ['White water & rapids rafting', 'Sailing School'],
      },
      {
        value: 'Brazilian Santos',
        label: 'Brazilian Santos',
        slug: 'brazilian-santos',
        href: '/packages/category/brazilian-santos',
        heroTitle: 'Brazilian Santos',
        heroSubtitle: 'Nutty, low-acid profile with cocoa and toasted hazelnut — ideal for espresso bases',
        heroImage: img('brazilian-santos'),
        emptyMessage: 'No Brazilian Santos beans in stock yet',
        accent: 'green',
        group: 'single-origin',
      },
      {
        value: 'Kenyan AA',
        label: 'Kenyan AA',
        slug: 'kenyan-aa',
        href: '/packages/category/kenyan-aa',
        heroTitle: 'Kenyan AA',
        heroSubtitle: 'Bold blackcurrant and citrus brightness with a wine-like, complex finish',
        heroImage: img('kenyan-aa'),
        emptyMessage: 'No Kenyan AA beans in stock yet',
        accent: 'teal',
        group: 'single-origin',
      },
    ],
  },
  {
    label: 'Roast Profiles',
    slug: 'roasts',
    items: [
      {
        value: 'Light Roast',
        label: 'Light Roast',
        slug: 'light-roast',
        href: '/packages/category/light-roast',
        heroTitle: 'Light Roast',
        heroSubtitle: 'Preserves origin character — bright, fruity, and aromatic with delicate sweetness',
        heroImage: img('light-roast'),
        emptyMessage: 'No light roast coffees available yet',
        accent: 'cyan',
        group: 'roasts',
        legacyValues: ['Helicopter Rides', 'Paragliding'],
      },
      {
        value: 'Medium Roast',
        label: 'Medium Roast',
        slug: 'medium-roast',
        href: '/packages/category/medium-roast',
        heroTitle: 'Medium Roast',
        heroSubtitle: 'The everyday sweet spot — balanced body, gentle acidity, and crowd-pleasing flavor',
        heroImage: img('medium-roast'),
        emptyMessage: 'No medium roast coffees available yet',
        accent: 'amber',
        group: 'roasts',
      },
      {
        value: 'Dark Roast',
        label: 'Dark Roast',
        slug: 'dark-roast',
        href: '/packages/category/dark-roast',
        heroTitle: 'Dark Roast',
        heroSubtitle: 'Rich, smoky depth with bold chocolate and caramel — full-bodied and intense',
        heroImage: img('dark-roast'),
        emptyMessage: 'No dark roast coffees available yet',
        accent: 'orange',
        group: 'roasts',
        legacyValues: ['Bungee Jumping'],
      },
      {
        value: 'Espresso Roast',
        label: 'Espresso Roast',
        slug: 'espresso-roast',
        href: '/packages/category/espresso-roast',
        heroTitle: 'Espresso Roast',
        heroSubtitle: 'Dialled for crema and sweetness — dense body built for espresso machines and moka pots',
        heroImage: img('espresso-roast'),
        emptyMessage: 'No espresso roasts available yet',
        accent: 'violet',
        group: 'roasts',
      },
    ],
  },
  {
    label: 'Blends',
    slug: 'blends',
    items: [
      {
        value: 'House Blend',
        label: 'House Blend',
        slug: 'house-blend',
        href: '/packages/category/house-blend',
        heroTitle: 'House Blend',
        heroSubtitle: `${SITE_NAME}'s signature everyday cup — smooth, versatile, and roasted fresh weekly`,
        heroImage: img('house-blend'),
        emptyMessage: 'No house blend coffees available yet',
        accent: 'amber',
        group: 'blends',
        legacyValues: ['Bike Expeditions By Destination'],
      },
      {
        value: 'Breakfast Blend',
        label: 'Breakfast Blend',
        slug: 'breakfast-blend',
        href: '/packages/category/breakfast-blend',
        heroTitle: 'Breakfast Blend',
        heroSubtitle: 'Mild and mellow to start your morning — gentle acidity with a clean, easy finish',
        heroImage: img('breakfast-blend'),
        emptyMessage: 'No breakfast blend coffees available yet',
        accent: 'green',
        group: 'blends',
      },
      {
        value: 'Signature Blend',
        label: 'Signature Blend',
        slug: 'signature-blend',
        href: '/packages/category/signature-blend',
        heroTitle: 'Signature Blend',
        heroSubtitle: 'Our roaster\'s pick — layered complexity for pour-over, French press, and drip',
        heroImage: img('signature-blend'),
        emptyMessage: 'No signature blend coffees available yet',
        accent: 'teal',
        group: 'blends',
      },
    ],
  },
  {
    label: 'Specialty',
    slug: 'specialty',
    items: [
      {
        value: 'Decaf Swiss Water',
        label: 'Decaf — Swiss Water',
        slug: 'decaf-swiss-water',
        href: '/packages/category/decaf-swiss-water',
        heroTitle: 'Decaf — Swiss Water Process',
        heroSubtitle: 'Chemical-free decaffeination that keeps origin flavor intact — sleep-friendly, taste-forward',
        heroImage: img('decaf-swiss-water'),
        emptyMessage: 'No decaf coffees available yet',
        accent: 'blue',
        group: 'specialty',
      },
      {
        value: 'Cold Brew Blend',
        label: 'Cold Brew Blend',
        slug: 'cold-brew-blend',
        href: '/packages/category/cold-brew-blend',
        heroTitle: 'Cold Brew Blend',
        heroSubtitle: 'Coarse-ground and roasted for slow extraction — chocolatey, smooth, and low bitterness',
        heroImage: img('cold-brew-blend'),
        emptyMessage: 'No cold brew blends available yet',
        accent: 'cyan',
        group: 'specialty',
      },
      {
        value: 'Limited Edition',
        label: 'Limited Edition',
        slug: 'limited-edition',
        href: '/packages/category/limited-edition',
        heroTitle: 'Limited Edition',
        heroSubtitle: 'Small-lot microlots and seasonal releases — when they\'re gone, they\'re gone',
        heroImage: img('limited-edition'),
        emptyMessage: 'No limited edition coffees right now',
        accent: 'violet',
        group: 'specialty',
        isFuture: false,
      },
    ],
  },
  {
    label: 'Subscribe & Gifts',
    slug: 'subscribe',
    items: [
      {
        value: 'Monthly Subscription',
        label: 'Monthly Subscription',
        slug: 'monthly-subscription',
        href: '/packages/category/monthly-subscription',
        heroTitle: 'Monthly Subscription',
        heroSubtitle: `Fresh-roasted beans delivered every month — curated by ${SITE_NAME}'s roasting team`,
        heroImage: img('monthly-subscription'),
        emptyMessage: 'Subscription plans coming soon',
        accent: 'amber',
        group: 'subscribe',
        legacyValues: ['Upcoming Tours', 'Upcoming Rides'],
      },
      {
        value: 'Gift Sets',
        label: 'Gift Sets',
        slug: 'gift-sets',
        href: '/packages/category/gift-sets',
        heroTitle: 'Gift Sets',
        heroSubtitle: 'Curated coffee gift boxes for birthdays, holidays, and corporate gifting',
        heroImage: img('gift-sets'),
        emptyMessage: 'No gift sets available yet',
        accent: 'orange',
        group: 'subscribe',
      },
      {
        value: 'New Arrivals',
        label: 'New Arrivals',
        slug: 'new-arrivals',
        href: '/packages/category/new-arrivals',
        heroTitle: 'New Arrivals',
        heroSubtitle: 'Just landed from the roastery — explore our latest beans and seasonal releases',
        heroImage: img('new-arrivals'),
        emptyMessage: 'No new arrivals this week',
        accent: 'green',
        group: 'subscribe',
      },
    ],
  },
];

export const PACKAGE_EXPERIENCE_CATEGORIES: PackageExperienceCategory[] =
  PACKAGE_NAV_GROUPS.flatMap((group) => group.items);

export const PACKAGE_EXPERIENCE_CATEGORY_VALUES = PACKAGE_EXPERIENCE_CATEGORIES.map(
  (category) => category.value
);

export const BUILTIN_GROUP_PAGE_SLUGS = new Set([
  'single-origin',
  'roasts',
  'blends',
  'specialty',
  'subscribe',
]);

export function getGroupPageHref(groupSlug: string): string {
  return BUILTIN_GROUP_PAGE_SLUGS.has(groupSlug)
    ? `/packages/group/${groupSlug}`
    : `/packages/group/${groupSlug}`;
}

export function getNavGroupLabel(groupSlug: string) {
  return PACKAGE_NAV_GROUPS.find((group) => group.slug === groupSlug)?.label ?? 'Coffee';
}

export function getCategoryBySlug(slug: string) {
  return PACKAGE_EXPERIENCE_CATEGORIES.find((category) => category.slug === slug);
}

export function getCategoryByValue(value: string | undefined) {
  if (!value) return undefined;
  return PACKAGE_EXPERIENCE_CATEGORIES.find(
    (category) =>
      category.value.toLowerCase() === value.toLowerCase() ||
      category.legacyValues?.some((legacy) => legacy.toLowerCase() === value.toLowerCase())
  );
}

export function getCategoryHeroImage(categoryValue: string | undefined) {
  return getCategoryByValue(categoryValue)?.heroImage ?? CATEGORY_IMAGES['colombian-supremo'];
}

export function getCategoryImageForSlug(slug: string) {
  return CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES] ?? CATEGORY_IMAGES['colombian-supremo'];
}

export function buildPackageImageForCategory(categoryValue: string, title?: string) {
  const category = getCategoryByValue(categoryValue);
  const url = category?.heroImage ?? CATEGORY_IMAGES['colombian-supremo'];
  return {
    public_id: `pkg-${category?.slug ?? 'coffee'}`,
    url,
    alt: title || category?.label || `${SITE_NAME} coffee`,
  };
}

export function packageMatchesExperienceCategory(
  packageCategory: string | undefined,
  category: PackageExperienceCategory
) {
  if (!packageCategory) return false;
  const values = getCategoryMatchValues(category);
  return values.some((value) => value.toLowerCase() === packageCategory.toLowerCase());
}

export function getCategoryMatchValues(category: PackageExperienceCategory): string[] {
  return [category.value, ...(category.legacyValues || [])];
}

/** MongoDB filter for packages in a category slug */
export function buildCategoryFilter(categorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const values = getCategoryMatchValues(category);

  return {
    $or: values.map((value) => ({
      packageCategory: { $regex: new RegExp(`^${escapeRegex(value)}$`, 'i') },
    })),
  };
}

/** MongoDB filter for all packages in a nav group */
export function buildGroupFilter(groupSlug: string) {
  const group = PACKAGE_NAV_GROUPS.find((g) => g.slug === groupSlug);
  if (!group) return null;

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const clauses = group.items.flatMap((category) =>
    getCategoryMatchValues(category).map((value) => ({
      packageCategory: { $regex: new RegExp(`^${escapeRegex(value)}$`, 'i') },
    }))
  );

  return { $or: clauses };
}

export function getNavGroupForCategory(categoryValue: string | undefined) {
  const category = getCategoryByValue(categoryValue);
  if (category) {
    return PACKAGE_NAV_GROUPS.find((group) => group.slug === category.group) ?? PACKAGE_NAV_GROUPS[0];
  }
  return (
    PACKAGE_NAV_GROUPS.find((group) =>
      group.items.some((item) => item.value.toLowerCase() === categoryValue?.toLowerCase())
    ) ?? PACKAGE_NAV_GROUPS[0]
  );
}

export function packageMatchesNavGroup(
  packageCategory: string | undefined,
  groupSlug: string
) {
  const group = PACKAGE_NAV_GROUPS.find((g) => g.slug === groupSlug);
  if (!group || !packageCategory) return false;
  return group.items.some((cat) => packageMatchesExperienceCategory(packageCategory, cat));
}

export const accentStyles = {
  amber: {
    gradient: 'from-amber-950/80 via-amber-900/70 to-espresso/75',
    badge: 'from-amber-500 to-amber-600',
    button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    outline: 'border-amber-500 text-amber-600 hover:bg-amber-50',
    ring: 'hover:border-amber-500/20',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    cta: 'from-amber-600 via-amber-500 to-amber-600',
    ctaHover: 'hover:text-amber-600',
    muted: 'text-amber-600',
    spinner: 'border-amber-600',
    emptyBg: 'bg-amber-50',
    emptyIcon: 'text-amber-400',
    focusRing: 'focus:ring-amber-500/30',
  },
  orange: {
    gradient: 'from-orange-900/70 via-orange-800/60 to-orange-900/70',
    badge: 'from-orange-500 to-orange-600',
    button: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    outline: 'border-orange-500 text-orange-600 hover:bg-orange-50',
    ring: 'hover:border-orange-500/20',
    icon: 'text-orange-400',
    iconBg: 'bg-orange-500/20',
    cta: 'from-orange-600 via-orange-500 to-orange-600',
    ctaHover: 'hover:text-orange-600',
    muted: 'text-orange-600',
    spinner: 'border-orange-600',
    emptyBg: 'bg-orange-50',
    emptyIcon: 'text-orange-400',
    focusRing: 'focus:ring-orange-500/30',
  },
  blue: {
    gradient: 'from-blue-900/70 via-blue-800/60 to-blue-900/70',
    badge: 'from-blue-500 to-blue-600',
    button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    outline: 'border-blue-500 text-blue-600 hover:bg-blue-50',
    ring: 'hover:border-blue-500/20',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    cta: 'from-blue-600 via-blue-500 to-blue-600',
    ctaHover: 'hover:text-blue-600',
    muted: 'text-blue-600',
    spinner: 'border-blue-600',
    emptyBg: 'bg-blue-50',
    emptyIcon: 'text-blue-400',
    focusRing: 'focus:ring-blue-500/30',
  },
  green: {
    gradient: 'from-green-900/70 via-green-800/60 to-green-900/70',
    badge: 'from-green-500 to-green-600',
    button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    outline: 'border-green-500 text-green-600 hover:bg-green-50',
    ring: 'hover:border-green-500/20',
    icon: 'text-green-400',
    iconBg: 'bg-green-500/20',
    cta: 'from-green-600 via-green-500 to-green-600',
    ctaHover: 'hover:text-green-600',
    muted: 'text-green-600',
    spinner: 'border-green-600',
    emptyBg: 'bg-green-50',
    emptyIcon: 'text-green-400',
    focusRing: 'focus:ring-green-500/30',
  },
  teal: {
    gradient: 'from-teal-950/75 via-cyan-950/65 to-teal-950/75',
    badge: 'from-teal-500 to-cyan-600',
    button: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700',
    outline: 'border-teal-500 text-teal-600 hover:bg-teal-50',
    ring: 'hover:border-teal-500/25',
    icon: 'text-teal-300',
    iconBg: 'bg-teal-500/20',
    cta: 'from-teal-600 via-cyan-500 to-teal-600',
    ctaHover: 'hover:text-teal-600',
    muted: 'text-teal-600',
    spinner: 'border-teal-600',
    emptyBg: 'bg-teal-50',
    emptyIcon: 'text-teal-400',
    focusRing: 'focus:ring-teal-500/30',
  },
  cyan: {
    gradient: 'from-cyan-900/75 via-sky-900/60 to-cyan-900/75',
    badge: 'from-cyan-500 to-sky-600',
    button: 'bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700',
    outline: 'border-cyan-500 text-cyan-600 hover:bg-cyan-50',
    ring: 'hover:border-cyan-500/25',
    icon: 'text-cyan-300',
    iconBg: 'bg-cyan-500/20',
    cta: 'from-cyan-600 via-sky-500 to-cyan-600',
    ctaHover: 'hover:text-cyan-600',
    muted: 'text-cyan-600',
    spinner: 'border-cyan-600',
    emptyBg: 'bg-cyan-50',
    emptyIcon: 'text-cyan-400',
    focusRing: 'focus:ring-cyan-500/30',
  },
  violet: {
    gradient: 'from-violet-900/75 via-indigo-900/60 to-violet-900/75',
    badge: 'from-violet-500 to-indigo-600',
    button: 'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700',
    outline: 'border-violet-500 text-violet-600 hover:bg-violet-50',
    ring: 'hover:border-violet-500/25',
    icon: 'text-violet-300',
    iconBg: 'bg-violet-500/20',
    cta: 'from-violet-600 via-indigo-500 to-violet-600',
    ctaHover: 'hover:text-violet-600',
    muted: 'text-violet-600',
    spinner: 'border-violet-600',
    emptyBg: 'bg-violet-50',
    emptyIcon: 'text-violet-400',
    focusRing: 'focus:ring-violet-500/30',
  },
} as const;
