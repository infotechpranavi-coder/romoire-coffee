import { useState } from "react";
import { Menu, X, Phone, Mail, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { SITE_NAME, LOGO_SRC, CONTACT_EMAIL, CONTACT_SUPPORT_EMAIL, CONTACT_PHONE, CONTACT_WHATSAPP } from "@/lib/branding";
import { PACKAGE_NAV_GROUPS } from "@/lib/packageExperienceCategories";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Destinations", href: "/destinations" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Always transparent overlay for all hero sections
  const isOverlayHero = true;

  // WhatsApp contact function
  const handleWhatsAppClick = () => {
    const phoneNumber = "237683577676"; // WhatsApp number with country code
    const message = "Hi! I'm interested in your tour packages. Can you please provide more information?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          title="Contact us on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-cream text-gray-800 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat on WhatsApp
          </div>
        </button>
      </div>

      <header
        className="absolute top-0 left-0 w-full z-50 transition-colors duration-300 bg-transparent"
        style={{ background: "transparent" }}
      >
        {/* Top bar - Mobile friendly */}
        <div className="bg-transparent text-white py-1 sm:py-2 transition-colors duration-300">
          <div className="container mx-auto px-2 sm:px-4">
            {/* Mobile Layout */}
            <div className="flex flex-col sm:hidden space-y-1">
              <div className="flex items-center justify-center space-x-4 text-xs">
                <div className="flex flex-col items-center space-y-0.5">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span> +237 6 83 57 76 76</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{CONTACT_EMAIL}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <a
                  href="https://wa.me/237683577676"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-green-400 transition-colors duration-200 text-xs"
                  aria-label="Chat on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-3 w-3">
                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.34 7.09L4 29l7.18-2.29A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.85-.58-5.41-1.58l-.39-.25-4.27 1.36 1.4-4.15-.25-.4A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.02 2.82 1.16 3.02c.14.2 2.01 3.08 4.88 4.2.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+237 6 83 57 76 76</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{CONTACT_EMAIL}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{CONTACT_SUPPORT_EMAIL}</span>
                </div>
                <a
                  href="https://wa.me/237683577676"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-green-400 transition-colors duration-200"
                  aria-label="Chat on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4">
                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.34 7.09L4 29l7.18-2.29A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.85-.58-5.41-1.58l-.39-.25-4.27 1.36 1.4-4.15-.25-.4A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.02 2.82 1.16 3.02c.14.2 2.01 3.08 4.88 4.2.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="flex items-center justify-center w-44 h-14 md:w-56 md:h-16">
                <img src={LOGO_SRC} alt={SITE_NAME} className="h-full w-full object-contain object-left" />
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Home */}
              <Link
                href="/"
                className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/" ? 'text-primary' : ''}`}
              >
                Home
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/about" ? 'text-primary' : ''}`}
              >
                About Us
              </Link>

              {/* Packages Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
                      Packages
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[280px] gap-3 p-4 md:w-[320px] md:grid-cols-1 lg:w-[360px] bg-cream rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/packages"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none text-foreground">All Packages</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Browse water, land, and sky experiences
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        {PACKAGE_NAV_GROUPS.map((group) => (
                          <li key={group.slug}>
                            <p className="px-3 pt-2 text-[10px] font-black uppercase tracking-widest text-gray-500">{group.label}</p>
                            <ul className="space-y-1">
                              {group.items.map((category) => (
                                <li key={category.slug}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={category.href}
                                      className="block select-none rounded-md p-2 pl-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                      {category.label}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* All Tours */}
              <Link
                href="/destinations"
                className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/destinations" ? 'text-primary' : ''}`}
              >
                All Tours
              </Link>

              {/* Blogs */}
              <Link
                href="/blogs"
                className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/blogs" ? 'text-primary' : ''}`}
              >
                Blogs
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/contact" ? 'text-primary' : ''}`}
              >
                Contact Us
              </Link>

              <Link href="/contact">
                <Button className="bg-secondary hover:bg-secondary/90 hover-lift">
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border">
              <div className="flex flex-col space-y-4 pt-4">
                {/* Home */}
                <Link
                  href="/"
                  className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/" ? 'text-primary' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {/* About Us */}
                <Link
                  href="/about"
                  className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/about" ? 'text-primary' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>

                {/* Mobile Packages Dropdown */}
                <div className="space-y-2">
                  <div className="font-medium text-white">Packages</div>
                  <div className="ml-4 space-y-2">
                    <Link
                      href="/packages"
                      className="block text-white/80 hover:text-primary transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      All Packages
                    </Link>
                    {PACKAGE_NAV_GROUPS.map((group) => (
                      <div key={group.slug}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-2">{group.label}</p>
                        {group.items.map((category) => (
                          <Link
                            key={category.slug}
                            href={category.href}
                            className="block text-white/80 hover:text-primary transition-colors duration-200 pl-2"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Tours */}
                <Link
                  href="/destinations"
                  className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/destinations" ? 'text-primary' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Tours
                </Link>

                {/* Blogs */}
                <Link
                  href="/blogs"
                  className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/blogs" ? 'text-primary' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blogs
                </Link>

                {/* Contact Us */}
                <Link
                  href="/contact"
                  className={`transition-colors duration-200 font-medium text-white hover:text-primary ${pathname === "/contact" ? 'text-primary' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>

                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90 w-fit">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;