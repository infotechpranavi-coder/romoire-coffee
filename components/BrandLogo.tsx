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
};

const sizeMap = {
  sm: { className: 'h-9 w-9 md:h-10 md:w-10', px: 40 },
  md: { className: 'h-11 w-11 md:h-12 md:w-12', px: 48 },
  lg: { className: 'h-14 w-14 md:h-16 md:w-16', px: 64 },
};

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  className,
  asLink = true,
}: BrandLogoProps) {
  const dims = sizeMap[size];

  const logo = (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 select-none',
        className
      )}
    >
      <span
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full shadow-sm ring-1',
          dims.className,
          variant === 'light' ? 'ring-white/25' : 'ring-[#6B1F2A]/15'
        )}
      >
        <Image
          src={LOGO_SRC}
          alt={SITE_NAME}
          width={dims.px}
          height={dims.px}
          className="h-full w-full object-cover"
          priority
        />
      </span>
      <span
        className={cn(
          'font-serif text-lg font-semibold tracking-[0.08em] uppercase leading-none md:text-xl',
          variant === 'light' ? 'text-white' : 'text-[#6B1F2A]'
        )}
      >
        {SITE_NAME}
      </span>
    </span>
  );

  if (!asLink) return logo;

  return (
    <Link href="/" className="inline-flex items-center" aria-label={SITE_NAME}>
      {logo}
    </Link>
  );
}
