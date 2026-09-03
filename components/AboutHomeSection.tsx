'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store, Truck, Clock } from 'lucide-react';
import { Great_Vibes } from 'next/font/google';
import { SITE_NAME } from '@/lib/branding';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const signatureFont = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
});

const iconClass = 'h-12 w-12 text-vanilla stroke-[1.25] md:h-14 md:w-14';

function CoffeeBeansIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <ellipse cx="18" cy="22" rx="7" ry="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 14c0 4 3 6 3 8s-3 4-3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="30" cy="26" rx="7" ry="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 18c0 4 3 6 3 8s-3 4-3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="24" cy="14" rx="5" ry="7" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
    </svg>
  );
}

function EspressoMachineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <rect x="10" y="16" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 22h12M14 28h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M38 24h4v6h-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 10h12v6H18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M22 38h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const features = [
  {
    Icon: CoffeeBeansIcon,
    title: 'The best World sorts',
    description:
      'Premium single-origin and blended beans sourced from renowned farms across Ethiopia, Colombia, Brazil, and beyond.',
  },
  {
    Icon: Store,
    title: 'Many points of sale',
    description:
      'Browse online or visit our partner cafés and retail locations — fresh Romoire coffee wherever you are.',
  },
  {
    Icon: EspressoMachineIcon,
    title: 'Professional baristas',
    description:
      'Our roasting team brings years of craft and cupping expertise to every batch we produce.',
  },
  {
    Icon: ({ className }: { className?: string }) => (
      <div className={`relative ${className}`}>
        <Truck className="h-11 w-11 text-vanilla stroke-[1.25] md:h-12 md:w-12" />
        <Clock className="absolute -right-1 -bottom-1 h-5 w-5 text-vanilla stroke-[1.5]" />
      </div>
    ),
    title: '24/7 fast delivery',
    description:
      'Orders roasted fresh and shipped quickly — peak flavor delivered straight to your door.',
  },
];

const AboutHomeSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-espresso py-16 md:py-20"
    >
      <div className="container relative z-10 mx-auto w-full px-4 py-8 md:py-12">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24"
          initial={{ opacity: 0, y: 28 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Left — about copy */}
          <motion.div
            className="max-w-xl lg:max-w-lg xl:max-w-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="mb-5 font-body text-sm font-medium uppercase tracking-[0.12em] text-vanilla md:mb-6 md:text-base">
              Who we are
            </p>
            <h2 className="mb-8 font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-cream">
              About {SITE_NAME}
            </h2>
            <p className="mb-8 font-body text-base leading-[1.9] text-vanilla/80 md:mb-10 md:text-lg lg:text-xl">
              Coffee is a brewed drink prepared from roasted beans, which are the seeds of berries from the Coffea
              plant. The genus Coffea is native to tropical Africa and Madagascar, the Comoros, Mauritius, and Réunion
              in the Indian Ocean. At {SITE_NAME}, we select only the finest lots, roast in small batches, and deliver
              every bag at peak freshness.
            </p>
            <p className={`${signatureFont.className} mb-8 text-5xl text-cream md:mb-10 md:text-6xl lg:text-7xl`}>
              {SITE_NAME}
            </p>
            <Link href="/about" className="btn-editorial-dark inline-flex">
              Read More
            </Link>
          </motion.div>

          {/* Right — 2×2 feature grid */}
          <motion.div
            className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:gap-x-12 lg:gap-y-16"
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {features.map((feature) => (
              <div key={feature.title} className="space-y-5">
                <feature.Icon className={iconClass} />
                <h3 className="font-heading text-xl font-semibold text-cream md:text-2xl">{feature.title}</h3>
                <p className="font-body text-base leading-[1.8] text-vanilla/75 md:text-lg">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHomeSection;
