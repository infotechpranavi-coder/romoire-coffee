'use client';

import { useState, useEffect, FormEvent, ReactNode } from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from '@/components/SocialIcons';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { SITE_NAME } from '@/lib/branding';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import { getGroupPageHref } from '@/lib/packageExperienceCategories';
import { useBlogsPageEnabled } from '@/hooks/useBlogsPageEnabled';

const quickLinksBase = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/packages' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
];

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <li>
    <Link
      href={href}
      className="group flex items-center gap-2.5 font-body text-sm text-vanilla/85 transition-colors hover:text-cream"
    >
      <span className="h-1 w-1 shrink-0 rounded-full bg-hazelnut/60 group-hover:bg-cream transition-colors" />
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const { navGroups } = useCategoryLabels();
  const { blogsPageEnabled } = useBlogsPageEnabled();
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState<any>({
    facebookEnabled: true,
    facebookUrl: '',
    instagramEnabled: true,
    instagramUrl: '',
    twitterEnabled: true,
    twitterUrl: '',
    linkedinEnabled: true,
    linkedinUrl: '',
    youtubeEnabled: true,
    youtubeUrl: '',
  });

  const quickLinks = blogsPageEnabled
    ? quickLinksBase
    : quickLinksBase.filter((link) => link.href !== '/blogs');

  const coffeeCollectionLinks = (() => {
    const isSubscribeGroup = (slug?: string, label?: string) => {
      const key = `${slug || ''} ${label || ''}`.toLowerCase();
      return key.includes('subscribe') || key.includes('gift');
    };

    const list = Array.isArray(navGroups) ? navGroups : [];
    const categories = list.filter(
      (group) => group && !isSubscribeGroup(group.slug, group.label)
    );
    const subscribeGroups = list.filter((group) =>
      group && isSubscribeGroup(group.slug, group.label)
    );

    return [...categories, ...subscribeGroups];
  })();


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data) setSettings(data.data);
      } catch (error) {
        console.error('Failed to fetch footer settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail('');
  };

  const socialItems = [
    { key: 'facebook', enabled: settings?.facebookEnabled, url: settings?.facebookUrl, Icon: Facebook },
    { key: 'twitter', enabled: settings?.twitterEnabled, url: settings?.twitterUrl, Icon: Twitter },
    { key: 'instagram', enabled: settings?.instagramEnabled, url: settings?.instagramUrl, Icon: Instagram },
    { key: 'linkedin', enabled: settings?.linkedinEnabled, url: settings?.linkedinUrl, Icon: Linkedin },
  ].filter((item) => item.enabled);

  return (
    <footer id="footer" className="relative overflow-hidden bg-espresso font-body text-vanilla">
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-14 pb-10 md:pt-16 md:pb-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            <div className="space-y-6 lg:pr-10">
              <div>
                <BrandLogo size="md" variant="light" />
              </div>

              <p className="max-w-[16rem] font-heading text-2xl sm:text-3xl leading-[1.25] font-medium text-cream whitespace-pre-line">
                {`Café taste.\nNo dairy.\nNo sugar.`}
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium text-cream">Social Media</p>
                <div className="flex flex-wrap gap-2.5">
                  {socialItems.length > 0 ? (
                    socialItems.map(({ key, url, Icon }) => (
                      <Link
                        key={key}
                        href={url || '#'}
                        target={url ? '_blank' : undefined}
                        rel={url ? 'noopener noreferrer' : undefined}
                        className="flex h-10 w-10 items-center justify-center rounded-sm border border-vanilla/20 text-cream transition-all hover:border-vanilla/40 hover:bg-vanilla/10"
                        aria-label={key}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    ))
                  ) : (
                    [Facebook, Twitter, Instagram].map((Icon, i) => (
                      <span
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-sm border border-vanilla/20 text-cream"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5 lg:border-l lg:border-vanilla/15 lg:pl-10">
              <h4 className="font-heading text-base font-semibold text-cream">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            <div className="space-y-5 lg:border-l lg:border-vanilla/15 lg:pl-10">
              <h4 className="font-heading text-base font-semibold text-cream">Shop our collection</h4>
              <ul className="space-y-3">
                {coffeeCollectionLinks.map((group) => {
                  if (!group?.slug) return null;
                  return (
                    <FooterLink key={group.slug} href={getGroupPageHref(group.slug)}>
                      {group.label || 'Coffee'}
                    </FooterLink>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-5 lg:border-l lg:border-vanilla/15 lg:pl-10">
              <h4 className="font-heading text-base font-semibold leading-snug text-cream">
                join the list
              </h4>
              <p className="text-xs leading-relaxed text-vanilla/70">
                Sign up for early access and offers
              </p>
              <form
                onSubmit={handleNewsletter}
                className="flex overflow-hidden rounded-sm border border-vanilla/20 bg-espresso/50"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 font-body text-sm text-cream placeholder:text-vanilla/50 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center justify-center bg-hazelnut px-5 py-3 font-body text-sm font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-hazelnut/90"
                  aria-label="Join"
                >
                  join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-vanilla/10 py-8">
          <p className="text-center font-body text-sm text-vanilla/80">
            Copyright © {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
