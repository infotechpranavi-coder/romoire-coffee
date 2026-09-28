'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Users,
  Star,
  ArrowRight,
  Compass,
  Hotel,
  Car as CarIcon,
  Ticket,
  Info,
} from 'lucide-react';
import { PackageData } from '@/lib/types';
import { useInquiryForm } from '@/contexts/InquiryFormContext';
import CategoryHeroBackground from '@/components/CategoryHeroBackground';

interface TourPackageSectionsProps {
  packageData: PackageData;
  showHero?: boolean;
  showEnquiry?: boolean;
  embedded?: boolean;
}

export default function TourPackageSections({
  packageData,
  showHero = true,
  showEnquiry = true,
  embedded = false,
}: TourPackageSectionsProps) {
  const { openForm } = useInquiryForm();
  const heroImage = packageData.images?.[0]?.url || '/tea-garden-in-darjeeling-india.webp';

  const openEnquiry = () => {
    openForm({
      type: 'Package',
      title: packageData.title,
      referenceId: packageData._id,
      category: packageData.packageCategory,
      duration: packageData.duration,
    });
  };

  return (
    <div className={embedded ? 'space-y-10' : 'min-h-screen bg-cream'}>
      {showHero && (
        <section className="relative text-white pt-28 pb-20 md:pb-24 overflow-hidden">
          <CategoryHeroBackground
            src={heroImage}
            alt={packageData.title}
            gradientClass="from-amber-900/80 via-amber-800/60 to-black/70"
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 mb-6">
                <Compass className="h-4 w-4 text-amber-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">
                  Upcoming Tours
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase leading-tight">
                {packageData.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-6">{packageData.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <Badge className="bg-cream/20 text-white border-white/30 px-4 py-2">
                  <Clock className="h-3.5 w-3.5 mr-1.5 inline" />
                  {packageData.duration}
                </Badge>
                <Badge className="bg-cream/20 text-white border-white/30 px-4 py-2">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 inline" />
                  {packageData.location}
                </Badge>
                <Badge className="bg-amber-500 text-white border-none px-4 py-2 font-bold">
                  From INR {packageData.price?.toLocaleString('en-IN')}/-
                </Badge>
              </div>
              {(showEnquiry || packageData._id) && (
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {showEnquiry && (
                    <Button
                      onClick={openEnquiry}
                      className="bg-hazelnut hover:bg-espresso text-white rounded-full px-8 h-12 font-bold"
                    >
                      Enquire Now
                    </Button>
                  )}
                  {packageData._id && (
                    <Link href={`/packages/${packageData._id}`}>
                      <Button variant="outline" className="rounded-full px-8 h-12 border-white/40 text-white hover:bg-cream/10">
                        Full Package Page
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <div className={embedded ? 'space-y-10' : 'container mx-auto px-4 py-12 max-w-5xl space-y-10'}>
        {/* Fixed Departures */}
        {packageData.fixedDepartures && packageData.fixedDepartures.length > 0 && (
          <Card className="border border-amber-100 shadow-sm rounded-3xl overflow-hidden">
            <div className="bg-amber-50 px-8 py-5 border-b border-amber-100 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-700" />
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">Fixed Departures</h2>
            </div>
            <CardContent className="p-8 grid sm:grid-cols-2 gap-4">
              {packageData.fixedDepartures.map((dep, idx) => (
                <div key={idx} className="p-4 bg-cream rounded-2xl border border-gray-100">
                  <p className="font-black text-hazelnut text-xs uppercase tracking-widest mb-1">{dep.month}</p>
                  <p className="text-gray-700 font-semibold">{dep.dates}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Pricing */}
        {packageData.hotelOptions && packageData.hotelOptions.length > 0 && (
          <Card className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
            <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
              <Ticket className="h-5 w-5 text-amber-600" />
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">Package Cost Per Person</h2>
            </div>
            <CardContent className="p-8 grid md:grid-cols-3 gap-4">
              {packageData.hotelOptions.map((option, idx) => {
                const [label, price] = option.includes(':')
                  ? [option.split(':')[0].trim(), option.split(':').slice(1).join(':').trim()]
                  : [option, ''];
                return (
                  <div key={idx} className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 text-center">
                    <p className="text-gray-800 font-bold text-sm mb-2">{label}</p>
                    {price && <p className="text-hazelnut font-black text-lg">{price}</p>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Highlights */}
        {packageData.keyHighlights && packageData.keyHighlights.length > 0 && (
          <Card className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
            <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">The Highlight of the Tour</h2>
            </div>
            <CardContent className="p-8">
              <ul className="space-y-3">
                {packageData.keyHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Short Itinerary */}
        {packageData.shortItinerary && packageData.shortItinerary.length > 0 && (
          <Card className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
            <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">Short Itinerary</h2>
            </div>
            <CardContent className="p-8 space-y-3">
              {packageData.shortItinerary.map((day) => (
                <div key={day.day} className="flex gap-4 p-4 bg-cream rounded-xl border border-gray-100">
                  <div className="w-12 h-12 bg-hazelnut rounded-xl flex items-center justify-center text-white font-black shrink-0">
                    {day.day}
                  </div>
                  <p className="text-gray-800 font-semibold self-center">{day.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Detailed Itinerary */}
        {packageData.itinerary && packageData.itinerary.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Detailed Itinerary</h2>
            {packageData.itinerary.map((day, index) => (
              <Card key={index} className="border border-hazelnut/20 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6 mb-4">
                    <div className="w-16 h-16 bg-hazelnut rounded-2xl flex flex-col items-center justify-center text-white shrink-0">
                      <span className="text-[9px] font-black uppercase">Day</span>
                      <span className="text-2xl font-black">{day.day}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight pt-2">{day.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed pl-22 md:pl-24">{day.description}</p>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {/* Stay */}
        {packageData.accommodation && packageData.accommodation.length > 0 && (
          <Card className="border border-indigo-100 shadow-sm rounded-3xl overflow-hidden">
            <div className="bg-indigo-50 px-8 py-5 border-b border-indigo-100 flex items-center gap-3">
              <Hotel className="h-5 w-5 text-indigo-600" />
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">Stay at or Similar</h2>
            </div>
            <CardContent className="p-8 space-y-4">
              {packageData.accommodation.map((stay, idx) => (
                <div key={idx} className="p-4 bg-cream rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900">{stay.city} = {stay.hotel}</p>
                  <p className="text-gray-500 text-sm mt-1">{stay.roomType} • {stay.nights}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Transportation */}
        {packageData.transportation && packageData.transportation.length > 0 && (
          <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
              <CarIcon className="h-5 w-5 text-slate-600" />
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">Transportation</h2>
            </div>
            <CardContent className="p-8 space-y-3">
              {packageData.transportation.map((t, idx) => (
                <div key={idx}>
                  <p className="font-bold text-gray-900">{t.type} — {t.vehicle}</p>
                  {t.description && <p className="text-gray-600 text-sm mt-1">{t.description}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Inclusions & Exclusions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {packageData.inclusions && packageData.inclusions.length > 0 && (
            <Card className="border border-green-100 rounded-3xl overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h2 className="font-black text-sm uppercase tracking-tight text-green-800">Inclusions</h2>
              </div>
              <CardContent className="p-6">
                {packageData.inclusions.map((item, idx) => {
                  if (typeof item === 'object' && item !== null && 'items' in item) {
                    const safeSubs = Array.isArray((item as any).items)
                      ? (item as any).items
                      : typeof (item as any).items === 'string'
                      ? (item as any).items.split('\n').map((s: string) => s.trim()).filter(Boolean)
                      : [];
                    return (
                      <ul key={idx} className="space-y-2">
                        {safeSubs.map((sub: string, subIdx: number) => (
                          <li key={subIdx} className="flex gap-2 text-gray-700 text-sm">
                            <span className="text-green-500 shrink-0">•</span>
                            {sub}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-gray-700 text-sm">{item as string}</p>
                  );
                })}
              </CardContent>
            </Card>
          )}
          {packageData.exclusions && packageData.exclusions.length > 0 && (
            <Card className="border border-red-100 rounded-3xl overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <h2 className="font-black text-sm uppercase tracking-tight text-red-800">Exclusions</h2>
              </div>
              <CardContent className="p-6">
                {packageData.exclusions.map((item, idx) => {
                  if (typeof item === 'object' && item !== null && 'items' in item) {
                    const safeSubs = Array.isArray((item as any).items)
                      ? (item as any).items
                      : typeof (item as any).items === 'string'
                      ? (item as any).items.split('\n').map((s: string) => s.trim()).filter(Boolean)
                      : [];
                    return (
                      <ul key={idx} className="space-y-2">
                        {safeSubs.map((sub: string, subIdx: number) => (
                          <li key={subIdx} className="flex gap-2 text-gray-700 text-sm">
                            <span className="text-red-400 shrink-0">•</span>
                            {sub}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-gray-700 text-sm">{item as string}</p>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notes */}
        {packageData.packageNotes && packageData.packageNotes.length > 0 && (
          <Card className="border border-gray-100 rounded-3xl overflow-hidden">
            <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
              <Info className="h-5 w-5 text-gray-600" />
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">Note</h2>
            </div>
            <CardContent className="p-8">
              <ul className="space-y-3">
                {packageData.packageNotes.map((note, idx) => (
                  <li key={idx} className="text-gray-600 text-sm leading-relaxed flex gap-2">
                    <span className="text-hazelnut font-bold shrink-0">*</span>
                    {note}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Policies */}
        {packageData.cancellationPolicy && packageData.cancellationPolicy.length > 0 && (
          <PolicyCard title="Cancellation Policy" items={packageData.cancellationPolicy} />
        )}
        {packageData.reschedulingPolicy && packageData.reschedulingPolicy.length > 0 && (
          <PolicyCard title="Rescheduling Policy" items={packageData.reschedulingPolicy} />
        )}
        {packageData.bookingPolicy && packageData.bookingPolicy.length > 0 && (
          <PolicyCard title="Booking Policy" items={packageData.bookingPolicy} />
        )}
      </div>
    </div>
  );
}

function PolicyCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border border-gray-100 rounded-3xl overflow-hidden">
      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
        <h2 className="font-black text-gray-900 text-sm uppercase tracking-tight">{title}</h2>
      </div>
      <CardContent className="p-8">
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-600 text-sm leading-relaxed flex gap-2">
              <span className="text-hazelnut shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
