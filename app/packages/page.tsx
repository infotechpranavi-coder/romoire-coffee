'use client'

import { SITE_NAME } from "@/lib/branding";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Coffee } from "lucide-react";
import Link from "next/link";
import {
  PACKAGE_NAV_GROUPS,
  GROUP_HERO_IMAGES,
  PACKAGE_EXPERIENCE_CATEGORIES,
} from "@/lib/packageExperienceCategories";

const PackagesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search).get("search");
    if (searchParam) setSearchTerm(searchParam);
  }, []);

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return PACKAGE_NAV_GROUPS;

    return PACKAGE_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (category) =>
          category.label.toLowerCase().includes(query) ||
          category.heroTitle.toLowerCase().includes(query) ||
          category.heroSubtitle.toLowerCase().includes(query) ||
          group.label.toLowerCase().includes(query)
      ),
    })).filter((group) => group.items.length > 0);
  }, [searchTerm]);

  const totalCategories = PACKAGE_EXPERIENCE_CATEGORIES.length;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative text-white pt-28 pb-20 md:pb-28 overflow-hidden min-h-[420px]">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
          {PACKAGE_NAV_GROUPS.map((group) => (
            <div
              key={group.slug}
              className="relative bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${GROUP_HERO_IMAGES[group.slug] ?? group.items[0]?.heroImage}')` }}
            >
              <div className="absolute inset-0 bg-black/45" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#3D1218]/85 via-[#3D1218]/50 to-[#3D1218]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F5EFE6] to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 mb-6">
              <Coffee className="h-4 w-4 text-amber-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">{SITE_NAME} Coffee</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight uppercase">
              Shop Coffee Beans
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white/85 max-w-2xl mx-auto font-medium">
              Browse by origin, roast profile, blend, or subscription — whole bean and ground options available
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
              <span>{totalCategories} Coffee Collections</span>
              <span className="text-white/30">·</span>
              <span>Freshly Roasted</span>
              <span className="text-white/30">·</span>
              <span>Ethically Sourced</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#F5EFE6]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6B1F2A] mb-2">Shop by Collection</p>
              <h2 className="text-3xl font-black text-[#3D1218] mb-3 uppercase tracking-tight">All Coffee Categories</h2>
              <p className="text-gray-600 mb-6">Single Origin, Roasts, Blends, Specialty, and Subscriptions</p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search coffee beans, roasts, origins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 rounded-full border-gray-200 bg-white shadow-sm"
                />
              </div>
            </div>

            {filteredGroups.length === 0 ? (
              <div className="text-center py-16 rounded-[32px] bg-white border border-gray-100">
                <p className="text-gray-500 mb-4">No experience categories match your search.</p>
                <Button variant="outline" onClick={() => setSearchTerm("")} className="rounded-full">
                  Clear search
                </Button>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.slug} id={group.slug} className="mb-8 scroll-mt-28">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">{group.label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map((category) => (
                      <Link
                        key={category.slug}
                        href={category.href}
                        className="group rounded-[24px] overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="relative h-44 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url('${category.heroImage}')` }}
                          role="img"
                          aria-label={category.label}
                        />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                          {category.isFuture && (
                            <Badge className="absolute top-3 right-3 bg-amber-500/90 text-white border-none text-[9px] uppercase tracking-wider">
                              Future
                            </Badge>
                          )}
                          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                            <p className="text-white font-black text-sm leading-tight">{category.label}</p>
                            <ArrowRight className="h-4 w-4 text-white/80 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Can&apos;t Find What You&apos;re Looking For?</h2>
            <p className="text-xl mb-8 opacity-90">
              We can create a custom package tailored to your specific needs and preferences
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-[#6B1F2A] hover:bg-[#4A1520] text-white font-bold rounded-full px-10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
