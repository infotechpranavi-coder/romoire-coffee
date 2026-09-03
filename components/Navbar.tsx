'use client'

import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Mail, ChevronDown, MessageCircle, User, LogOut, Search, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { SITE_NAME, LOGO_SRC } from "@/lib/branding";
import { PACKAGE_EXPERIENCE_CATEGORIES } from "@/lib/packageExperienceCategories";

interface SearchPackage {
  _id: string;
  title: string;
  subtitle: string;
  location: string;
  price: number;
  duration: string;
  images: Array<{ url: string; alt: string }>;
  rating: number;
}

interface NavigationItem {
  name: string;
  href: string;
  submenu?: Array<{ name: string; href: string }>;
}

const generateSlug = (title: string, id: string) => {
  return `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchPackage[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { openForm } = useInquiryForm();

  // Initialize search term from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
      }
    }
  }, []);

  // Set mounted to true after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if hero section is in view (only on home page)
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (typeof window !== 'undefined' && pathname === '/') {
        const heroSection = document.getElementById('home');
        if (heroSection) {
          const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          const scrollPosition = window.scrollY + 100; // Add some offset for better UX
          setIsInHeroSection(scrollPosition < heroBottom);
        } else {
          setIsInHeroSection(false);
        }
      } else {
        setIsInHeroSection(false);
      }
    };

    // Check on mount and route change
    handleScroll();

    // Check on scroll
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, mounted]);

  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Packages',
      href: '/packages',
      submenu: PACKAGE_EXPERIENCE_CATEGORIES.map((category) => ({
        name: category.label,
        href: category.href,
      })),
    },
    { name: 'Travel Blog ', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) || false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to packages page with search query
      router.push(`/packages?search=${encodeURIComponent(searchTerm.trim())}`);
      // Don't clear the search term - keep it visible
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearchOpen(value.trim().length > 0);
  };

  // Search for packages
  const searchPackages = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/packages/search?q=${encodeURIComponent(query)}&limit=5`);
      const result = await response.json();
      if (result.success) {
        setSearchResults(result.data);
        setIsSearchOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPackages(searchTerm);
    }, 300); // 300ms delay for live search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Destination mapping for smart routing
  const getDestinationCategory = (searchTerm: string): 'international' | 'domestic' | 'general' => {
    const term = searchTerm.toLowerCase();

    // International destinations
    const internationalDestinations = [
      'vietnam', 'thailand', 'dubai', 'abu dhabi', 'sri lanka', 'srilanka', 'bali',
      'malaysia', 'singapore', 'indonesia', 'philippines', 'japan',
      'china', 'south korea', 'taiwan', 'hong kong', 'macau', 'myanmar',
      'cambodia', 'laos', 'bangladesh', 'pakistan', 'afghanistan', 'iran',
      'turkey', 'egypt', 'morocco', 'south africa', 'kenya', 'tanzania',
      'mauritius', 'seychelles', 'maldives', 'fiji', 'australia', 'new zealand',
      'europe', 'france', 'italy', 'spain', 'germany', 'switzerland', 'austria',
      'netherlands', 'belgium', 'greece', 'portugal', 'norway', 'sweden',
      'denmark', 'finland', 'iceland', 'ireland', 'uk', 'england', 'scotland',
      'wales', 'canada', 'usa', 'america', 'brazil', 'argentina', 'chile',
      'peru', 'colombia', 'mexico', 'cuba', 'jamaica', 'costa rica'
    ];

    // Domestic destinations
    const domesticDestinations = [
      'south africa', 'cape town', 'johannesburg', 'pretoria', 'durban', 'kruger',
      'knysna', 'mossel bay', 'storms river', 'hermanus', 'stellenbosch', 'franschhoek',
      'jodhpur', 'jaisalmer', 'bikaner', 'mount abu', 'goa', 'kerala',
      'munnar', 'alleppey', 'kochi', 'trivandrum', 'karnataka', 'bangalore',
      'mysore', 'coorg', 'ooty', 'tamil nadu', 'chennai', 'madurai',
      'pondicherry', 'mahabalipuram', 'andhra pradesh', 'hyderabad', 'visakhapatnam',
      'telangana', 'maharashtra', 'mumbai', 'pune', 'nashik', 'aurangabad',
      'gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar',
      'madhya pradesh', 'bhopal', 'indore', 'gwalior', 'ujjain', 'khajuraho',
      'west bengal', 'kolkata', 'darjeeling', 'kalimpong', 'gangtok', 'sikkim',
      'assam', 'guwahati', 'kaziranga', 'manipur', 'imphal', 'meghalaya',
      'shillong', 'cherrapunji', 'mizoram', 'aizawl', 'nagaland', 'kohima',
      'tripura', 'agartala', 'arunachal pradesh', 'itanagar', 'tawang',
      'odisha', 'bhubaneswar', 'puri', 'konark', 'jharkhand', 'ranchi',
      'bihar', 'patna', 'bodh gaya', 'nalanda', 'chhattisgarh', 'raipur',
      'jagdalpur', 'punjab', 'chandigarh', 'amritsar', 'haryana', 'gurgaon',
      'faridabad', 'himachal pradesh', 'uttar pradesh', 'lucknow', 'agra',
      'varanasi', 'allahabad', 'kanpur', 'jhansi', 'mathura', 'vrindavan'
    ];

    // Check if search term matches any destination
    for (const dest of internationalDestinations) {
      if (term.includes(dest) || dest.includes(term)) {
        return 'international';
      }
    }

    for (const dest of domesticDestinations) {
      if (term.includes(dest) || dest.includes(term)) {
        return 'domestic';
      }
    }

    return 'general';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const category = getDestinationCategory(searchTerm.trim());

      // Force page refresh to ensure search works correctly
      window.location.href = `/packages?search=${encodeURIComponent(searchTerm.trim())}`;

      setIsSearchOpen(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-[120] transition-all duration-300 ${isInHeroSection
      ? 'bg-transparent shadow-none border-b-0'
      : 'bg-cream shadow-lg border-b border-gray-300'
      }`}>
      {/* Top Bar */}
      <div className="bg-black text-white py-1">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+237 6 83 57 76 76</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>sales@skygovoyages.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-800"
                  onClick={() => window.open('https://wa.me/237683577676', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Full Width */}
        <div className="md:hidden px-4 space-y-1">
          {/* Row 1: Phone Numbers */}
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>+237 6 83 57 76 76</span>
          </div>

          {/* Row 2: Email */}
          <div className="flex items-center justify-center space-x-2 text-base mt-2">
            <Mail className="h-4 w-4" />
            <span>sales@skygovoyages.com</span>
          </div>

          {/* Row 3: Live Chat & Login */}
          <div className="flex items-center justify-center -space-x-2" style={{ marginTop: '-6px' }}>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 text-base px-4 py-2"
              onClick={() => window.open('https://wa.me/237683577676', '_blank')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Live Chat
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 text-base px-4 py-2">
                <User className="h-5 w-5 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <div className="relative w-44 h-14 md:w-56 md:h-16 flex items-center justify-center">
              <Image
                src={LOGO_SRC}
                alt={`${SITE_NAME} Logo`}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div ref={searchRef} className="relative w-full">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isInHeroSection ? 'text-white' : 'text-gray-400'
                    }`} />
                  <Input
                    type="text"
                    placeholder="Search South African tours…"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={`pl-10 pr-4 py-2 w-full ${isInHeroSection
                      ? 'bg-transparent border-white/50 text-white placeholder-white/70 focus:border-white focus:ring-white'
                      : 'bg-transparent border-gray-300 text-white placeholder-white/70 focus:border-primary focus:ring-primary'
                      }`}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
              </form>

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-cream border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <div className="text-xs text-gray-500 mb-2 px-2">
                        {searchResults.length} package{searchResults.length !== 1 ? 's' : ''} found
                      </div>
                      {searchResults.map((pkg) => (
                        <Link
                          key={pkg._id}
                          href={`/packages/${generateSlug(pkg.title, pkg._id)}`}
                          className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <div className="flex items-start space-x-3">
                            {pkg.images && pkg.images.length > 0 ? (
                              <div className="w-16 h-12 relative flex-shrink-0">
                                <Image
                                  src={pkg.images[0].url}
                                  alt={pkg.images[0].alt || pkg.title}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{pkg.title}</h4>
                              <p className="text-sm text-gray-600 truncate">{pkg.subtitle}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center text-xs text-gray-500">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {pkg.location}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {pkg.duration}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Star className="h-3 w-3 mr-1" />
                                  {pkg.rating}/5
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-hazelnut mt-1 uppercase text-[10px] tracking-wider">
                                Enquire for quote
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <button
                          onClick={() => {
                            const category = getDestinationCategory(searchTerm);
                            setIsSearchOpen(false);

                            // Force page refresh to ensure search works correctly
                            window.location.href = `/packages?search=${encodeURIComponent(searchTerm)}`;
                          }}
                          className="block w-full text-center text-sm text-primary hover:text-primary/80 py-2"
                        >
                          View all results for "{searchTerm}"
                        </button>
                      </div>
                    </div>
                  ) : searchTerm.trim() && !isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No packages found for "{searchTerm}"</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item: NavigationItem) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`flex items-center space-x-1 text-lg ${isInHeroSection
                          ? isActive(item.href)
                            ? 'text-white font-semibold'
                            : 'text-white hover:text-gray-200'
                          : isActive(item.href)
                            ? 'text-black font-semibold'
                            : 'text-gray-800 hover:text-black'
                          }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 z-[130]">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            href={subItem.href}
                            className={`w-full ${isActive(subItem.href)
                              ? 'text-black font-semibold'
                              : 'text-gray-800'
                              }`}
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-medium text-lg transition-colors ${isInHeroSection
                      ? isActive(item.href)
                        ? 'text-white font-semibold'
                        : 'text-white hover:text-gray-200'
                      : isActive(item.href)
                        ? 'text-black font-semibold'
                        : 'text-gray-800 hover:text-black'
                      }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3 ml-8 flex-shrink-0">
            <Button
              size="sm"
              className="bg-black hover:bg-gray-800 text-white whitespace-nowrap"
              onClick={() => openForm()}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${isInHeroSection
              ? 'text-white hover:text-gray-200 hover:bg-cream/10'
              : 'text-gray-800 hover:text-black hover:bg-gray-100'
              }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-cream border-t">
          <div className="container mx-auto px-4 py-3">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isInHeroSection ? 'text-white' : 'text-gray-400'
                      }`} />
                    <Input
                      type="text"
                      placeholder="Search packages..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className={`pl-10 pr-4 py-2 w-full ${isInHeroSection
                        ? 'bg-transparent border-white/50 text-white placeholder-white/70 focus:border-white focus:ring-white'
                        : 'bg-transparent border-gray-300 text-white placeholder-white/70 focus:border-primary focus:ring-primary'
                        }`}
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${isInHeroSection ? 'border-white' : 'border-black'
                          }`}></div>
                      </div>
                    )}
                  </div>
                </form>

                {/* Mobile Search Results */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-cream border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="p-2">
                        <div className="text-xs text-gray-500 mb-2 px-2">
                          {searchResults.length} package{searchResults.length !== 1 ? 's' : ''} found
                        </div>
                        {searchResults.map((pkg) => (
                          <Link
                            key={pkg._id}
                            href={`/packages/${generateSlug(pkg.title, pkg._id)}`}
                            className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              {pkg.images && pkg.images.length > 0 ? (
                                <div className="w-12 h-10 relative flex-shrink-0">
                                  <Image
                                    src={pkg.images[0].url}
                                    alt={pkg.images[0].alt || pkg.title}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                  <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm truncate">{pkg.title}</h4>
                                <p className="text-xs text-gray-600 truncate">{pkg.subtitle}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {pkg.location}
                                  </div>
                                  <div className="text-xs font-semibold text-hazelnut uppercase tracking-wider">
                                    Enquire
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <button
                            onClick={() => {
                              const category = getDestinationCategory(searchTerm);
                              setIsSearchOpen(false);
                              setIsMenuOpen(false);

                              // Force page refresh to ensure search works correctly
                              window.location.href = `/packages?search=${encodeURIComponent(searchTerm)}`;
                            }}
                            className="block w-full text-center text-sm text-primary hover:text-primary/80 py-2"
                          >
                            View all results for "{searchTerm}"
                          </button>
                        </div>
                      </div>
                    ) : searchTerm.trim() && !isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <Search className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No packages found for "{searchTerm}"</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {navigation.map((item: NavigationItem) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <div className="font-medium text-lg text-gray-900 mb-2">{item.name}</div>
                      <div className="pl-4 space-y-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`block py-2 text-lg transition-colors ${isActive(subItem.href)
                              ? 'text-black font-semibold'
                              : 'text-gray-800 hover:text-black'
                              }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block py-2 font-medium text-lg transition-colors ${isActive(item.href)
                        ? 'text-black font-semibold'
                        : 'text-gray-800 hover:text-black'
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t space-y-2">
                <Button
                  size="sm"
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  onClick={() => {
                    openForm();
                    setIsMenuOpen(false);
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
