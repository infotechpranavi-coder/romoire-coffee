'use client';

import { useEffect, useId, useRef } from 'react';
import { getYoutubeVideoId } from '@/lib/bannerMedia';

type HeroYoutubePlayerProps = {
  youtubeUrl: string;
  isActive: boolean;
  onEnded: () => void;
  poster?: string;
  objectClass: string;
};

let youtubeApiPromise: Promise<void> | null = null;

function loadYoutubeApi() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return youtubeApiPromise;
}

export default function HeroYoutubePlayer({
  youtubeUrl,
  isActive,
  onEnded,
  poster,
  objectClass,
}: HeroYoutubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const onEndedRef = useRef(onEnded);
  const playerId = useId().replace(/:/g, '');

  onEndedRef.current = onEnded;

  useEffect(() => {
    const videoId = getYoutubeVideoId(youtubeUrl);
    if (!videoId || !isActive) {
      playerRef.current?.destroy();
      playerRef.current = null;
      return;
    }

    let cancelled = false;

    loadYoutubeApi().then(() => {
      if (cancelled || !containerRef.current) return;

      playerRef.current?.destroy();
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
        },
        events: {
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onEndedRef.current();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [youtubeUrl, isActive, playerId]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden={!isActive}>
      {poster ? (
        <img
          src={poster}
          alt=""
          className={`absolute inset-0 ${objectClass} transition-opacity duration-700 ${
            isActive ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : null}
      <div
        ref={containerRef}
        id={playerId}
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

declare namespace YT {
  class Player {
    constructor(
      elementId: string | HTMLElement,
      options: {
        videoId?: string;
        playerVars?: Record<string, string | number>;
        events?: {
          onStateChange?: (event: OnStateChangeEvent) => void;
        };
      }
    );
    destroy(): void;
  }

  interface OnStateChangeEvent {
    data: number;
  }

  const PlayerState: {
    ENDED: number;
  };
}
