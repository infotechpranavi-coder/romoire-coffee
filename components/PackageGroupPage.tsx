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
  PackageNavGroup,
  GROUP_HERO_IMAGES,
  accentStyles,
} from '@/lib/packageExperienceCategories';
import { COFFEE_IMAGES } from '@/lib/coffeeImages';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
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

const groupAccent: Record<string, keyof typeof accentStyles> = {
  water: 'teal',
  'land-motor': 'orange',
  'land-physical': 'green',
  sky: 'violet',
  'upcoming-tours': 'amber',
};

interface PackageGroupPageProps {
  group: PackageNavGroup;
}

export default function PackageGroupPage({ group: baseGroup }: PackageGroupPageProps) {
  const { navGroups, getCategoryByValue: resolveCategoryByValue } = useCategoryLabels();
  const group = navGroups.find((item) => item.slug === baseGroup.slug) ?? baseGroup;
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const styles = accentStyles[groupAccent[group.slug] ?? 'amber'];
  const heroImage =
    GROUP_HERO_IMAGES[group.slug] ??
    group.items[0]?.heroImage ??
    COFFEE_IMAGES.hero;

  useEffect(() => {
    fetchPackages();
  }, [group.slug]);

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
      const response = await fetch(`/api/packages?group=${encodeURIComponent(group.slug)}`);
      const result = await response.json();
      const data = result.success && result.data ? result.data : [];
      setPackages(data);
    } catch (error) {
      console.error('Error fetching group packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const openPackageEnquiry = (pkg: PackageItem) => {
    const cat = resolveCategoryByValue(pkg.packageCategory);
    openForm({
      type: 'Package',
      title: pkg.title,
      referenceId: pkg._id,
      category: cat?.label || group.label,
      duration: pkg.duration,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${styles.spinner} mx-auto mb-4`} />
          <p className="text-gray-600">Loading {group.label.toLowerCase()} packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <section className="relative text-white pt-28 pb-20 md:pb-24 overflow-hidden">
        <CategoryHeroBackground
          src={heroImage}
          alt={group.label}
          gradientClass={styles.gradient}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 mb-6">
              <Compass className={`h-4 w-4 ${styles.icon}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">
                {SITE_NAME}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tight uppercase">{group.label}</h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto font-medium leading-relaxed">
              All {group.label.toLowerCase()} coffees — browse beans from our collection below
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-cream border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {group.items.map((category) => (
              <Link key={category.slug} href={category.href}>
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50"
                >
                  {category.label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-10">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.muted} mb-1`}>
                  {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-espresso uppercase tracking-tight">
                  {group.label} Packages
                </h2>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={`Search ${group.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-cream shadow-sm focus:outline-none focus:ring-2 ${styles.focusRing}`}
                />
              </div>
            </div>

            {filteredPackages.length === 0 ? (
              <div className="text-center py-16 rounded-[32px] bg-cream border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-espresso mb-2">No packages in {group.label} yet</h3>
                <p className="text-gray-600 mb-6">Add packages from the dashboard or run the seed API.</p>
                <Button onClick={() => router.push('/packages')}>View All Categories</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => {
                  const cat = resolveCategoryByValue(pkg.packageCategory);
                  return (
                    <article
                      key={pkg._id}
                      className="group relative bg-cream rounded-[28px] overflow-hidden shadow-lg shadow-gray-200/60 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
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
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${cat?.heroImage ?? heroImage}')` }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        {cat && (
                          <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${styles.badge} text-white border-none font-bold text-[10px] uppercase tracking-wider`}>
                            {cat.label}
                          </Badge>
                        )}
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-black text-xl leading-tight line-clamp-2">{pkg.title}</p>
                          <p className="text-white/75 text-sm mt-1 line-clamp-1">{pkg.subtitle}</p>
                        </div>
                        <div className="absolute top-4 right-4 bg-cream/95 backdrop-blur-sm text-espresso font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-cream border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <PackagePageEnquiryForm categoryLabel={group.label} categorySlug={group.slug} />
        </div>
      </section>
    </div>
  );
}
