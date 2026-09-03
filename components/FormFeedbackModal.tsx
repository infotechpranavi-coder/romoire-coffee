'use client';

import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FeedbackType = 'success' | 'error';

interface FormFeedbackModalProps {
  open: boolean;
  type: FeedbackType;
  title: string;
  message: string;
  onClose: () => void;
}

const styles: Record<
  FeedbackType,
  { icon: typeof CheckCircle2; iconWrap: string; iconColor: string; accent: string }
> = {
  success: {
    icon: CheckCircle2,
    iconWrap: 'bg-emerald-50 ring-emerald-100',
    iconColor: 'text-emerald-500',
    accent: 'bg-[#111827] hover:bg-[#bd9245]',
  },
  error: {
    icon: AlertCircle,
    iconWrap: 'bg-red-50 ring-red-100',
    iconColor: 'text-red-500',
    accent: 'bg-red-600 hover:bg-red-700',
  },
};

export default function FormFeedbackModal({
  open,
  type,
  title,
  message,
  onClose,
}: FormFeedbackModalProps) {
  if (!open) return null;

  const Icon = styles[type].icon;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close feedback"
        className="absolute inset-0 bg-[#0a2233]/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-[0_30px_80px_rgba(10,34,51,0.35)] animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#bd9245] via-[#d4ad6a] to-[#111827]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 pb-8 pt-10 text-center">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-8 ${styles[type].iconWrap}`}
          >
            <Icon className={`h-10 w-10 ${styles[type].iconColor}`} strokeWidth={2.2} />
          </div>

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#bd9245]">
            {type === 'success' ? 'Inquiry Received' : 'Something Went Wrong'}
          </p>

          <h3
            id="feedback-title"
            className="mb-3 text-2xl font-black uppercase tracking-tight text-[#111827]"
          >
            {title}
          </h3>

          <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
            {message}
          </p>

          <Button
            type="button"
            onClick={onClose}
            className={`h-12 w-full rounded-2xl text-xs font-black uppercase tracking-[0.22em] text-white shadow-lg transition-all ${styles[type].accent}`}
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
