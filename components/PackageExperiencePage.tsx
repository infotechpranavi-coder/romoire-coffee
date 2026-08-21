'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Search, Star, Users, ArrowRight, Compass } from 'lucide-react';
import { SITE_NAME } from '@/lib/branding';
import {
  PackageExperienceCategory,
  accentStyles,
} from '@/lib/packageExperienceCategories';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import { getResolvedCategoryBySlugFromCatalog } from '@/lib/categoryCatalog';
import { useInquiryForm } from '@/contexts/InquiryFormContext';
import PackagePageEnquiryForm from '@/components/PackagePageEnquiryForm';
import CategoryHeroBackground from '@/components/CategoryHeroBackground';

interface PackageItem {
  _id: string;
  title: string;
  subtitle: string;
  about: string;
  price: number;
  duration: string;
  location: string;
  capacity: string;
  packageCategory?: string;
  images: Array<{ url: string; alt: string }>;
  rating: number;
}

interface PackageExperiencePageProps {
  category: PackageExperienceCategory;
  miniCategorySlug?: string;
}

export default function PackageExperiencePage({ category: baseCategory, miniCategorySlug }: PackageExperiencePageProps) {
  const { catalog, getGroupLabel } = useCategoryLabels();
  const category = miniCategorySlug
    ? baseCategory
    : (getResolvedCategoryBySlugFromCatalog(baseCategory.slug, catalog) ?? baseCategory);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const styles = accentStyles[category.accent];
  const groupLabel = getGroupLabel(category.group);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) setSearchTerm(searchParam);
    fetchPackages();
  }, [category.slug, miniCategorySlug]);

  useEffect(() => {
    let filtered = packages;
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(query) ||
          pkg.subtitle.toLowerCase().includes(query) ||
          pkg.location.toLowerCase().includes(query) ||
          pkg.about.toLowerCase().includes(query)
      );
    }
    setFilteredPackages(filtered);
  }, [packages, searchTerm]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const query = miniCategorySlug
        ? `mini=${encodeURIComponent(miniCategorySlug)}`
        : `category=${encodeURIComponent(category.slug)}`;
      const response = await fetch(`/api/packages?${query}`);
      const result = await response.json();
      if (result.success && result.data) {
        setPackages(result.data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const openPackageEnquiry = (pkg: PackageItem) => {
    openForm({
      type: 'Package',
      title: pkg.title,
      referenceId: pkg._id,
      category: category.label,
      duration: pkg.duration,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${styles.spinner} mx-auto mb-4`} />
          <p className="text-gray-600">Loading {category.label.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <section className="relative text-white pt-28 pb-20 md:pb-24 overflow-hidden">
        <CategoryHeroBackground
          src={category.heroImage}
          alt={category.heroTitle}
          gradientClass={styles.gradient}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 mb-6">
              <Compass className={`h-4 w-4 ${styles.icon}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">
                {groupLabel}
              </span>
            </div>
            {category.isFuture && (
              <Badge className="mb-4 bg-amber-500/90 text-white border-none uppercase tracking-widest text-[10px]">
                Coming Soon
              </Badge>
            )}
            <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tight uppercase">{category.heroTitle}</h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto font-medium leading-relaxed">{category.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-10">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.muted} mb-1`}>{SITE_NAME}</p>
                <h2 className="text-2xl md:text-3xl font-black text-[#111827] uppercase tracking-tight">{category.label}</h2>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={`Search ${category.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 ${styles.focusRing}`}
                />
              </div>
            </div>

            {category.isFuture && filteredPackages.length === 0 ? (
              <div className={`text-center py-16 rounded-[32px] bg-white border border-dashed ${styles.ring}`}>
                <Compass className={`h-14 w-14 ${styles.emptyIcon} mx-auto mb-4`} />
                <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight mb-2">{category.label}</h3>
                <p className="text-gray-500 max-w-md mx-auto">This experience category is launching soon. Contact us to register your interest.</p>
                <Link href="/contact" className="inline-block mt-6">
                  <Button className={styles.button}>Contact Us</Button>
                </Link>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-16 rounded-[32px] bg-white border border-gray-100 shadow-sm">
                <div className={`w-20 h-20 mx-auto mb-4 ${styles.emptyBg} rounded-full flex items-center justify-center`}>
                  <Search className={`h-10 w-10 ${styles.emptyIcon}`} />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">{category.emptyMessage}</h3>
                <p className="text-gray-600 mb-6">Check back soon or explore other experiences.</p>
                <Button onClick={() => router.push('/packages')}>View All Packages</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <article
                    key={pkg._id}
                    className="group relative bg-white rounded-[28px] overflow-hidden shadow-lg shadow-gray-200/60 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {pkg.images?.[0] ? (
                        <Image
                          src={pkg.images[0].url}
                          alt={pkg.images[0].alt || pkg.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          unoptimized
                        />
                      ) : (
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                          style={{ backgroundImage: `url('${category.heroImage}')` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${styles.badge} text-white border-none font-bold text-[10px] uppercase tracking-wider`}>
                        {category.label}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-black text-xl leading-tight line-clamp-2">{pkg.title}</p>
                        <p className="text-white/75 text-sm mt-1 line-clamp-1">{pkg.subtitle}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#111827] font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                        Enquire
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className={`h-3.5 w-3.5 ${styles.muted} shrink-0`} />
                          <span className="truncate">{pkg.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`h-3.5 w-3.5 ${styles.muted} shrink-0`} />
                          <span className="truncate">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className={`h-3.5 w-3.5 ${styles.muted} shrink-0`} />
                          <span className="truncate">{pkg.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{pkg.rating || 5}/5</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-5">{pkg.about}</p>
                      <div className="flex gap-3">
                        <Link href={`/packages/${pkg._id}`} className="flex-1">
                          <Button variant="outline" className={`w-full rounded-xl h-11 font-bold ${styles.outline}`}>
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => openPackageEnquiry(pkg)}
                          className={`flex-1 rounded-xl h-11 font-bold ${styles.button}`}
                        >
                          Enquire Now
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <PackagePageEnquiryForm
            categoryLabel={category.label}
            categorySlug={category.slug}
          />
        </div>
      </section>
    </div>
  );
}
