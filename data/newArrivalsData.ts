import { PACKAGE_EXPERIENCE_CATEGORIES } from '@/lib/packageExperienceCategories';
import {
  COFFEE_IMAGES,
  DEFAULT_COFFEE_IMAGE,
  resolveCoffeeImage,
} from '@/lib/coffeeImages';

export type CoffeeTabKey = 'all' | 'green' | 'roasted' | 'blends';

export const COFFEE_CATEGORY_TABS: { key: CoffeeTabKey; label: string }[] = [
  { key: 'all', label: 'Coffee' },
  { key: 'green', label: 'Green Coffee' },
  { key: 'roasted', label: 'Roasted Coffee' },
  { key: 'blends', label: 'Blends' },
];

export interface NewArrivalProduct {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  /** All product images for card gallery */
  images: string[];
  coffeeType: CoffeeTabKey;
  packageCategory?: string;
  /** Main category slug from Category Management (e.g. single-origin, blends) */
  groupSlug?: string;
}

export { DEFAULT_COFFEE_IMAGE };

/** Homepage seed products — shown when DB has no featured arrivals yet */
export const NEW_ARRIVALS_SEED_PRODUCTS: NewArrivalProduct[] = [
  {
    id: 'seed-ethiopian',
    title: 'Ethiopian Yirgacheffe',
    subtitle: 'Bright floral notes with bergamot and jasmine — washed process, light-medium roast.',
    price: 18,
    image: COFFEE_IMAGES.beans,
    images: [COFFEE_IMAGES.beans],
    coffeeType: 'roasted',
    packageCategory: 'Ethiopian Yirgacheffe',
  },
  {
    id: 'seed-colombian-green',
    title: 'Colombian Green Beans',
    subtitle: 'Unroasted supremo beans — ideal for home roasters seeking caramel sweetness.',
    price: 22,
    image: COFFEE_IMAGES.beansDark,
    images: [COFFEE_IMAGES.beansDark],
    coffeeType: 'green',
    packageCategory: 'Colombian Supremo',
  },
  {
    id: 'seed-house-blend',
    title: 'House Blend',
    subtitle: 'Balanced everyday cup with chocolate body and gentle sweetness — whole bean.',
    price: 16,
    image: COFFEE_IMAGES.pour,
    images: [COFFEE_IMAGES.pour],
    coffeeType: 'blends',
    packageCategory: 'House Blend',
  },
  {
    id: 'seed-espresso',
    title: 'Espresso Roast',
    subtitle: 'Dense crema, bold sweetness — roasted for espresso machines and moka pots.',
    price: 15,
    image: COFFEE_IMAGES.espresso,
    images: [COFFEE_IMAGES.espresso],
    coffeeType: 'roasted',
    packageCategory: 'Espresso Roast',
  },
  {
    id: 'seed-kenyan',
    title: 'Kenyan AA',
    subtitle: 'Wine-like blackcurrant acidity with a complex, bright finish.',
    price: 19,
    image: COFFEE_IMAGES.cup,
    images: [COFFEE_IMAGES.cup],
    coffeeType: 'roasted',
    packageCategory: 'Kenyan AA',
  },
  {
    id: 'seed-brazil-green',
    title: 'Brazilian Santos Green',
    subtitle: 'Raw santos beans with nutty profile — perfect base for dark roasts.',
    price: 20,
    image: COFFEE_IMAGES.latte,
    images: [COFFEE_IMAGES.latte],
    coffeeType: 'green',
    packageCategory: 'Brazilian Santos',
  },
  {
    id: 'seed-signature',
    title: 'Signature Blend',
    subtitle: 'Layered complexity for pour-over and French press — roaster\'s choice.',
    price: 17,
    image: COFFEE_IMAGES.brew,
    images: [COFFEE_IMAGES.brew],
    coffeeType: 'blends',
    packageCategory: 'Signature Blend',
  },
  {
    id: 'seed-breakfast',
    title: 'Breakfast Blend',
    subtitle: 'Mild and mellow morning roast with a clean, easy finish.',
    price: 14,
    image: COFFEE_IMAGES.shop,
    images: [COFFEE_IMAGES.shop],
    coffeeType: 'blends',
    packageCategory: 'Breakfast Blend',
  },
];

export function inferCoffeeType(packageCategory?: string): CoffeeTabKey {
  if (!packageCategory) return 'all';
  const cat = packageCategory.toLowerCase();
  if (cat.includes('green') || cat.includes('raw') || cat.includes('unroasted')) return 'green';
  if (
    cat.includes('blend') ||
    cat.includes('house') ||
    cat.includes('breakfast') ||
    cat.includes('signature')
  ) {
    return 'blends';
  }
  if (
    cat.includes('roast') ||
    cat.includes('espresso') ||
    cat.includes('ethiopian') ||
    cat.includes('colombian') ||
    cat.includes('kenyan') ||
    cat.includes('brazilian') ||
    cat.includes('origin') ||
    cat.includes('light') ||
    cat.includes('medium') ||
    cat.includes('dark')
  ) {
    return 'roasted';
  }
  return 'all';
}

export function mapPackageToProduct(pkg: {
  _id: string;
  title: string;
  subtitle?: string;
  about?: string;
  price?: number;
  packageCategory?: string;
  images?: Array<{ url: string }>;
}, index = 0): NewArrivalProduct {
  const category = pkg.packageCategory ?? '';
  const catalog = PACKAGE_EXPERIENCE_CATEGORIES.find(
    (c) => c.value.toLowerCase() === category.toLowerCase()
  );

  const mappedImages = (pkg.images ?? [])
    .map((img) => img?.url)
    .filter((url): url is string => Boolean(url))
    .map((url, i) => resolveCoffeeImage(url, index + i));

  const fallback = resolveCoffeeImage(catalog?.heroImage, index);
  const images = mappedImages.length ? mappedImages : [fallback];
  const image = images[0] || DEFAULT_COFFEE_IMAGE;

  return {
    id: pkg._id,
    title: pkg.title,
    subtitle: pkg.subtitle || pkg.about?.slice(0, 120) || 'Premium specialty coffee from Romoire.',
    price: pkg.price && pkg.price < 500 ? pkg.price : 16,
    image,
    images,
    coffeeType: inferCoffeeType(category),
    packageCategory: category,
    groupSlug: catalog?.group,
  };
}

export function formatCoffeePrice(_price?: number) {
  return 'Coming soon';
}

export function formatCoffeePriceRange(_price?: number) {
  return 'Coming soon';
}
