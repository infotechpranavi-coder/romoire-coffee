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
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import {
  DEFAULT_COFFEE_IMAGE,
  NewArrivalProduct,
  formatCoffeePriceRange,
  mapPackageToProduct,
} from '@/data/newArrivalsData';
import { getGroupPageHref } from '@/lib/packageExperienceCategories';
import { isCustomGroup } from '@/lib/categoryCatalog';

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
  const gallery = useMemo(() => {
    const list = product.images?.length
      ? product.images
      : [product.image || DEFAULT_COFFEE_IMAGE];
    return list.filter(Boolean);
  }, [product.images, product.image]);

  const [activeImage, setActiveImage] = useState(0);
  const [broken, setBroken] = useState(false);
  const hasMultiple = gallery.length > 1;
  const imageSrc = broken
    ? DEFAULT_COFFEE_IMAGE
    : gallery[activeImage] || gallery[0] || DEFAULT_COFFEE_IMAGE;

  useEffect(() => {
    setActiveImage(0);
    setBroken(false);
  }, [product.id]);

  useEffect(() => {
    if (gallery.length <= 1) return;
    const timer = setInterval(() => {
      setBroken(false);
      setActiveImage((prev) => (prev + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [gallery.length, product.id]);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBroken(false);
    setActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBroken(false);
    setActiveImage((prev) => (prev + 1) % gallery.length);
  };

  return (
    <article className="group h-full px-3 sm:px-4">
      <div className="w-full text-center">
        <div className="relative aspect-square w-full overflow-hidden bg-vanilla/40">
          <Image
            src={imageSrc}
            alt={`${product.title}${hasMultiple ? ` — image ${activeImage + 1}` : ''}`}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03] sm:p-8"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setBroken(true)}
          />

          <button
            type="button"
            onClick={onView}
            className="absolute inset-0 z-[1]"
            aria-label={`View ${product.title}`}
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-espresso opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-espresso opacity-100 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {hasMultiple && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {gallery.map((_, i) => (
              <button
                key={`${product.id}-dot-${i}`}
                type="button"
                onClick={() => {
                  setBroken(false);
                  setActiveImage(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeImage ? 'w-5 bg-hazelnut' : 'w-1.5 bg-vanilla hover:bg-mocha/40'
                }`}
                aria-label={`Show image ${i + 1}`}
              />
            ))}
          </div>
        )}

        <button type="button" onClick={onView} className="mt-4 w-full px-2">
          <h3
            className={`${playfair.className} text-xl font-normal leading-snug text-espresso md:text-2xl`}
          >
            {product.title}
          </h3>
          <p className="mt-2 text-sm font-normal tracking-wide text-mocha/80">
            {formatCoffeePriceRange(product.price)}
          </p>
        </button>
      </div>
    </article>
  );
}

interface UpcomingTripsProps {
  initialProducts?: NewArrivalProduct[];
}

const UpcomingTrips = ({ initialProducts }: UpcomingTripsProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const { navGroups, catalog, getCategoryByValue } = useCategoryLabels();
  const visibleSlides = useVisibleSlides();
  const [products, setProducts] = useState<NewArrivalProduct[]>(initialProducts ?? []);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(!initialProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const userMainCategories = useMemo(
    () => navGroups.filter((group) => isCustomGroup(group.slug, catalog)),
    [navGroups, catalog]
  );

  const categoryTabs = useMemo(
    () => [
      { key: 'all', label: 'All' },
      ...userMainCategories.map((group) => ({ key: group.slug, label: group.label })),
    ],
    [userMainCategories]
  );

  const resolveGroupSlug = useCallback(
    (packageCategory?: string, existing?: string) => {
      if (existing) return existing;
      if (!packageCategory) return undefined;
      return getCategoryByValue(packageCategory)?.group;
    },
    [getCategoryByValue]
  );

  const productsWithGroup = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        groupSlug: resolveGroupSlug(product.packageCategory, product.groupSlug),
      })),
    [products, resolveGroupSlug]
  );

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const response = await fetch('/api/packages?featuredTrip=true', { cache: 'no-store' });
        const result = await response.json();

        if (cancelled) return;

        if (result.success && result.data?.length) {
          setProducts(
            result.data.map((pkg: Parameters<typeof mapPackageToProduct>[0], i: number) =>
              mapPackageToProduct(pkg, i)
            )
          );
          return;
        }

        if (!cancelled) setProducts([]);
      } catch (error) {
        console.error('Error loading new arrivals:', error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (initialProducts) {
      setLoading(false);
      return;
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [initialProducts]);

  useEffect(() => {
    if (activeTab !== 'all' && !userMainCategories.some((group) => group.slug === activeTab)) {
      setActiveTab('all');
    }
  }, [userMainCategories, activeTab]);

  const displayProducts = useMemo(() => {
    if (activeTab === 'all') return productsWithGroup;
    return productsWithGroup.filter((p) => p.groupSlug === activeTab);
  }, [productsWithGroup, activeTab]);

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

  const viewAllHref = activeTab === 'all' ? '/packages' : getGroupPageHref(activeTab);
  const slideBasis = 100 / visibleSlides;

  return (
    <section id="trips" className="bg-cream py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative mb-10 text-center md:mb-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-hazelnut md:text-base">
            Choose your coffee
          </p>
          <div className="relative inline-block">
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[5rem] font-black uppercase leading-none tracking-tighter text-vanilla sm:text-[7rem] md:text-[9rem]"
              aria-hidden
            >
              Products
            </span>
            <h2 className="relative text-4xl font-black tracking-tight text-espresso sm:text-5xl md:text-6xl">
              New Arrivals
            </h2>
          </div>
          <p className="mx-auto mt-3 max-w-xl text-sm text-mocha/70 md:text-base">
            Upcoming roasts and freshly listed beans — browse by main category.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 md:mb-10">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all md:px-6 md:text-base ${
                activeTab === tab.key
                  ? 'bg-espresso text-white shadow-md'
                  : 'bg-cream text-mocha ring-1 ring-vanilla hover:ring-hazelnut/40 hover:text-hazelnut'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-hazelnut" />
            <p className="text-xs font-semibold uppercase tracking-widest text-mocha/70">
              Loading new arrivals...
            </p>
          </div>
        ) : displayProducts.length === 0 ? (
          <p className="py-12 text-center text-sm text-mocha/70">
            No new arrivals in this category yet.
          </p>
        ) : (
          <>
            {canCarousel && (
              <div className="mb-8 flex items-center justify-center gap-3 md:mb-10">
                <button
                  type="button"
                  onClick={() => goTo(currentIndex - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-vanilla text-mocha transition-colors hover:border-hazelnut hover:text-hazelnut"
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
                        i === currentIndex ? 'bg-hazelnut' : 'bg-vanilla hover:bg-mocha/30'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-vanilla text-mocha transition-colors hover:border-hazelnut hover:text-hazelnut"
                  aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                >
                  <Pause className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(currentIndex + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-vanilla text-mocha transition-colors hover:border-hazelnut hover:text-hazelnut"
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
                href={viewAllHref}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-hazelnut bg-cream px-10 py-3.5 text-sm font-bold uppercase tracking-wide text-hazelnut transition-all hover:bg-hazelnut hover:text-white hover:shadow-lg hover:shadow-hazelnut/20"
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
