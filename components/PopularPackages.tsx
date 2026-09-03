'use client'

import { useState, useEffect } from "react";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInquiryForm } from "@/contexts/InquiryFormContext";

interface PopularPackagesProps {
  initialPackages?: any[];
}

const PopularPackages = ({ initialPackages }: PopularPackagesProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const [packages, setPackages] = useState<any[]>(initialPackages || []);
  const [isLoading, setIsLoading] = useState(!initialPackages);

  useEffect(() => {
    // Only fetch if initialPackages not provided
    if (initialPackages && initialPackages.length > 0) {
      setIsLoading(false);
      return;
    }

    const fetchPopularPackages = async () => {
      try {
        const response = await fetch('/api/packages?popular=true');
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setPackages(result.data);
        } else {
          // No longer falling back to static data as per user request
          setPackages([]);
        }
      } catch (error) {
        console.error('Error fetching popular packages:', error);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPackages();
  }, [initialPackages]);

  if (isLoading) {
    return (
      <div className="py-24 bg-cream flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-hazelnut animate-spin mb-4" />
        <p className="text-espresso font-bold uppercase tracking-widest text-sm">Loading coffees...</p>
      </div>
    );
  }

  if (!packages.length) {
    return null;
  }

  // Split packages into two columns as per the original design
  // Column 1 gets the first 2, Column 2 gets the next 3
  const col1 = packages.slice(0, 2);
  const col2 = packages.slice(2, 5);

  return (
    <section
      id="packages"
      className="py-24 bg-cream"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

          {/* Left Column: Title + 2 Cards */}
          <div className="space-y-6 lg:space-y-8 lg:pr-2">
            <div className="mb-4 md:mb-6 lg:mb-8">
              <h2 className="text-5xl sm:text-6xl lg:text-[3.25rem] xl:text-7xl 2xl:text-8xl font-[1000] text-espresso leading-[0.9] tracking-tighter uppercase">
                POPULAR<br />COFFEES
              </h2>
            </div>

            {col1.map((pkg, idx) => (
              <PackageCard
                key={pkg._id || pkg.id}
                pkg={pkg}
                index={idx}
                router={router}
                openForm={openForm}
              />
            ))}
          </div>

          {/* Right Column: 3 Cards + View All Button (With Offset) */}
          <div className="space-y-6 lg:space-y-8 lg:pt-4 xl:pt-12">
            {col2.map((pkg, idx) => (
              <PackageCard
                key={pkg._id || pkg.id}
                pkg={pkg}
                index={idx + col1.length}
                router={router}
                openForm={openForm}
              />
            ))}

            {/* View All Button - Compact & Professional */}
            <div className="pt-8 pl-4">
              <Button
                variant="ghost"
                className="group flex items-center gap-3 text-espresso font-black text-xl uppercase tracking-tighter hover:bg-transparent hover:text-hazelnut transition-all duration-300"
                onClick={() => router.push('/packages')}
              >
                <span>View All Products</span>
                <div className="w-10 h-10 rounded-full border border-hazelnut/10 flex items-center justify-center group-hover:bg-hazelnut group-hover:border-hazelnut transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper component for cleaner code
const PackageCard = ({ pkg, index, router, openForm }: any) => {
    const packageId = pkg._id || pkg.id;
    const itemType = pkg.type || 'package';
    
    const generateSlug = (title: string, id: string) => {
        return `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
    };
    
    const slug = generateSlug(pkg.title, packageId);
    const route = itemType === 'tour' ? `/tours/${slug}` : itemType === 'ticket' ? `/tickets/${slug}` : `/packages/${slug}`;
    const imageUrl = pkg.images && pkg.images.length > 0 ? pkg.images[0].url : pkg.image;

    return (
      <motion.div
        className="group bg-cream rounded-[28px] lg:rounded-[32px] xl:rounded-[40px] overflow-hidden p-2.5 lg:p-3 shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer flex flex-col sm:flex-row h-full sm:h-[260px] lg:h-[240px] xl:h-[280px] 2xl:h-[320px] border border-white"
        onClick={() => router.push(route)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-[180px] lg:w-[150px] xl:w-[200px] 2xl:w-[260px] h-[200px] sm:h-full flex-shrink-0">
        <Image
          src={imageUrl}
          alt={pkg.title}
          fill
          className="object-cover rounded-[22px] lg:rounded-[24px] xl:rounded-[30px] transform group-hover:scale-105 transition-transform duration-1000"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 180px, 260px"
        />
      </div>

      {/* Info Section */}
      <div className="p-4 lg:p-4 xl:p-6 flex flex-col justify-between flex-grow min-w-0">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
            {pkg.duration} &nbsp;·&nbsp; SPECIALTY ROAST
          </p>
          <h3 className="text-lg lg:text-xl xl:text-2xl font-black text-espresso leading-[1.1] mb-2 uppercase tracking-tighter group-hover:text-hazelnut transition-colors line-clamp-2">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-1 mb-2 xl:mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-hazelnut text-hazelnut" />
            ))}
            <span className="text-[10px] font-bold text-gray-300 ml-1">Verified Roast</span>
          </div>
          <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2 font-medium">
            {pkg.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 xl:gap-3 mt-3 xl:mt-4">
          <Button
            className="flex-1 bg-hazelnut hover:bg-espresso text-white font-bold py-3 xl:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs xl:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(route);
            }}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-espresso text-espresso hover:bg-espresso hover:text-white font-bold py-3 xl:py-4 rounded-xl transition-all duration-300 text-xs xl:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              openForm({
                type: 'Package',
                title: pkg.title,
                referenceId: packageId,
                category: pkg.packageCategory,
                duration: pkg.duration,
              });
            }}
          >
            Order Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};


export default PopularPackages;
