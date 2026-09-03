'use client';

import { useEffect, useState } from 'react';
import { COFFEE_IMAGES, resolveCoffeeImage } from '@/lib/coffeeImages';

interface CategoryHeroBackgroundProps {
  src?: string | null;
  alt: string;
  gradientClass: string;
}

export default function CategoryHeroBackground({
  src,
  alt,
  gradientClass,
}: CategoryHeroBackgroundProps) {
  const resolved = resolveCoffeeImage(src) || COFFEE_IMAGES.hero;
  const [currentSrc, setCurrentSrc] = useState(resolved);

  useEffect(() => {
    setCurrentSrc(resolved);
  }, [resolved]);

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden bg-espresso">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="sync"
          fetchPriority="high"
          onError={() => {
            if (currentSrc !== COFFEE_IMAGES.hero) {
              setCurrentSrc(COFFEE_IMAGES.hero);
            }
          }}
        />
      </div>
      <div className={`absolute inset-0 z-[1] bg-gradient-to-br ${gradientClass}`} />
      <div className="absolute inset-0 z-[1] bg-espresso/55" />
    </>
  );
}
