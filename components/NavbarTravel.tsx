'use client'

import { useState, useEffect } from "react";
import { Search, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import BrandLogo from "@/components/BrandLogo";
import { PACKAGE_NAV_GROUPS, getGroupPageHref } from "@/lib/packageExperienceCategories";
import { useCategoryLabels } from "@/contexts/CategoryLabelsContext";

type NavSubItem = { name: string; href: string; isFuture?: boolean };
type NavItem = {
  name: string;
  href: string;
  submenu?: NavSubItem[];
  packageGroups?: typeof PACKAGE_NAV_GROUPS;
};

const groupHoverStyles: Record<string, string> = {
  'single-origin': 'bg-vanilla/60 text-espresso',
  roasts: 'bg-hazelnut/15 text-hazelnut',
  blends: 'bg-mocha/15 text-mocha',
  specialty: 'bg-vanilla/40 text-mocha',
  subscribe: 'bg-vanilla/50 text-espresso',
};

const NavbarTravel = () => {
  const { navGroups } = useCategoryLabels();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [hoveredPackageGroup, setHoveredPackageGroup] = useState<string | null>(null);
  const [hoveredPackageSub, setHoveredPackageSub] = useState<string | null>(null);
  const [contactHovered, setContactHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { openForm } = useInquiryForm();

  const isBlogDetail = Boolean(pathname?.startsWith('/blogs/') && pathname !== '/blogs');
  // Keep a solid, high-contrast nav on every page including home.
  const useSolidNav = true;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Products',
      href: '/packages',
      packageGroups: navGroups,
    },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Gallery', href: '/gallery' },
  ];

  const isActive = (href: string, submenu?: NavSubItem[], packageGroups?: typeof PACKAGE_NAV_GROUPS) => {
    if (href === '/') return pathname === '/';
    if (packageGroups?.length) {
      const groupHrefs = packageGroups.flatMap((group) => [
        getGroupPageHref(group.slug),
        ...(group.items?.flatMap((item) => [
          item.href,
          ...(item.miniItems?.map((mini) => mini.href) ?? []),
        ]) ?? []),
      ]);
      return (
        pathname === href ||
        pathname?.startsWith(`${href}/`) ||
        groupHrefs.some((itemHref) => pathname === itemHref || pathname?.startsWith(`${itemHref}/`))
      );
    }
    if (submenu?.length) {
      return (
        pathname === href ||
        pathname?.startsWith(`${href}/`) ||
        submenu.some((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`))
      );
    }
    return pathname === href || pathname?.startsWith(`${href}/`) || false;
  };

  const isContactActive = isActive('/contact');

  const isHighlighted = (index: number, active: boolean) =>
    active || hoveredIndex === index || openDropdownIndex === index;

  const isDropdownOpen = (index: number) =>
    hoveredIndex === index || openDropdownIndex === index;

  const navItemClass = (highlighted: boolean) =>
    useSolidNav
      ? `relative z-10 px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 whitespace-nowrap font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30 ${
          highlighted
            ? 'text-burgundy'
            : 'text-muted-foreground hover:text-espresso'
        }`
      : `relative z-10 px-2 py-1 text-sm font-medium tracking-wide transition-all duration-200 whitespace-nowrap font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 ${
          highlighted
            ? 'text-cream'
            : 'text-cream/85 hover:text-cream'
        }`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    
    router.push(`/packages?search=${encodeURIComponent(searchQuery)}`);
    
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${useSolidNav
      ? 'bg-vanilla/95 backdrop-blur-md border-b border-mocha/20 shadow-[0_8px_30px_rgba(76,43,8,0.10)]'
      : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between min-h-[6rem] h-[6rem] overflow-visible">
          {/* Logo */}
          <div className="relative z-50 flex shrink-0 items-center overflow-visible py-1">
            <BrandLogo variant={useSolidNav ? 'dark' : 'light'} size="md" />
          </div>

          {/* Centered Navigation Pill */}
          <div className={`hidden lg:flex items-center justify-center flex-1 transition-all duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'}`}>
            <div className={`relative flex items-center gap-8 xl:gap-10 ${
              useSolidNav ? '' : ''
            }`}>
              {navigation.map((item, index) => {
                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (pathname === '/' && item.href === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                };

                const active = isActive(item.href, item.submenu, item.packageGroups);
                const highlighted = isHighlighted(index, active);

                if (item.packageGroups?.length) {
                  const dropdownOpen = isDropdownOpen(index);

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setOpenDropdownIndex(index);
                        const firstGroup = item.packageGroups?.[0];
                        if (firstGroup) {
                          setHoveredPackageGroup(firstGroup.slug);
                          setHoveredPackageSub(firstGroup.items?.[0]?.slug ?? null);
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        setOpenDropdownIndex(null);
                        setHoveredPackageGroup(null);
                        setHoveredPackageSub(null);
                      }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        aria-expanded={dropdownOpen}
                        className={`${navItemClass(highlighted)} inline-flex items-center gap-1`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            dropdownOpen ? 'rotate-180' : ''
                          } ${useSolidNav && highlighted ? 'text-gray-700' : ''}`}
                        />
                      </Link>
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[60] transition-all duration-200 ${
                          dropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible translate-y-1 pointer-events-none'
                        }`}
                      >
                        <div className="flex rounded-xl bg-cream shadow-2xl border border-gray-100 overflow-hidden">
                          <div className="min-w-[200px] py-2">
                            {item.packageGroups.map((group) => (
                              <Link
                                key={group.slug}
                                href={getGroupPageHref(group.slug)}
                                className={`flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors ${
                                  hoveredPackageGroup === group.slug
                                    ? groupHoverStyles[group.slug] ?? 'bg-gray-50 text-gray-800'
                                    : 'text-gray-800 hover:bg-gray-50'
                                }`}
                                onMouseEnter={() => setHoveredPackageGroup(group.slug)}
                                onClick={() => {
                                  setOpenDropdownIndex(null);
                                  setHoveredIndex(null);
                                  setHoveredPackageGroup(null);
                                  setHoveredPackageSub(null);
                                }}
                              >
                                <span>{group.label}</span>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </Link>
                            ))}
                            <Link
                              href="/packages"
                              onClick={() => {
                                setOpenDropdownIndex(null);
                                setHoveredIndex(null);
                              }}
                              className="block px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-hazelnut hover:bg-hazelnut/5 border-t border-gray-100 mt-1"
                            >
                              View All Coffee
                            </Link>
                          </div>
                          {hoveredPackageGroup && (
                            <div className="min-w-[280px] max-w-[300px] border-l border-gray-100 py-2 bg-cream max-h-[420px] overflow-y-auto">
                              {item.packageGroups
                                .find((g) => g.slug === hoveredPackageGroup)
                                ?.items?.map((sub) => (
                                  <div
                                    key={sub.slug}
                                    className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors cursor-default ${
                                      hoveredPackageSub === sub.slug
                                        ? 'bg-gray-50 text-hazelnut font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onMouseEnter={() => setHoveredPackageSub(sub.slug)}
                                  >
                                    {sub.miniItems?.length ? (
                                      <>
                                        <span>{sub.label}</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                                      </>
                                    ) : (
                                      <Link
                                        href={sub.href}
                                        onClick={() => {
                                          setOpenDropdownIndex(null);
                                          setHoveredIndex(null);
                                          setHoveredPackageGroup(null);
                                          setHoveredPackageSub(null);
                                        }}
                                        className="flex items-center justify-between gap-2 w-full"
                                      >
                                        <span>{sub.label}</span>
                                        {sub.isFuture && (
                                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                                            Future
                                          </span>
                                        )}
                                      </Link>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                          {hoveredPackageGroup && hoveredPackageSub && (() => {
                            const activeSub = item.packageGroups
                              ?.find((g) => g.slug === hoveredPackageGroup)
                              ?.items?.find((s) => s.slug === hoveredPackageSub);
                            if (!activeSub) return null;
                            const minis = activeSub.miniItems ?? [];
                            if (!minis.length) return null;
                            return (
                              <div className="min-w-[240px] max-w-[280px] border-l border-gray-100 py-2 bg-cream max-h-[420px] overflow-y-auto">
                                <Link
                                  href={activeSub.href}
                                  onClick={() => {
                                    setOpenDropdownIndex(null);
                                    setHoveredIndex(null);
                                    setHoveredPackageGroup(null);
                                    setHoveredPackageSub(null);
                                  }}
                                  className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-hazelnut hover:bg-hazelnut/5 border-b border-gray-100"
                                >
                                  All {activeSub.label}
                                </Link>
                                {minis.map((mini) => (
                                  <Link
                                    key={mini.href}
                                    href={mini.href}
                                    onClick={() => {
                                      setOpenDropdownIndex(null);
                                      setHoveredIndex(null);
                                      setHoveredPackageGroup(null);
                                      setHoveredPackageSub(null);
                                    }}
                                    className={`block px-4 py-2.5 text-sm transition-colors ${
                                      pathname === mini.href
                                        ? 'bg-hazelnut/10 text-hazelnut font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-hazelnut'
                                    }`}
                                  >
                                    {mini.label}
                                  </Link>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.submenu?.length) {
                  const dropdownOpen = isDropdownOpen(index);

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setOpenDropdownIndex(index);
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        setOpenDropdownIndex(null);
                      }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        aria-expanded={dropdownOpen}
                        className={`${navItemClass(highlighted)} inline-flex items-center gap-1`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            dropdownOpen ? 'rotate-180' : ''
                          } ${useSolidNav && highlighted ? 'text-gray-700' : ''}`}
                        />
                      </Link>
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[60] transition-all duration-200 ${
                          dropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible translate-y-1 pointer-events-none'
                        }`}
                      >
                        <div className="min-w-[260px] rounded-xl bg-cream shadow-2xl border border-gray-100 py-1.5 overflow-hidden">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => {
                                setOpenDropdownIndex(null);
                                setHoveredIndex(null);
                              }}
                              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                                pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
                                  ? 'bg-hazelnut/10 text-hazelnut font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-hazelnut'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleClick}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={navItemClass(highlighted)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side: Search + CTA */}
          <div className="hidden lg:flex items-center space-x-3 relative">
            <div className={`flex items-center transition-all duration-500 overflow-hidden ${isSearchOpen ? 'w-[400px] absolute right-32' : 'w-10'}`}>
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center w-full bg-cream/80 backdrop-blur-xl rounded-full border border-hazelnut/30 shadow-sm px-2 overflow-hidden">
                  <Input
                    autoFocus
                    placeholder="Search coffee beans, roasts, or blends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none outline-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-800 h-10 w-full rounded-full"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-red-400 rounded-full h-8 w-8 ml-1 shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className={`${useSolidNav ? 'text-gray-700' : 'text-white'} hover:bg-cream/10`}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            <Link
              href="/contact"
              aria-current={isContactActive ? 'page' : undefined}
              onMouseEnter={() => setContactHovered(true)}
              onMouseLeave={() => setContactHovered(false)}
              className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-[11px] font-bold uppercase tracking-[0.18em] transition-all ${
                useSolidNav
                  ? isContactActive || contactHovered
                    ? 'bg-hazelnut text-white'
                    : 'bg-espresso text-white hover:bg-hazelnut'
                  : isContactActive || contactHovered
                    ? 'bg-cream text-espresso'
                    : 'bg-vanilla text-espresso hover:bg-cream'
              }`}
            >
              Contact Us
            </Link>
            
            <Button
              onClick={() => openForm()}
              className={`${
                useSolidNav
                  ? 'bg-hazelnut hover:bg-espresso text-cream'
                  : 'bg-transparent border border-white/35 text-white hover:bg-cream/10 hover:text-white'
              } font-bold px-5 py-2 rounded-full shadow-none h-10 whitespace-nowrap text-[11px] uppercase tracking-[0.16em]`}
            >
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-md ${useSolidNav ? 'text-gray-700' : 'text-white'}`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-vanilla border-t border-mocha/20 shadow-[0_8px_30px_rgba(76,43,8,0.10)]">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href, item.submenu, item.packageGroups) ? 'page' : undefined}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href, item.submenu, item.packageGroups)
                      ? 'bg-primary text-white font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => !item.submenu?.length && setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.packageGroups?.map((group) => (
                  <div key={group.slug}>
                    <Link
                      href={getGroupPageHref(group.slug)}
                      className="block pl-6 pr-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-hazelnut hover:text-espresso"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {group.label}
                    </Link>
                    {group.items?.map((sub) => (
                      <div key={sub.href}>
                        <Link
                          href={sub.href}
                          className={`block pl-10 pr-4 py-2 text-sm rounded-lg transition-colors ${
                            pathname === sub.href
                              ? 'text-hazelnut font-semibold bg-hazelnut/5'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.label}
                          {sub.isFuture ? ' (Future)' : ''}
                        </Link>
                        {sub.miniItems?.map((mini) => (
                          <Link
                            key={mini.href}
                            href={mini.href}
                            className={`block pl-14 pr-4 py-1.5 text-xs rounded-lg transition-colors ${
                              pathname === mini.href
                                ? 'text-hazelnut font-semibold bg-hazelnut/5'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {mini.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
                {!item.packageGroups?.length &&
                  item.submenu?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`block pl-8 pr-4 py-2 text-sm rounded-lg transition-colors ${
                      pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
                        ? 'text-hazelnut font-semibold bg-hazelnut/5'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/contact"
              className="block px-4 py-2 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Button
              onClick={() => {
                openForm();
                setIsMenuOpen(false);
              }}
              className="w-full bg-hazelnut hover:bg-espresso text-cream font-bold mt-4"
            >
              Order Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarTravel;
