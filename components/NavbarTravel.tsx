'use client'

import { useState, useEffect, useMemo } from "react";
import { Search, Menu, X, ChevronDown, Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import BrandLogo from "@/components/BrandLogo";

interface NavProduct {
  _id: string;
  title: string;
  subtitle?: string;
  price?: number | string;
  packageCategory?: string;
}

interface NavItem {
  name: string;
  href: string;
  isProducts?: boolean;
}

// Fallback seed products with categories
const FALLBACK_PRODUCTS: NavProduct[] = [
  {
    _id: "6aba50bf62e0f8f1f0cfbbab",
    title: "Premix assorted flavours pack",
    subtitle: "All 4 signature flavours in one discovery box",
    price: 499,
    packageCategory: "Assorted Pack",
  },
  {
    _id: "6aba50bf62e0f8f1f0cfbbb2",
    title: "Plain premix",
    subtitle: "Classic, bold & smooth dairy-free espresso blend",
    price: 449,
    packageCategory: "Classic Premix",
  },
  {
    _id: "6aba50bf62e0f8f1f0cfbbb8",
    title: "Mocha premix",
    subtitle: "Rich cacao indulgence meets artisanal coffee",
    price: 449,
    packageCategory: "Flavoured Premix",
  },
  {
    _id: "6aba50bf62e0f8f1f0cfbbbc",
    title: "Vanilla premix",
    subtitle: "Subtle Madagascar bourbon vanilla bean notes",
    price: 449,
    packageCategory: "Flavoured Premix",
  },
  {
    _id: "6aba50bf62e0f8f1f0cfbbc0",
    title: "Hazelnut premix",
    subtitle: "Roasted nut warmth & velvety smooth finish",
    price: 449,
    packageCategory: "Flavoured Premix",
  },
];

const NavbarTravel = () => {
  const [navProducts, setNavProducts] = useState<NavProduct[]>(FALLBACK_PRODUCTS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [contactHovered, setContactHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { openForm } = useInquiryForm();

  const useSolidNav = true;

  // Load active products dynamically from database
  useEffect(() => {
    let cancelled = false;
    async function loadNavProducts() {
      try {
        const res = await fetch('/api/packages');
        if (!res.ok) return;
        const data = await res.json();
        const list = data?.success && Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (!cancelled && list.length > 0) {
          setNavProducts(list);
        }
      } catch (err) {
        // Fallback remains in place
      }
    }
    loadNavProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  // Compute category sections with their products
  const categorySections = useMemo(() => {
    const list = navProducts.length > 0 ? navProducts : FALLBACK_PRODUCTS;
    const groupsMap = new Map<string, NavProduct[]>();

    // Priority order for coffee premix categories
    const priorityCategories = ['Assorted Pack', 'Classic Premix', 'Flavoured Premix'];
    priorityCategories.forEach((cat) => groupsMap.set(cat, []));

    list.forEach((p) => {
      const cat = (p.packageCategory?.trim()) || 'Coffee Premix';
      if (!groupsMap.has(cat)) {
        groupsMap.set(cat, []);
      }
      groupsMap.get(cat)!.push(p);
    });

    const sections: { category: string; products: NavProduct[] }[] = [];
    groupsMap.forEach((prods, category) => {
      if (prods.length > 0) {
        sections.push({ category, products: prods });
      }
    });

    return sections;
  }, [navProducts]);

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
      isProducts: true,
    },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Gallery', href: '/gallery' },
  ];

  const isActive = (href: string, isProducts?: boolean) => {
    if (href === '/') return pathname === '/';
    if (isProducts || href === '/packages') {
      return pathname === '/packages' || Boolean(pathname?.startsWith('/packages/'));
    }
    return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
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
    router.push(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
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
            <div className="relative flex items-center gap-8 xl:gap-10">
              {navigation.map((item, index) => {
                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (pathname === '/' && item.href === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                };

                const active = isActive(item.href, item.isProducts);
                const highlighted = isHighlighted(index, active);

                if (item.isProducts) {
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
                        className={`${navItemClass(highlighted)} inline-flex items-center gap-1.5`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            dropdownOpen ? 'rotate-180 text-burgundy' : ''
                          }`}
                        />
                      </Link>

                      {/* Categories & Products Dropdown Menu */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-[60] transition-all duration-200 ${
                          dropdownOpen
                            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                            : 'opacity-0 invisible translate-y-1.5 pointer-events-none'
                        }`}
                      >
                        <div className="w-[620px] lg:w-[680px] rounded-2xl bg-[#FDFBF7] shadow-[0_25px_65px_-15px_rgba(74,21,21,0.22)] border border-[#EADBCE] overflow-hidden text-left">
                          {/* Top Bar */}
                          <div className="px-6 py-3 bg-[#F6EFE6] border-b border-[#EADBCE]/80 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Coffee className="w-4 h-4 text-burgundy" />
                              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-burgundy font-serif">
                                Romoire Coffee Premixes
                              </span>
                            </div>
                            <Link
                              href="/packages"
                              onClick={() => {
                                setOpenDropdownIndex(null);
                                setHoveredIndex(null);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-burgundy hover:text-espresso transition-colors group"
                            >
                              <span>Explore All</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>

                          {/* Categories Grid - Only Product Names */}
                          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#EADBCE]/60">
                            {categorySections.map((section, sIdx) => (
                              <div
                                key={section.category}
                                className={`${sIdx > 0 ? 'md:pl-6 pt-4 md:pt-0' : ''} flex flex-col`}
                              >
                                {/* Category Header */}
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#EADBCE]/60">
                                  <div className="w-1.5 h-1.5 rounded-full bg-burgundy" />
                                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-burgundy font-serif">
                                    {section.category}
                                  </h4>
                                </div>

                                {/* Product Names List */}
                                <ul className="space-y-1 flex-1">
                                  {section.products.map((prod) => (
                                    <li key={prod._id}>
                                      <Link
                                        href={`/packages/${prod._id}`}
                                        onClick={() => {
                                          setOpenDropdownIndex(null);
                                          setHoveredIndex(null);
                                        }}
                                        className="block px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-800 hover:text-burgundy hover:bg-[#F5EDE3] transition-colors leading-snug"
                                      >
                                        {prod.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
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
                    placeholder="Search artisanal coffee premixes..."
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
        <div className="lg:hidden bg-vanilla border-t border-mocha/20 shadow-[0_8px_30px_rgba(76,43,8,0.10)] max-h-[85vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.isProducts ? (
                  <div className="space-y-3 py-1">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-burgundy/5">
                      <Link
                        href={item.href}
                        className="font-bold text-gray-900 hover:text-burgundy text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <Link
                        href="/packages"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-xs font-bold uppercase tracking-wider text-burgundy flex items-center gap-1"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Category Sections & Product Names */}
                    <div className="space-y-2.5 px-1">
                      {categorySections.map((sec) => (
                        <div
                          key={sec.category}
                          className="rounded-xl bg-white/70 border border-[#EADBCE] p-3 shadow-xs"
                        >
                          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#EADBCE]/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-burgundy" />
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-burgundy font-serif">
                              {sec.category}
                            </h5>
                          </div>
                          <div className="space-y-1">
                            {sec.products.map((prod) => (
                              <Link
                                key={prod._id}
                                href={`/packages/${prod._id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-800 hover:bg-[#F5EDE3] hover:text-burgundy transition-colors"
                              >
                                {prod.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-burgundy text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-2 border-t border-[#EADBCE]">
              <Link
                href="/contact"
                className="block px-4 py-2.5 rounded-lg bg-gray-900 text-white font-bold text-center hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Button
                onClick={() => {
                  openForm();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-hazelnut hover:bg-espresso text-cream font-bold mt-2"
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarTravel;
