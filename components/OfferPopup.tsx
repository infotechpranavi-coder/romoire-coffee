'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

const DISMISS_STORAGE_KEY = 'skygo_offer_popup_dismissed_at';

function isPopupConfigured(settings: SiteSettings) {
  return Boolean(settings.offerPopupEnabled && settings.offerPopupImageUrl?.trim());
}

export default function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedulePopup = useCallback(
    (popupSettings: SiteSettings) => {
      clearTimer();
      if (!isPopupConfigured(popupSettings)) return;

      const initialDelayMs = Math.max(0, popupSettings.offerPopupInitialDelaySeconds ?? 3) * 1000;
      const repeatMs = Math.max(10, popupSettings.offerPopupRepeatIntervalSeconds ?? 320) * 1000;

      const dismissedRaw = localStorage.getItem(DISMISS_STORAGE_KEY);
      const dismissedAt = dismissedRaw ? Number(dismissedRaw) : null;

      // First visit: wait "Show After". After a dismissal: wait out the rest
      // of "Repeat After" (or "Show After" again if it already elapsed).
      let delayMs = initialDelayMs;
      if (dismissedAt) {
        const remainingMs = repeatMs - (Date.now() - dismissedAt);
        delayMs = remainingMs > 0 ? remainingMs : initialDelayMs;
      }

      timerRef.current = setTimeout(() => setOpen(true), delayMs);
    },
    [clearTimer]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && data.success && data.data) {
          setSettings(data.data);
          schedulePopup(data.data);
        }
      } catch (error) {
        console.error('Failed to load offer popup settings:', error);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [clearTimer, schedulePopup]);

  const handleClose = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    setOpen(false);
    clearTimer();

    if (settings && isPopupConfigured(settings)) {
      const repeatMs = Math.max(10, settings.offerPopupRepeatIntervalSeconds ?? 320) * 1000;
      timerRef.current = setTimeout(() => setOpen(true), repeatMs);
    }
  };

  if (!open || !settings?.offerPopupImageUrl) return null;

  const isSquare = settings.offerPopupAspectRatio === 'square';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Close offer popup"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/20 bg-[#0b1220] shadow-2xl animate-in fade-in zoom-in-95 duration-300',
          isSquare ? 'max-w-[520px]' : 'max-w-[960px]'
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 sm:right-5 sm:top-5 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={cn(
            'relative w-full bg-[#0b1220]',
            isSquare ? 'aspect-square' : 'aspect-video'
          )}
        >
          <Image
            src={settings.offerPopupImageUrl}
            alt={settings.offerPopupTitle || 'Special offer'}
            fill
            className="object-contain"
            sizes={isSquare ? '(max-width: 520px) 100vw, 520px' : '(max-width: 960px) 100vw, 960px'}
          />

          {(settings.offerPopupTitle?.trim() || settings.offerPopupSubtitle?.trim()) && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 sm:p-8">
              {settings.offerPopupSubtitle?.trim() ? (
                <span className="mb-2 sm:mb-3 inline-flex rounded-full bg-[#bd9245] px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg">
                  {settings.offerPopupSubtitle}
                </span>
              ) : null}
              {settings.offerPopupTitle?.trim() ? (
                <h2
                  className={cn(
                    'font-black uppercase leading-tight tracking-tight text-white',
                    isSquare ? 'text-xl sm:text-2xl' : 'text-xl sm:text-3xl md:text-4xl'
                  )}
                >
                  {settings.offerPopupTitle}
                </h2>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
