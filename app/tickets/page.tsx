'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Plane, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Ticket {
    _id: string;
    title: string;
    carrier: string;
    route: string;
    price: number;
    travelClass: string;
    departureTime: string;
    arrivalTime: string;
    luggageAllowance: string;
    refundPolicy: string;
    validity: string;
    location: string;
    images: Array<{
        url: string;
        alt: string;
    }>;
    description: string;
    isAvailable: boolean;
    bookings: number;
    createdAt: string;
    updatedAt: string;
}

const demoTickets = [
    {
        _id: 'demo-ticket-1',
        title: 'Cape Town to Dubai – Premium Economy',
        carrier: 'Emirates',
        route: 'CPT → DXB',
        price: 12500,
        travelClass: 'Premium Economy',
        departureTime: '23:30',
        arrivalTime: '08:45 +1',
        luggageAllowance: '2 x 23kg checked + 7kg cabin',
        refundPolicy: 'Refundable with 15% fee before departure',
        validity: '12 months from issue date',
        location: 'Dubai, UAE',
        images: [{ url: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Emirates Flight' }],
        description: 'Direct overnight flight from Cape Town International to Dubai International. Wide seats, enhanced dining, and dedicated cabin service.',
        isAvailable: true,
        bookings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: 'demo-ticket-2',
        title: 'Johannesburg to London Heathrow – Business Class',
        carrier: 'South African Airways',
        route: 'JNB → LHR',
        price: 38000,
        travelClass: 'Business',
        departureTime: '18:15',
        arrivalTime: '07:30 +1',
        luggageAllowance: '3 x 32kg checked + 18kg cabin',
        refundPolicy: 'Fully refundable up to 24 hours before departure',
        validity: '12 months from issue date',
        location: 'London, United Kingdom',
        images: [{ url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Business Class Flight' }],
        description: 'Non-stop overnight service from OR Tambo to London Heathrow. Lie-flat seats, premium dining, and exclusive lounge access at both airports.',
        isAvailable: true,
        bookings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: 'demo-ticket-3',
        title: 'Durban to Cape Town – Economy Saver',
        carrier: 'Airlink',
        route: 'DUR → CPT',
        price: 1800,
        travelClass: 'Economy',
        departureTime: '06:00',
        arrivalTime: '08:10',
        luggageAllowance: '1 x 20kg checked + 7kg cabin',
        refundPolicy: 'Non-refundable, name change allowed once',
        validity: '3 months from issue date',
        location: 'Cape Town, South Africa',
        images: [{ url: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Domestic Flight' }],
        description: 'Quick and affordable domestic flight from King Shaka International in Durban to Cape Town International. Perfect for early morning arrivals.',
        isAvailable: true,
        bookings: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
] as Ticket[];

const TicketsPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>(demoTickets);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(demoTickets);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [airlineFilter, setAirlineFilter] = useState("all");
    const router = useRouter();

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        filterTickets();
    }, [tickets, searchTerm, classFilter, airlineFilter]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/tickets');
            const result = await response.json();
            if (result.success && result.data && result.data.length > 0) {
                setTickets(result.data);
            } else {
                setTickets(demoTickets);
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
            setTickets(demoTickets);
        } finally {
            setLoading(false);
        }
    };

    const filterTickets = () => {
        let filtered = tickets;

        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.carrier.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (classFilter !== "all") {
            filtered = filtered.filter(t => t.travelClass === classFilter);
        }

        setFilteredTickets(filtered);
    };

    const formatPrice = (price: number) => {
        // Use a locale-independent formatter to avoid SSR hydration mismatch
        // (en-ZA uses space as thousands sep on some systems, comma on others)
        return 'R ' + Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const generateSlug = (title: string, id: string) => {
        return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
    };

    if (loading && tickets.length === 0) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-espresso mx-auto mb-4"></div>
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Searching flights...</p>
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
                        backgroundImage: "url('https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-6">
                            Global Air Travel
                        </p>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] mb-6 leading-none tracking-tighter uppercase">
                            Airline Tickets
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto font-medium">
                            Premium flight booking services for domestic and international routes with 24/7 concierge support
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Plane className="h-4 w-4" />
                                <span>Multi-City Routes</span>
                            </div>
                            <span className="text-white/30">·</span>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>Global Network</span>
                            </div>
                            <span className="text-white/30">·</span>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Verified Bookings</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-cream border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search by destination or airline..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Travel Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Class</SelectItem>
                                    <SelectItem value="Economy">Economy Class</SelectItem>
                                    <SelectItem value="Business">Business Class</SelectItem>
                                    <SelectItem value="First">First Class</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={airlineFilter} onValueChange={setAirlineFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Airlines" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Airlines</SelectItem>
                                    <SelectItem value="South African Airways">South African Airways</SelectItem>
                                    <SelectItem value="Airlink">Airlink</SelectItem>
                                    <SelectItem value="Safair">Safair</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="bg-gray-900 hover:bg-black text-white font-bold h-full rounded-xl uppercase tracking-widest text-[10px]">
                                Check Availability
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-16 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTickets.map((t, index) => (
                            <motion.div
                                key={t._id}
                                className="group bg-cream rounded-[32px] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer flex flex-col border border-gray-100"
                                onClick={() => router.push(`/tickets/${generateSlug(t.title, t._id)}`)}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                            >
                                {/* Header / Image area */}
                                <div className="relative w-full h-[200px] flex-shrink-0">
                                    {t.images && t.images.length > 0 ? (
                                        <Image src={t.images[0].url} alt={t.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                            <Plane className="h-10 w-10 text-gray-200" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                    <div className="absolute top-6 left-6">
                                        <Badge className="bg-cream/90 backdrop-blur-sm text-amber-600 border-none font-bold px-3 py-1 shadow-sm">
                                            {t.isAvailable ? 'Available Now' : 'Limited Seats'}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-4 right-6 text-right">
                                        <div className="text-2xl font-black text-espresso">{formatPrice(t.price)}</div>
                                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Inclusive Fee</div>
                                    </div>
                                </div>

                                <div className="p-8 pt-2 flex flex-col flex-grow relative">
                                    <div className="absolute -top-4 left-[-12px] w-6 h-6 rounded-full bg-cream" />
                                    <div className="absolute -top-4 right-[-12px] w-6 h-6 rounded-full bg-cream" />
                                    <div className="absolute -top-1 left-4 right-4 border-t border-dashed border-gray-200" />

                                    <div className="flex-grow pt-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-1">Destination</p>
                                                <h3 className="text-2xl font-black text-espresso leading-tight uppercase tracking-tighter group-hover:text-gray-900 transition-colors truncate max-w-[200px]">{t.location}</h3>
                                            </div>
                                            <div className="text-right">
                                                <Plane className="h-6 w-6 text-gray-200 ml-auto rotate-45" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 py-4 border-y border-gray-50 mb-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Airline</p>
                                                <p className="text-sm font-bold text-espresso">{t.carrier}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Route</p>
                                                <p className="text-sm font-bold text-espresso">{t.route}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class</p>
                                                <p className="text-sm font-bold text-espresso">{t.travelClass}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID</p>
                                                <p className="text-[10px] font-bold text-gray-300">#{t._id.substring(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-xs leading-relaxed mb-6 italic">
                                        {t.description || "Special seasonal fares and corporate group bookings available upon request."}
                                    </p>
                                </div>

                                <div className="mt-auto p-8 pt-0">
                                    <Button
                                        className="w-full bg-espresso hover:bg-hazelnut text-white font-black py-6 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 group/btn uppercase tracking-widest text-[10px]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/tickets/${generateSlug(t.title, t._id)}`);
                                        }}
                                    >
                                        <span>View Flight Details</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TicketsPage;
