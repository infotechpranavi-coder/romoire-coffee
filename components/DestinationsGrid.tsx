'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Heart,
  Sprout,
  Globe2,
  ShieldCheck,
  Minus,
  Plus,
  Pause,
} from 'lucide-react';
import { SITE_NAME } from '@/lib/branding';
import { COFFEE_IMAGES, resolveCoffeeImage } from '@/lib/coffeeImages';
import { DEFAULT_COFFEE_IMAGE } from '@/data/newArrivalsData';
import { PackageData } from '@/lib/types';
import { useInquiryForm } from '@/contexts/InquiryFormContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const BADGES = [
  { icon: Leaf, label: 'ORGANIC' },
  { icon: Heart, label: 'FAIR TRADE' },
  { icon: Sprout, label: 'FRESH ROASTED' },
  { icon: Globe2, label: 'SINGLE ORIGIN' },
  { icon: ShieldCheck, label: 'ETHICALLY SOURCED' },
] as const;

interface OriginProduct {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  price: number;
  originalPrice?: number;
  roasts: string[];
  sizes: string[];
  grinds: string[];
}

const generateSlug = (title: string, id: string) =>
  `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;

const FALLBACK_ORIGINS: OriginProduct[] = [
  {
    id: 'origin-ethiopian',
    title: 'Ethiopian Yirgacheffe',
    subtitle: 'Bright floral notes with bergamot and jasmine — washed process, light-medium roast.',
    image: COFFEE_IMAGES.beans,
    link: '/packages/category/ethiopian-yirgacheffe',
    price: 18,
    originalPrice: 22,
    roasts: ['Light', 'Medium'],
    sizes: ['250g', '500g', '1kg'],
    grinds: ['Whole Bean', 'Ground'],
  },
  {
    id: 'origin-colombian',
    title: 'Colombian Supremo',
    subtitle: 'Caramel sweetness with a smooth chocolate body — perfect for pour-over and drip.',
    image: COFFEE_IMAGES.beansDark,
    link: '/packages/category/colombian-supremo',
    price: 16,
    originalPrice: 20,
    roasts: ['Medium', 'Dark'],
    sizes: ['250g', '500g', '1kg'],
    grinds: ['Whole Bean', 'Ground'],
  },
  {
    id: 'origin-kenyan',
    title: 'Kenyan AA',
    subtitle: 'Wine-like blackcurrant acidity with a complex, bright finish.',
    image: COFFEE_IMAGES.cup,
    link: '/packages/category/kenyan-aa',
    price: 19,
    sizes: ['250g', '500g'],
    roasts: ['Light', 'Medium'],
    grinds: ['Whole Bean', 'Ground'],
  },
  {
    id: 'origin-house',
    title: 'House Blend',
    subtitle: `${SITE_NAME}'s signature everyday roast — balanced, versatile, and crowd-pleasing.`,
    image: COFFEE_IMAGES.pour,
    link: '/packages/category/house-blend',
    price: 14,
    originalPrice: 18,
    roasts: ['Medium'],
    sizes: ['250g', '500g', '1kg'],
    grinds: ['Whole Bean', 'Ground'],
  },
];

function mapPackageToOrigin(pkg: PackageData, index = 0): OriginProduct {
  const price = pkg.price && pkg.price < 500 ? pkg.price : 16;
  return {
    id: pkg._id,
    title: pkg.title,
    subtitle: pkg.subtitle || pkg.about?.slice(0, 140) || 'Premium single-origin coffee from Romoire.',
    image: resolveCoffeeImage(pkg.images?.[0]?.url, index),
    link: `/packages/${generateSlug(pkg.title, pkg._id)}`,
    price,
    originalPrice: price < 20 ? Math.round(price * 1.2) : undefined,
    roasts: ['Light', 'Medium', 'Dark'],
    sizes: ['250g', '500g', '1kg'],
    grinds: ['Whole Bean', 'Ground'],
  };
}

function OptionPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-mocha">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              value === opt
                ? 'border-hazelnut bg-hazelnut text-white'
                : 'border-vanilla bg-cream text-mocha hover:border-hazelnut/50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

