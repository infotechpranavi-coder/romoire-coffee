import { SITE_NAME, brandedText } from "@/lib/branding";
import { useCategoryLabels } from "@/contexts/CategoryLabelsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Package,
  X,
  Car,
  Hotel,
  Clock,
  Sparkles,
  CheckCircle,
  Building,
  Info,
  TrendingUp,
  Plus,
  PlayCircle,
  Heart,
  ShieldCheck,
  Check,
  MessageSquare,
  Car as CarIcon,
  Award
} from "lucide-react";

// Utility function to render text with bold formatting
const renderBoldText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold">{boldText}</strong>;
    }
    return part;
  });
};

import { PackageData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: PackageData | null;
}

const DetailCard = ({
  title,
  icon: Icon,
  headerBg,
  iconBg,
  iconColor,
  children,
  className
}: {
  title: string;
  icon: any;
  headerBg: string;
  iconBg?: string;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn("overflow-hidden border-none shadow-sm rounded-2xl", className)}>
    <div className={cn("px-5 py-3 flex items-center gap-3", headerBg)}>
      {iconBg ? (
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shadow-sm", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor || "text-white")} />
        </div>
      ) : (
        <Icon className={cn("h-5 w-5", iconColor || "text-gray-800")} />
      )}
      <h3 className="text-lg font-bold tracking-tight text-gray-900">{title}</h3>
    </div>
    <CardContent className="p-5 bg-cream">
      {children}
    </CardContent>
  </Card>
);

