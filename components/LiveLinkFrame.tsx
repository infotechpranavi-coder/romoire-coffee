'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getExternalBlogEmbedSrc } from '@/lib/blogLink';

type LiveLinkFrameProps = {
  url: string;
  title: string;
  variant?: 'compact' | 'full';
};

/** Embeds a pasted https page via same-origin proxy (falls back to direct URL). */
export default function LiveLinkFrame({ url, title, variant = 'full' }: LiveLinkFrameProps) {
  const proxySrc = getExternalBlogEmbedSrc(url) || url;
  const [src, setSrc] = useState(proxySrc);
  const [loading, setLoading] = useState(true);

  const isCompact = variant === 'compact';
  const frameHeight = isCompact ? '420px' : 'calc(100vh - 9rem)';

  useEffect(() => {
    setSrc(getExternalBlogEmbedSrc(url) || url);
    setLoading(true);
  }, [url]);

  return (
    <div className="relative w-full bg-white" style={{ minHeight: isCompact ? 360 : undefined }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#bd9245]" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading live page…
          </p>
        </div>
      )}
      <iframe
        key={src}
        src={src}
        title={title}
        className="w-full border-0 block bg-white"
        style={{ height: frameHeight, minHeight: isCompact ? 360 : 640 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
