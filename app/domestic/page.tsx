'use client'

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, Star, Search, Filter, Calendar, ArrowRight, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Package {
    _id: string;
    title: string;
    subtitle: string;
    about: string;
    services: string[];
    tourDetails: string;
    itinerary: Array<{
        day: number;
        title: string;
        description: string;
    }>;
    price: number;
    duration: string;
    location: string;
    capacity: string;
    packageCategory: string;
    packageType: string;
    images: Array<{
        url: string;
        alt: string;
    }>;
    bookings: number;
    rating: number;
}

const DomesticPage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const router = useRouter();

    const fetchPackages = useCallback(async () => {
        try {
            const response = await fetch('/api/packages');
            const result = await response.json();
            if (result.success) {
                // Filter for domestic packages
                const domesticPackages = result.data.filter((pkg: Package) =>
                    pkg.packageType === 'domestic'
                );
                setPackages(domesticPackages);
            }
        } catch (error) {
            console.error('Error fetching domestic packages:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const generateSlug = (title: string, id: string) => {
        return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
    };

    const filterPackages = useCallback(() => {
        let filtered = packages;

        if (searchTerm) {
            filtered = filtered.filter(pkg =>
                pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (priceFilter !== "all") {
            filtered = filtered.filter(pkg => {
                switch (priceFilter) {
                    case "under-50k": return pkg.price < 50000;
                    case "over-50k": return pkg.price >= 50000;
                    default: return true;
                }
            });
        }

        setFilteredPackages(filtered);
    }, [packages, searchTerm, priceFilter]);

    useEffect(() => {
        filterPackages();
    }, [filterPackages]);


    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading domestic packages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <section className="relative text-white py-28 md:py-40 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-6">
                            Local Experiences
                        </p>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] mb-6 leading-none tracking-tighter uppercase">
                            Domestic
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto font-medium">
                            Experience the Africa in Miniature with curated tours across the diverse landscapes and rich traditions of Cameroon
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
                            <span>{packages.length} Local Tours</span>
                            <span className="text-white/30">·</span>
                            <span>Regional Expertise</span>
                            <span className="text-white/30">·</span>
                            <span>Authentic Experiences</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-cream border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search local tours..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={priceFilter} onValueChange={setPriceFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Price Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Prices</SelectItem>
                                    <SelectItem value="under-50k">Under ZAR 50,000</SelectItem>
                                    <SelectItem value="over-50k">Over ZAR 50,000</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-16 bg-cream">
                <div className="container mx-auto px-4">
                    {filteredPackages.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-black text-espresso mb-2 uppercase tracking-tighter">No local tours found</h3>
                            <p className="text-gray-400 font-medium">Try adjusting your search</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPackages.map((pkg, index) => (
                                <motion.div
                                    key={pkg._id}
                                    className="group bg-cream rounded-[32px] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer flex flex-col"
                                    onClick={() => router.push(`/packages/${generateSlug(pkg.title, pkg._id)}`)}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                                >
                                    <div className="relative w-full h-[220px] flex-shrink-0">
                                        {pkg.images && pkg.images.length > 0 ? (
                                            <Image src={pkg.images[0].url} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Home className="h-10 w-10 text-gray-300" /></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex-grow">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{pkg.duration} &nbsp;·&nbsp; {pkg.location}</p>
                                            <h3 className="text-xl font-black text-espresso leading-tight mb-2 uppercase tracking-tighter group-hover:text-hazelnut transition-colors">{pkg.title}</h3>
                                            <div className="flex items-center gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(pkg.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />)}
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{pkg.subtitle || pkg.about}</p>
                                        </div>
                                        <div className="flex flex-col gap-3 mt-6 pt-5 border-t border-gray-100">
                                            <Button
                                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/packages/${generateSlug(pkg.title, pkg._id)}`);
                                                }}
                                            >
                                                <span>View Detailed Page</span>
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-5 rounded-xl transition-all duration-300"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/contact?packageName=${encodeURIComponent(pkg.title)}&packageType=domestic`);
                                                }}
                                            >
                                                Enquiry Now
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default DomesticPage;
