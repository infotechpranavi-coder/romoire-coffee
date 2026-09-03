'use client';

import Image from 'next/image';
import { BOTANICAL_IMAGE } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface BotanicalDecorationProps {
  position?: Position;
  className?: string;
  /** 0.08–0.25 recommended */
  opacity?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const positionClasses: Record<Position, string> = {
  'top-left': 'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
  'top-right': 'top-0 right-0 translate-x-1/4 -translate-y-1/4',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
  'bottom-right': 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

const sizeClasses = {
  sm: 'h-32 w-32 md:h-40 md:w-40',
  md: 'h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80',
  lg: 'h-64 w-64 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem]',
};

export default function BotanicalDecoration({
  position = 'top-right',
  className,
  opacity = 0.15,
  size = 'md',
  variant = 'light',
}: BotanicalDecorationProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-0 select-none',
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      aria-hidden
    >
      <Image
        src={BOTANICAL_IMAGE}
        alt=""
        fill
        className={cn(
          'object-contain',
          variant === 'dark' && 'brightness-0 invert opacity-90'
        )}
        style={{ opacity: variant === 'dark' ? opacity * 1.2 : opacity }}
        sizes="(max-width: 768px) 200px, 400px"
      />
    </div>
  );
}
