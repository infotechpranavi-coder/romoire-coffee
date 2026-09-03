'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface FormTermsConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  error?: boolean;
}

export default function FormTermsConsent({
  checked,
  onCheckedChange,
  id = 'terms-consent',
  className,
  error,
}: FormTermsConsentProps) {
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border border-gray-100 bg-[#faf8f3] p-3.5 sm:p-4', className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className={cn('mt-0.5 border-[#bd9245] data-[state=checked]:bg-[#bd9245]', error && 'border-red-500')}
      />
      <label htmlFor={id} className="text-xs sm:text-sm text-gray-600 leading-relaxed cursor-pointer select-none">
        I have read and agree to the Explore360{' '}
        <Link
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#bd9245] underline underline-offset-2 hover:text-[#a07835]"
          onClick={(e) => e.stopPropagation()}
        >
          Terms & Conditions, Disclaimer and Privacy Policy
        </Link>
        . I understand that Explore360 acts as a booking facilitator for experiences operated by independent
        third-party service providers, and that the applicable activity-specific terms and safety guidelines will
        be shared prior to booking.
      </label>
    </div>
  );
}
