'use client'

import { useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BannerData } from "@/lib/types";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/branding";
import { getHeroBannerSrcSet, getHeroBannerUrl } from "@/lib/utils";
import { getYoutubeThumbnail } from "@/lib/bannerMedia";
import HeroYoutubePlayer from "@/components/HeroYoutubePlayer";

interface HeroExploreProps {
  initialBanners?: BannerData[];
}

function useHeroImageWidth() {
  const [width, setWidth] = useState(3840);

  useEffect(() => {
    const update = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const viewport = typeof window !== 'undefined' ? window.innerWidth : 1920;
      setWidth(Math.min(3840, Math.max(1920, Math.ceil(viewport * dpr))));
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return width;
}

function getHeroTitle(title: string) {
  const lines = title
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.toUpperCase() !== 'ADVENTURES BEGIN WITH');

  if (lines.length > 0) {
    return lines.join(' ').toUpperCase();
  }

  return SITE_NAME.toUpperCase();
}

function isPlayToEndBanner(banner: BannerData) {
  const mediaType = banner.mediaType || 'image';
  return mediaType === 'video' || mediaType === 'youtube';
}

const HeroExplore = ({ initialBanners }: HeroExploreProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const sectionRef = useRef<HTMLElement>(null);
  const heroWidth = useHeroImageWidth();

  const defaultBanner: BannerData = {
    _id: 'default',
    title: SITE_NAME.toUpperCase(),
    subtitle:
      `Discover freshly roasted specialty coffee beans from ${SITE_NAME} — sourced ethically, roasted in small batches, delivered at peak flavor.`,
    image: {
      url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1920&q=80',
      public_id: 'default-coffee',
      alt: 'Premium coffee beans',
    },
    link: '/packages',
    mediaType: 'image',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [banners, setBanners] = useState<BannerData[]>(initialBanners || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const advanceBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(banners.length, 1));
  }, [banners.length]);

  const handleMediaEnded = useCallback(() => {
    if (banners.length <= 1) return;
    advanceBanner();
  }, [banners.length, advanceBanner]);

  useEffect(() => {
    if (initialBanners && initialBanners.length > 0) {
      return;
    }

    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners?activeOnly=true');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setBanners(data.data);
        } else {
          setBanners([defaultBanner]);
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
        setBanners([defaultBanner]);
      }
    };
    fetchBanners();
  }, [initialBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const current = banners[currentIndex];
    if (current && isPlayToEndBanner(current)) return;

    const interval = setInterval(advanceBanner, 6000);
    return () => clearInterval(interval);
  }, [banners, currentIndex, advanceBanner]);

  const currentBanner = banners[currentIndex] || defaultBanner;
  const heroTitle = getHeroTitle(currentBanner.title);
  const description =
    currentBanner.subtitle?.trim() ||
    `Discover freshly roasted specialty coffee beans from ${SITE_NAME} — sourced ethically, roasted in small batches, delivered at peak flavor.`;

  const handlePrimaryAction = () => {
    if (currentBanner.link) {
      router.push(currentBanner.link);
      return;
    }
    openForm();
  };

  const renderBannerBackground = (banner: BannerData, index: number, isActive: boolean) => {
    const mediaType = banner.mediaType || 'image';
    const visibilityClass = `absolute inset-0 transition-opacity duration-700 ${
      isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
    }`;
    const objectClass =
      'h-full w-full object-cover object-[72%_center] sm:object-[78%_center] lg:object-right';

    if (mediaType === 'youtube' && banner.youtubeUrl) {
      const poster =
        banner.image?.url || getYoutubeThumbnail(banner.youtubeUrl) || undefined;

      return (
        <div key={banner._id} className={`${visibilityClass} overflow-hidden`} aria-hidden={!isActive}>
          <HeroYoutubePlayer
            youtubeUrl={banner.youtubeUrl}
            isActive={isActive}
            onEnded={handleMediaEnded}
            poster={poster}
            objectClass={objectClass}
          />
        </div>
      );
    }

    if (mediaType === 'video' && banner.video?.url) {
      return (
        <video
          key={`${banner._id}-${isActive ? 'active' : 'idle'}`}
          src={banner.video.url}
          className={`${visibilityClass} ${objectClass}`}
          autoPlay={isActive}
          muted
          playsInline
          poster={banner.image?.url}
          aria-hidden={!isActive}
          onEnded={() => {
            if (isActive) handleMediaEnded();
          }}
        />
      );
    }

    if (!banner.image?.url) return null;

    const src = getHeroBannerUrl(banner.image.url, banner.image.public_id, heroWidth);
    const srcSet = getHeroBannerSrcSet(banner.image.url, banner.image.public_id);
    const alt = banner.image.alt || banner.title;

    return (
      <img
        key={banner._id}
        src={src}
        srcSet={srcSet}
        sizes="100vw"
        alt={alt}
        aria-hidden={!isActive}
        className={`${visibilityClass} ${objectClass}`}
        fetchPriority={index === 0 ? 'high' : 'auto'}
        decoding={index === 0 ? 'sync' : 'async'}
      />
    );
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-espresso"
    >
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) =>
          renderBannerBackground(banner, index, index === currentIndex)
        )}
      </div>

      <div className="relative z-20 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-20 lg:pt-36">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-${currentIndex}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <p className="mb-4 font-body text-xs font-medium uppercase tracking-[0.12em] text-vanilla/90 md:text-sm">
                {SITE_TAGLINE}
              </p>
              <h1 className="font-heading text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-cream">
                {heroTitle.charAt(0) + heroTitle.slice(1).toLowerCase()}
              </h1>

              <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-vanilla/90 sm:text-base md:max-w-md">
                {description}
              </p>

              <button
                type="button"
                onClick={handlePrimaryAction}
                className="btn-editorial-dark mt-6 sm:mt-8"
              >
                {currentBanner.link ? 'View Coffee' : 'View Products'}
              </button>
            </motion.div>
          </AnimatePresence>

          {banners.length > 1 && (
            <div className="flex items-center gap-2 sm:pb-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show banner ${i + 1}`}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-10 bg-cream' : 'w-6 bg-cream/35 hover:bg-cream/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroExplore;
