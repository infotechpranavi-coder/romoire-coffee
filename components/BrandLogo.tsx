'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LOGO_SRC, SITE_NAME, SITE_TAGLINE } from '@/lib/branding';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asLink?: boolean;
  showWordmark?: boolean;
  showTagline?: boolean;
};

const sizeMap = {
  sm: { box: 'h-10 w-10', px: 40, text: 'text-base md:text-lg', tag: 'text-[9px] md:text-[10px]' },
  md: { box: 'h-14 w-14 md:h-16 md:w-16', px: 72, text: 'text-lg md:text-xl', tag: 'text-[10px] md:text-[11px]' },
  lg: { box: 'h-16 w-16 md:h-20 md:w-20', px: 80, text: 'text-xl md:text-2xl', tag: 'text-xs md:text-sm' },
};

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  className,
  asLink = true,
  showWordmark = true,
  showTagline = false,
}: BrandLogoProps) {
  const dims = sizeMap[size];
  const isLight = variant === 'light';

  const logo = (
    <span className={cn('inline-flex items-center gap-3 select-none', className)}>
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-visible rounded-full',
          dims.box,
          isLight ? 'bg-transparent' : 'bg-espresso p-1.5 shadow-sm'
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
      {(showWordmark || (showTagline && SITE_TAGLINE)) && (
        <span className="flex min-w-0 flex-col items-start justify-center gap-0.5">
          {showWordmark && (
            <span
              className={cn(
                'font-heading font-semibold tracking-[0.12em] uppercase leading-none',
                dims.text,
                isLight ? 'text-white' : 'text-hazelnut'
              )}
            >
              {SITE_NAME}
            </span>
          )}
          {showTagline && SITE_TAGLINE && (
            <span
              className={cn(
                'font-body font-medium leading-tight tracking-[0.02em]',
                dims.tag,
                isLight ? 'text-vanilla/90' : 'text-mocha'
              )}
            >
              {SITE_TAGLINE}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!asLink) return logo;

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center overflow-visible"
      aria-label={SITE_TAGLINE ? `${SITE_NAME} — ${SITE_TAGLINE}` : SITE_NAME}
    >
      {logo}
    </Link>
  );
}
