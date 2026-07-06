'use client';

import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SITE_NAME } from '@/lib/branding';
import { cn } from '@/lib/utils';

const brandFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

type BrandLogoProps = {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asLink?: boolean;
};

const sizeClasses = {
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-[1.75rem]',
  lg: 'text-3xl md:text-4xl',
};

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  className,
  asLink = true,
}: BrandLogoProps) {
  const isLight = variant === 'light';

  const logo = (
    <span
      className={cn(
        brandFont.className,
        'inline-flex items-baseline font-bold tracking-[-0.04em] leading-none select-none',
        sizeClasses[size],
        className
      )}
    >
      <span className={isLight ? 'text-white' : 'text-[#1e1f44]'}>Rom</span>
      <span className={isLight ? 'text-[#e8c98a]' : 'text-[#bd9245]'}>oire</span>
    </span>
  );

  if (!asLink) return logo;

  return (
    <Link href="/" className="inline-flex items-center" aria-label={SITE_NAME}>
      {logo}
    </Link>
  );
}
