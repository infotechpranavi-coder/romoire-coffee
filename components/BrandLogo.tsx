'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LOGO_SRC, SITE_NAME } from '@/lib/branding';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asLink?: boolean;
  showWordmark?: boolean;
};

const sizeMap = {
  sm: { box: 'h-10 w-10', px: 40, text: 'text-base md:text-lg' },
  md: { box: 'h-14 w-14 md:h-16 md:w-16', px: 72, text: 'text-lg md:text-xl' },
  lg: { box: 'h-16 w-16 md:h-20 md:w-20', px: 80, text: 'text-xl md:text-2xl' },
};

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  className,
  asLink = true,
  showWordmark = true,
}: BrandLogoProps) {
  const dims = sizeMap[size];
  const isLight = variant === 'light';

  const logo = (
    <span className={cn('inline-flex items-center gap-3 select-none', className)}>
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-visible rounded-full',
          dims.box,
          // Cream logo needs a burgundy disc on light nav; transparent over dark hero
          isLight ? 'bg-transparent' : 'bg-[#6B1F2A] p-1.5 shadow-sm'
        )}
      >
        <Image
          src={LOGO_SRC}
          alt={SITE_NAME}
          width={dims.px}
          height={dims.px}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            'font-serif font-semibold tracking-[0.12em] uppercase leading-none',
            dims.text,
            isLight ? 'text-white' : 'text-[#6B1F2A]'
          )}
        >
          {SITE_NAME}
        </span>
      )}
    </span>
  );

  if (!asLink) return logo;

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center overflow-visible"
      aria-label={SITE_NAME}
    >
      {logo}
    </Link>
  );
}