const DestinationsGrid = () => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08 });
  const [products, setProducts] = useState<OriginProduct[]>(FALLBACK_ORIGINS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [roast, setRoast] = useState('');
  const [size, setSize] = useState('');
  const [grind, setGrind] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageSrc, setImageSrc] = useState(FALLBACK_ORIGINS[0].image);

  const product = products[currentIndex] ?? products[0];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/packages?featured=true', { cache: 'no-store' });
        const result = await res.json();
        if (result.success && result.data?.length) {
          const mapped = (result.data as PackageData[]).map((pkg, i) => mapPackageToOrigin(pkg, i));
          setProducts(mapped.length ? mapped : FALLBACK_ORIGINS);
        }
      } catch (e) {
        console.error('Error fetching origins:', e);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!product) return;
    setRoast(product.roasts[0] ?? 'Medium');
    setSize(product.sizes[0] ?? '250g');
    setGrind(product.grinds[0] ?? 'Whole Bean');
    setQuantity(1);
    setImageSrc(product.image);
  }, [product?.id, currentIndex]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + products.length) % products.length);
    },
    [products.length]
  );

  useEffect(() => {
    if (paused || products.length <= 1) return;
    const timer = setInterval(() => goTo(currentIndex + 1), 6000);
    return () => clearInterval(timer);
  }, [paused, currentIndex, goTo, products.length]);

  const handleOrder = (buyNow = false) => {
    openForm({
      type: 'Package',
      title: `${product.title} — ${roast}, ${size}, ${grind}${buyNow ? ' (Buy Now)' : ''}`,
      referenceId: product.id.startsWith('origin-') ? undefined : product.id,
      duration: `${quantity} × ${size}`,
    });
    if (buyNow && !product.id.startsWith('origin-')) {
      router.push(product.link);
    }
  };

  if (!product) return null;

  const hasSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <section id="destinations" ref={ref} className="bg-cream py-10 md:py-12 lg:py-14">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2 className="mb-5 text-center text-3xl font-black tracking-tight text-hazelnut sm:text-4xl md:mb-6">
          ORIGINS
        </h2>

        {/* Carousel controls */}
        <div className="mb-5 flex items-center justify-center gap-3 md:mb-6">
          <button
            type="button"
            onClick={() => goTo(currentIndex - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-vanilla text-mocha/80 transition-colors hover:border-hazelnut hover:text-hazelnut"
            aria-label="Previous origin"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {products.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-hazelnut' : 'bg-vanilla hover:bg-mocha/30'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-vanilla text-mocha/80 transition-colors hover:border-hazelnut hover:text-hazelnut"
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
          >
            <Pause className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-vanilla text-mocha/80 transition-colors hover:border-hazelnut hover:text-hazelnut"
            aria-label="Next origin"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Certification badges */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8">
          {BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-hazelnut bg-cream shadow-sm md:h-12 md:w-12">
                <Icon className="h-5 w-5 text-hazelnut md:h-5 md:w-5" strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-mocha/80 md:text-[10px]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="mx-auto mb-6 max-w-xl text-center text-xs leading-relaxed text-mocha/70 md:mb-8 md:text-sm">
          Discover exceptional single-origin coffees from the world&apos;s finest growing regions.
          No compromise on taste, ethics, or freshness — roasted in small batches by {SITE_NAME}.
        </p>

        {/* Product showcase */}
        <div
          className={`mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-8 lg:items-center transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Left — product image */}
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-cream shadow-sm lg:max-w-none">
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 1024px) 90vw, 420px"
              onError={() => setImageSrc(DEFAULT_COFFEE_IMAGE)}
            />
          </div>

          {/* Right — product details */}
          <div className="flex flex-col">
            <h3
              className="mb-2 text-2xl font-semibold leading-tight text-hazelnut md:text-3xl"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {product.title}
            </h3>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xl font-medium text-hazelnut md:text-2xl">
                Coming soon
              </span>
            </div>

            <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-mocha/70 md:text-sm">
              {product.subtitle}
            </p>

            <div className="mb-4 space-y-3">
              <OptionPills label="Roast" options={product.roasts} value={roast} onChange={setRoast} />
              <OptionPills label="Size" options={product.sizes} value={size} onChange={setSize} />
              <OptionPills label="Grind" options={product.grinds} value={grind} onChange={setGrind} />
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <p className="mb-1.5 text-xs font-medium text-mocha">Quantity</p>
              <div className="inline-flex items-center rounded-full border border-vanilla bg-cream">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center text-mocha/80 hover:text-hazelnut"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[2rem] text-center text-base font-semibold text-espresso">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center text-mocha/80 hover:text-hazelnut"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => handleOrder(false)}
                className="flex-1 rounded-full border-2 border-hazelnut bg-cream py-2.5 text-xs font-bold text-hazelnut transition-colors hover:bg-hazelnut/5 md:text-sm"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => handleOrder(true)}
                className="flex-1 rounded-full bg-hazelnut py-2.5 text-xs font-bold text-white transition-colors hover:bg-espresso md:text-sm"
              >
                Buy it now
              </button>
            </div>

            <Link
              href={product.link}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-mocha/80 underline-offset-4 hover:text-hazelnut hover:underline"
            >
              View full details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
