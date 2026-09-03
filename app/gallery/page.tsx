'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { SITE_NAME } from "@/lib/branding";
import { GalleryData } from "@/lib/types";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryData | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery?activeOnly=true', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setItems(data.data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-espresso" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-cream/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
            <Camera className="h-4 w-4 text-hazelnut" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Moments Captured</span>
          </div>
          <h1 className="page-hero-title text-white tracking-tighter mb-4">
            Our Gallery
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
            Explore our roastery, brewing moments, and coffee culture with {SITE_NAME}.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-hazelnut" />
            <p className="text-gray-400 font-medium">Loading gallery...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-[40px] bg-cream">
            <Camera className="h-14 w-14 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-espresso uppercase tracking-tight">Gallery Coming Soon</h2>
            <p className="text-gray-400 mt-2 font-medium">New photos will appear here shortly.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {items.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setSelected(item)}
                className="group relative w-full break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#5A0D0D]"
              >
                <div className="relative w-full" style={{ minHeight: '200px' }}>
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-left">
                  <h3 className="text-white font-black text-lg uppercase tracking-tight leading-tight">{item.title}</h3>
                  {item.caption && (
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.caption}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => e.key === 'Escape' && setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl font-light z-10"
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.image.url}
              alt={selected.image.alt || selected.title}
              width={1200}
              height={800}
              className="max-h-[75vh] w-auto object-contain rounded-2xl"
              unoptimized
            />
            <div className="mt-6 text-center">
              <h2 className="text-white font-black text-2xl uppercase tracking-tight">{selected.title}</h2>
              {selected.caption && (
                <p className="text-white/60 mt-2 max-w-xl mx-auto">{selected.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