const PackageDetailModal = ({ isOpen, onClose, packageData }: PackageDetailModalProps) => {
  const { getCategoryByValue: resolveCategoryByValue } = useCategoryLabels();
  if (!packageData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[92vw] p-0 border-none bg-gray-50/30 overflow-hidden rounded-2xl shadow-2xl [&>button.absolute]:hidden">
        <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div className="relative">
            {/* Hero Section */}
            <div className="relative h-[200px] w-full">
              {packageData.images && packageData.images.length > 0 ? (
                <img
                  src={packageData.images[0].url}
                  alt={packageData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all z-20 group"
              >
                <X className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 z-10">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-hazelnut text-white hover:bg-hazelnut border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {resolveCategoryByValue(packageData.packageCategory)?.label || packageData.packageCategory}
                  </Badge>
                  <Badge className="bg-cream/10 backdrop-blur-md text-white border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {packageData.duration}
                  </Badge>
                  <Badge className="bg-cream/10 backdrop-blur-md text-white border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {packageData.location}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-lg line-clamp-2">
                  {packageData.title}
                </h1>
                <p className="text-white/90 text-sm font-medium tracking-wide max-w-2xl leading-snug line-clamp-2">
                  {packageData.subtitle}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Experience Highlights Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 text-gray-800" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Experience Highlights</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Idea For & Services */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {packageData.ideaFor && (
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="h-5 w-5 text-emerald-600" />
                        <h4 className="text-base font-bold text-gray-900">Ideal For</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {packageData.ideaFor.split(',').map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="bg-cream/80 border-emerald-100 text-emerald-700 font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {packageData.services && (
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        <h4 className="text-base font-bold text-gray-900">Our Services</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {typeof packageData.services === 'string' ? (
                          packageData.services.split(',').map((s, idx) => (
                            <Badge key={idx} variant="outline" className="bg-cream/80 border-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                              {s.trim()}
                            </Badge>
                          ))
                        ) : (
                          packageData.services.map((s, idx) => (
                            <Badge key={idx} variant="outline" className="bg-cream/80 border-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                              {s}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Abstract Card */}
                {packageData.abstract && (
                  <DetailCard
                    title="Abstract"
                    icon={Info}
                    headerBg="bg-blue-50"
                    iconColor="text-blue-900"
                  >
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {packageData.abstract}
                    </p>
                  </DetailCard>
                )}

                {/* Tour Overview Card */}
                {packageData.tourOverview && (
                  <DetailCard
                    title="Tour Overview"
                    icon={Sparkles}
                    headerBg="bg-purple-50"
                    iconColor="text-purple-900"
                  >
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {packageData.tourOverview}
                    </p>
                  </DetailCard>
                )}

                {/* Key Highlights Card */}
                {packageData.keyHighlights && packageData.keyHighlights.length > 0 && (
                  <DetailCard
                    title="Key Highlights"
                    icon={Star}
                    headerBg="bg-emerald-50"
                    iconBg="bg-emerald-500"
                    iconColor="text-white"
                    className="lg:col-span-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {packageData.keyHighlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-5 group">
                          <div className="mt-1.5 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 group-hover:scale-110 transition-all">
                            <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                          </div>
                          <span className="text-gray-700 font-bold text-xl leading-snug">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </DetailCard>
                )}

                {/* Hotel Options Card */}
                {packageData.hotelOptions && packageData.hotelOptions.length > 0 && (
                  <DetailCard
                    title="Hotel Options"
                    icon={Building}
                    headerBg="bg-indigo-50"
                    iconBg="bg-indigo-600"
                    iconColor="text-white"
                  >
                    <ul className="space-y-5">
                      {packageData.hotelOptions.map((option, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-gray-700 font-bold text-xl">
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          {option}
                        </li>
                      ))}
                    </ul>
                  </DetailCard>
                )}

                {/* Best Time to Visit Card */}
                {packageData.bestTimeToVisit && (
                  <DetailCard
                    title={`Best Time to Visit ${packageData.place === 'dubai' ? 'Dubai' : 'this Destination'}`}
                    icon={Calendar}
                    headerBg="bg-orange-50"
                    iconBg="bg-orange-500"
                    iconColor="text-white"
                  >
                    <div className="space-y-8">
                      <p className="text-gray-600 font-bold text-xl italic leading-relaxed">
                        {packageData.bestTimeToVisit.yearRound}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {packageData.bestTimeToVisit.winter && (
                          <div className="p-6 rounded-2xl border border-orange-100 bg-orange-50/40">
                            <h4 className="font-serif font-black text-2xl mb-3 text-gray-900 tracking-tight">Winter:</h4>
                            <p className="text-gray-700 font-medium leading-[1.6] text-lg">{packageData.bestTimeToVisit.winter}</p>
                          </div>
                        )}
                        {packageData.bestTimeToVisit.summer && (
                          <div className="p-6 rounded-2xl border border-orange-100 bg-orange-50/40">
                            <h4 className="font-serif font-black text-2xl mb-3 text-gray-900 tracking-tight">Summer:</h4>
                            <p className="text-gray-700 font-medium leading-[1.6] text-lg">{packageData.bestTimeToVisit.summer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DetailCard>
                )}

                {/* Why Choose This Trip Card */}
                {packageData.whyChooseThisTrip && packageData.whyChooseThisTrip.length > 0 && (
                  <DetailCard
                    title="Why Choose This Trip?"
                    icon={Heart}
                    headerBg="bg-pink-50"
                    iconBg="bg-pink-600"
                    iconColor="text-white"
                  >
                    <div className="space-y-5">
                      {packageData.whyChooseThisTrip.map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-5 group">
                          <div className="shrink-0 w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center group-hover:bg-pink-50 group-hover:scale-105 transition-all">
                            <Check className="h-4 w-4 text-pink-500 stroke-[4]" />
                          </div>
                          <span className="text-gray-700 font-bold text-xl leading-snug">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </DetailCard>
                )}

                {/* Why Premium [Brand] Tours Card */}
                <DetailCard
                  title={`Why Premium ${packageData.place === 'dubai' ? 'Dubai' : SITE_NAME} for This Journey?`}
                  icon={ShieldCheck}
                  headerBg="bg-teal-50"
                  iconBg="bg-teal-600"
                  iconColor="text-white"
                >
                  <div className="space-y-5">
                    {(packageData.whyPremiumDubaiTours || packageData.whyPremiumSkygoTours || []).map((point, idx) => (
                      <div key={idx} className="flex items-center gap-5 group">
                        <div className="shrink-0 w-8 h-8 rounded-full border border-teal-200 flex items-center justify-center group-hover:bg-teal-50 group-hover:scale-105 transition-all">
                          <Check className="h-4 w-4 text-teal-600 stroke-[4]" />
                        </div>
                        <span className="text-gray-700 font-bold text-xl leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </DetailCard>

                {/* About [Brand] Card */}
                <DetailCard
                  title={`About ${packageData.place === 'dubai' ? 'Premium Dubai' : SITE_NAME}`}
                  icon={Info}
                  headerBg="bg-amber-50"
                  iconColor="text-amber-900"
                  className="lg:col-span-2"
                >
                  <p className="text-gray-700 leading-[1.8] text-xl font-medium">
                    {brandedText(packageData.about)}
                  </p>
                </DetailCard>
              </div>

              {/* Daily Itinerary Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-gray-800" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Daily Itinerary Schedule</h2>
                </div>

                <div className="space-y-4">
                  {packageData.itinerary.map((day, idx) => (
                    <Card key={idx} className="overflow-hidden border-none shadow-sm rounded-xl">
                      <div className="flex flex-col md:flex-row min-h-[100px]">
                        <div className="md:w-24 bg-gray-900 text-white flex flex-col items-center justify-center p-4 shrink-0 relative overflow-hidden">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 relative z-10">Day</span>
                          <span className="text-3xl font-bold relative z-10">{day.day}</span>
                        </div>
                        <div className="p-5 bg-cream flex-grow flex flex-col justify-center">
                          <h4 className="text-base font-bold text-gray-900 mb-2 tracking-tight leading-tight">{day.title}</h4>
                          <div className="space-y-1">
                            {day.description.split('\n').map((line, lIdx) => (
                              <p key={lIdx} className="text-gray-600 leading-relaxed text-sm flex items-start gap-2">
                                {day.description.includes('\n') && <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />}
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8">
                {/* Inclusions */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    Inclusions
                  </h3>
                  <div className="p-10 rounded-[40px] bg-cream border border-gray-100 shadow-sm space-y-8 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-1000" />
                    {Array.isArray(packageData.inclusions) && typeof packageData.inclusions[0] === 'object' ? (
                      (packageData.inclusions as any[]).map((group, idx) => {
                        const safeItems: string[] = Array.isArray(group.items)
                          ? group.items
                          : typeof group.items === 'string'
                          ? group.items.split('\n').map((s: string) => s.trim()).filter(Boolean)
                          : [];
                        return (
                          <div key={idx} className="space-y-4 relative z-10">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{group.category}</h4>
                            <ul className="grid grid-cols-1 gap-3">
                              {safeItems.map((item: string, i: number) => (
                                <li key={i} className="text-lg font-bold text-gray-700 flex items-start gap-4">
                                  <span className="mt-2.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })
                    ) : (
                      <ul className="grid grid-cols-1 gap-4 relative z-10">
                        {(packageData.inclusions as string[])?.map((item, idx) => (
                          <li key={idx} className="text-lg font-bold text-gray-700 flex items-start gap-4">
                            <span className="mt-2.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                      <X className="h-6 w-6 text-rose-600" />
                    </div>
                    Exclusions
                  </h3>
                  <div className="p-10 rounded-[40px] bg-cream border border-gray-100 shadow-sm space-y-8 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-1000" />
                    {Array.isArray(packageData.exclusions) && typeof packageData.exclusions[0] === 'object' ? (
                      (packageData.exclusions as any[]).map((group, idx) => {
                        const safeItems: string[] = Array.isArray(group.items)
                          ? group.items
                          : typeof group.items === 'string'
                          ? group.items.split('\n').map((s: string) => s.trim()).filter(Boolean)
                          : [];
                        return (
                          <div key={idx} className="space-y-4 relative z-10">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{group.category}</h4>
                            <ul className="grid grid-cols-1 gap-3">
                              {safeItems.map((item: string, i: number) => (
                                <li key={i} className="text-lg font-bold text-gray-700 flex items-start gap-4">
                                  <span className="mt-2.5 w-2 h-2 rounded-full bg-rose-300 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })
                    ) : (
                      <ul className="grid grid-cols-1 gap-4 relative z-10">
                        {(packageData.exclusions as string[])?.map((item, idx) => (
                          <li key={idx} className="text-lg font-bold text-gray-700 flex items-start gap-4">
                            <span className="mt-2.5 w-2 h-2 rounded-full bg-rose-300 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Logistics & Stay Details Section */}
              {(packageData.transportation?.length > 0 || packageData.accommodation?.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8">
                  {/* Transportation */}
                  {packageData.transportation?.length > 0 && (
                    <div className="space-y-8">
                      <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                          <CarIcon className="h-6 w-6 text-slate-600" />
                        </div>
                        Logistics
                      </h3>
                      <div className="p-10 rounded-[40px] bg-cream border border-gray-100 shadow-sm space-y-6">
                        {packageData.transportation.map((t, idx) => (
                          <div key={idx} className="pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                            <p className="font-black text-gray-900 text-sm uppercase mb-1">{t.type}</p>
                            <p className="text-gray-500 font-bold text-xs mb-2 tracking-tight">{t.vehicle}</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{t.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accommodation */}
                  {packageData.accommodation?.length > 0 && (
                    <div className="space-y-8">
                      <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                          <Hotel className="h-6 w-6 text-indigo-600" />
                        </div>
                        Stay Details
                      </h3>
                      <div className="p-10 rounded-[40px] bg-cream border border-gray-100 shadow-sm space-y-6">
                        {packageData.accommodation.map((a, idx) => (
                          <div key={idx} className="pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                            <p className="font-black text-gray-900 text-sm uppercase mb-1">{a.city}: {a.hotel}</p>
                            <p className="text-gray-500 font-bold text-xs tracking-tight">{a.roomType} • {a.nights} • {a.rooms} Room(s)</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FAQs Section */}
              {packageData.faqs && packageData.faqs.length > 0 && (
                <div className="space-y-10 pt-8">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shadow-inner">
                      <MessageSquare className="h-7 w-7 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Need to Know (FAQs)</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packageData.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-cream border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-1">
                            <Plus className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-black text-gray-900 text-base leading-tight uppercase tracking-tight">{faq.question}</p>
                            <p className="text-gray-600 text-sm italic font-medium leading-relaxed border-l-2 border-indigo-100 pl-4">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guest Reviews Section */}
              {packageData.reviews && packageData.reviews.length > 0 && (
                <div className="space-y-10 pt-8">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shadow-inner">
                      <Star className="h-7 w-7 text-hazelnut" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Guest Feedback & Reviews</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {packageData.reviews.map((review, idx) => (
                      <Card key={idx} className="p-10 border-none bg-cream shadow-sm rounded-[32px] hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-hazelnut/10 flex items-center justify-center font-black text-hazelnut text-xl shadow-inner">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-gray-900">{review.name}</h4>
                              <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn("h-4 w-4", i < review.rating ? "fill-hazelnut text-hazelnut" : "fill-gray-200 text-gray-200")}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 font-bold leading-relaxed italic text-xl">
                          "{review.comment}"
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-5 bg-cream border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl z-30">
          <div className="text-center sm:text-left">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Package Investment</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-hazelnut tracking-tight uppercase text-sm">Enquire for Quote</span>
              <span className="text-gray-400 font-medium text-sm">/ Complete Journey</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto border-gray-200 text-gray-600 font-bold uppercase tracking-widest h-10 px-6 rounded-xl hover:bg-gray-50 transition-all text-[10px]"
            >
              Close Details
            </Button>
            <Button className="w-full sm:w-auto bg-hazelnut hover:bg-[#a67e3a] text-white font-bold uppercase tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-hazelnut/20 group transition-all text-[10px]">
              Reservations & Support <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailModal;
