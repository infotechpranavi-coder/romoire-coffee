'use client';

import { useState, useEffect, FormEvent, ReactNode } from 'react';
import { ArrowUpRight, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BrandLogo from '@/components/BrandLogo';
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/branding';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import { getGroupPageHref } from '@/lib/packageExperienceCategories';

const FOOTER_BG =
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=80';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Shop Coffee', href: '/packages' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
];

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <li>
    <Link
      href={href}
      className="group flex items-center gap-2.5 text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B1F2A]/35 group-hover:bg-[#6B1F2A] transition-colors" />
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const { navGroups } = useCategoryLabels();
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
    <footer className="relative overflow-hidden font-inter">
      {/* Forest background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={FOOTER_BG}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE6] via-[#F5EFE6]/95 via-55% to-[#6B1F2A]/40" />
      </div>

      <div className="relative z-10">
        {/* Main columns */}
        <div className="container mx-auto px-4 pt-14 pb-10 md:pt-16 md:pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
            {/* Brand + social */}
            <div className="lg:pr-10 space-y-6">
              <div>
                <BrandLogo size="md" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B1F2A] mt-2 pl-0.5">{SITE_TAGLINE}</p>
              </div>

              <p className="text-sm leading-relaxed text-gray-600 max-w-xs">
                {SITE_DESCRIPTION.split('.')[0]}.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-900">Social Media:</p>
                <div className="flex flex-wrap gap-2.5">
                  {socialItems.length > 0 ? (
                    socialItems.map(({ key, url, Icon }) => (
                      <Link
                        key={key}
                        href={url || '#'}
                        target={url ? '_blank' : undefined}
                        rel={url ? 'noopener noreferrer' : undefined}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition-all hover:border-[#E8DFD0] hover:bg-[#f4f7ef]"
                        aria-label={key}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    ))
                  ) : (
                    <>
                      {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                        <span
                          key={i}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="lg:border-l lg:border-gray-200 lg:pl-10 space-y-5">
              <h4 className="text-base font-bold text-gray-900">quick links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Experience categories */}
            <div className="lg:border-l lg:border-gray-200 lg:pl-10 space-y-5">
              <h4 className="text-base font-bold text-gray-900">Coffee Collections</h4>
              <ul className="space-y-3">
                {navGroups.map((group) => (
                  <FooterLink key={group.slug} href={getGroupPageHref(group.slug)}>
                    {group.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:border-l lg:border-gray-200 lg:pl-10 space-y-5">
              <h4 className="text-base font-bold text-gray-900 leading-snug">
                Subscribe To Our Newsletter
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                * Sign up for new roasts, brewing tips, and exclusive offers.
              </p>
              <form onSubmit={handleNewsletter} className="flex overflow-hidden rounded-full border border-gray-200 bg-gray-50/80 shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address *"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center justify-center bg-[#6B1F2A] px-4 transition-colors hover:bg-[#6B1F2A] hover:text-white"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight className="h-5 w-5 text-gray-900" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright on forest */}
        <div className="relative py-10 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <p className="relative text-center text-sm font-medium text-white/95 tracking-wide">
            Copyright © {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
