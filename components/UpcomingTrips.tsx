'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Loader2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import { useInquiryForm } from '@/contexts/InquiryFormContext';
import {
  COFFEE_CATEGORY_TABS,
  NEW_ARRIVALS_SEED_PRODUCTS,
  DEFAULT_COFFEE_IMAGE,
  CoffeeTabKey,
  NewArrivalProduct,
  formatCoffeePriceRange,
  mapPackageToProduct,
} from '@/data/newArrivalsData';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
});

const generateSlug = (title: string, id: string) =>
  `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;

function useVisibleSlides() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else setCount(3);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

function ProductCard({
  product,
  onView,
}: {
  product: NewArrivalProduct;
  onView: () => void;
}) {
  const [imageSrc, setImageSrc] = useState(product.image || DEFAULT_COFFEE_IMAGE);

  useEffect(() => {
    setImageSrc(product.image || DEFAULT_COFFEE_IMAGE);
  }, [product.image]);

  return (
    <article className="group h-full px-3 sm:px-4">
      <button
        type="button"
        onClick={onView}
        className="block w-full text-center"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#EEEEEE]">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03] sm:p-8"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageSrc(DEFAULT_COFFEE_IMAGE)}
          />
        </div>

        <div className="mt-5 px-2">
          <h3
            className={`${playfair.className} text-xl font-normal leading-snug text-black md:text-2xl`}
          >
            {product.title}
          </h3>
          <p className="mt-2 text-sm font-normal tracking-wide text-gray-600">
            {formatCoffeePriceRange(product.price)}
          </p>
        </div>
      </button>
    </article>
  );
}

interface UpcomingTripsProps {
  initialProducts?: NewArrivalProduct[];
}

const UpcomingTrips = ({ initialProducts }: UpcomingTripsProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const visibleSlides = useVisibleSlides();
  const [products, setProducts] = useState<NewArrivalProduct[]>(
    initialProducts?.length ? initialProducts : NEW_ARRIVALS_SEED_PRODUCTS
  );
  const [activeTab, setActiveTab] = useState<CoffeeTabKey>('all');
  const [loading, setLoading] = useState(!initialProducts?.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async (seedIfEmpty = false) => {
      try {
        const response = await fetch('/api/packages?featuredTrip=true', { cache: 'no-store' });
        const result = await response.json();

        if (cancelled) return;

        if (result.success && result.data?.length) {
          setProducts(result.data.map((pkg: Parameters<typeof mapPackageToProduct>[0], i: number) => mapPackageToProduct(pkg, i)));
          return;
        }

        if (seedIfEmpty) {
          await fetch('/api/packages/seed-coffee', { method: 'POST' });
          const retry = await fetch('/api/packages?featuredTrip=true', { cache: 'no-store' });
          const retryResult = await retry.json();
          if (!cancelled && retryResult.success && retryResult.data?.length) {
            setProducts(retryResult.data.map((pkg: Parameters<typeof mapPackageToProduct>[0], i: number) => mapPackageToProduct(pkg, i)));
            return;
          }
        }

        if (!cancelled) setProducts(NEW_ARRIVALS_SEED_PRODUCTS);
      } catch (error) {
        console.error('Error loading new arrivals:', error);
        if (!cancelled) setProducts(NEW_ARRIVALS_SEED_PRODUCTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (initialProducts?.length) {
      setLoading(false);
      return;
    }

    loadProducts(true);
    return () => {
      cancelled = true;
    };
  }, [initialProducts]);

  const displayProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    return products.filter((p) => p.coffeeType === activeTab);
  }, [products, activeTab]);

  const slideCount = displayProducts.length;
  const maxIndex = Math.max(0, slideCount - visibleSlides);
  const canCarousel = slideCount > visibleSlides;

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab, visibleSlides]);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (!canCarousel) return;
      setCurrentIndex(((index % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1));
    },
    [canCarousel, maxIndex]
  );

  useEffect(() => {
    if (paused || !canCarousel) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, canCarousel, maxIndex]);

  const handleView = (product: NewArrivalProduct) => {
    if (!product.id.startsWith('seed-')) {
      router.push(`/packages/${generateSlug(product.title, product.id)}`);
      return;
    }
    openForm({
      type: 'Package',
      title: product.title,
      category: product.packageCategory,
    });
  };

  const slideBasis = 100 / visibleSlides;

  return (
    <section id="trips" className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative mb-10 text-center md:mb-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#bd9245] md:text-base">
            Choose your coffee
          </p>
          <div className="relative inline-block">
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[5rem] font-black uppercase leading-none tracking-tighter text-gray-200/80 sm:text-[7rem] md:text-[9rem]"
              aria-hidden
            >
              Products
            </span>
            <h2 className="relative text-4xl font-black tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              New Arrivals
            </h2>
          </div>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 md:text-base">
            Upcoming roasts and freshly listed beans — shop single origins, green coffee, and blends.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 md:mb-10">
          {COFFEE_CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all md:px-6 md:text-base ${
                activeTab === tab.key
                  ? 'bg-[#1e1f44] text-white shadow-md'
                  : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-[#bd9245]/40 hover:text-[#bd9245]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#bd9245]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Loading new arrivals...
            </p>
          </div>
        ) : (
          <>
            {canCarousel && (
              <div className="mb-8 flex items-center justify-center gap-3 md:mb-10">
                <button
                  type="button"
                  onClick={() => goTo(currentIndex - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-[#bd9245] hover:text-[#bd9245]"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i === currentIndex ? 'bg-[#bd9245]' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-[#bd9245] hover:text-[#bd9245]"
                  aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                >
                  <Pause className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(currentIndex + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-[#bd9245] hover:text-[#bd9245]"
                  aria-label="Next product"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mx-auto max-w-5xl overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * slideBasis}%)`,
                }}
              >
                {displayProducts.map((product) => (
                  <div
                    key={product.id}
                    className="shrink-0"
                    style={{ flexBasis: `${slideBasis}%` }}
                  >
                    <ProductCard
                      product={product}
                      onView={() => handleView(product)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                href="/packages/category/new-arrivals"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-[#bd9245] bg-white px-10 py-3.5 text-sm font-bold uppercase tracking-wide text-[#bd9245] transition-all hover:bg-[#bd9245] hover:text-white hover:shadow-lg hover:shadow-[#bd9245]/20"
              >
                View all products
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UpcomingTrips;
