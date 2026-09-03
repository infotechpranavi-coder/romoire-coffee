import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  dark = false,
  className,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={cn('mb-10 md:mb-14 max-w-3xl', alignClass, className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 font-body text-xs font-medium uppercase tracking-[0.12em] md:text-sm',
            dark ? 'text-vanilla' : 'text-mocha'
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-heading text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]',
          dark ? 'text-cream' : 'text-espresso'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 font-body text-sm leading-relaxed md:text-base',
            dark ? 'text-vanilla/85' : 'text-muted'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
