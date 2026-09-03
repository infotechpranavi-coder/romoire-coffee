'use client'

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Clock, Users, Mountain, Camera, Heart, Globe, Plane, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  images: Array<{
    url: string;
    alt: string;
  }>;
  bookings: number;
  rating: number;
}

const DestinationsPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { name: "Cultural", icon: Heart, color: "bg-blue-500" },
    { name: "Adventure", icon: Mountain, color: "bg-green-500" },
    { name: "Wildlife", icon: Camera, color: "bg-orange-500" },
    { name: "Trekking", icon: Mountain, color: "bg-purple-500" },
    { name: "Spiritual", icon: Heart, color: "bg-red-500" },
    { name: "Beach", icon: Globe, color: "bg-cyan-500" }
  ];

  const fetchPackages = useCallback(async () => {
    try {
      const response = await fetch('/api/packages');
      const result = await response.json();
      if (result.success) {
        setPackages(result.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const filterPackages = useCallback(() => {
    let filtered = packages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(pkg => pkg.packageCategory === selectedCategory);
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, selectedCategory]);

  useEffect(() => {
    filterPackages();
  }, [filterPackages]);

  const getCategoryCount = (categoryName: string) => {
    return packages.filter(pkg => pkg.packageCategory === categoryName).length;
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : Heart;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : "bg-blue-500";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const groupedPackages = selectedCategory
    ? { [selectedCategory]: filteredPackages }
    : categories.reduce((acc, category) => {
      const categoryPackages = filteredPackages.filter(pkg => pkg.packageCategory === category.name);
      if (categoryPackages.length > 0) {
        acc[category.name] = categoryPackages;
      }
      return acc;
    }, {} as Record<string, Package[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative text-white py-28 md:py-40 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/thumbnail_2_6_15_6_33_261.webp')` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-hazelnut font-bold uppercase tracking-[0.3em] text-sm mb-6">Explore Dubai</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] mb-6 leading-none tracking-tighter uppercase">
              Destinations
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto font-medium">
              Discover amazing Dubai destinations through our curated travel packages
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
              <span>{packages.length} Packages Available</span>
              <span className="text-white/30">·</span>
              <span>{categories.length} Categories</span>
              <span className="text-white/30">·</span>
              <span>Expert Guided</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-cream border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg py-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Package Categories */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-espresso mb-8">
              Explore by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const count = getCategoryCount(category.name);
                return (
                  <Card
                    key={index}
                    className={`text-center hover:shadow-lg transition-all cursor-pointer ${selectedCategory === category.name
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
                  >
                    <CardContent className="p-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${selectedCategory === category.name
                        ? 'bg-primary text-white'
                        : `${category.color} text-white`
                        }`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className={`text-sm font-semibold mb-1 ${selectedCategory === category.name ? 'text-primary' : 'text-espresso'
                        }`}>
                        {category.name}
                      </h3>
                      <p className={`text-xs font-medium ${selectedCategory === category.name ? 'text-primary' : 'text-primary'
                        }`}>
                        {count} Package{count !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Clear Filter Button */}
            {selectedCategory && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory("")}
                  className="text-primary border-primary hover:bg-primary hover:text-white"
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Packages by Category */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {Object.keys(groupedPackages).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-espresso mb-2">No packages found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(groupedPackages).map(([categoryName, categoryPackages]) => {
                  const IconComponent = getCategoryIcon(categoryName);
                  return (
                    <div key={categoryName}>
                      <div className="flex items-center mb-8">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mr-4 ${getCategoryColor(categoryName)} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-espresso">{categoryName} Packages</h2>
                          <p className="text-gray-600">{categoryPackages.length} package{categoryPackages.length !== 1 ? 's' : ''} available</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryPackages.map((pkg) => (
                          <Card key={pkg._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                              {pkg.images && pkg.images.length > 0 ? (
                                <div className="aspect-video relative">
                                  <Image
                                    src={pkg.images[0].url}
                                    alt={pkg.images[0].alt || pkg.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                  <MapPin className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute top-4 right-4 space-y-2">
                                <Badge className="bg-cream text-espresso block">
                                  {formatPrice(pkg.price)}
                                </Badge>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary block">
                                  {pkg.packageCategory}
                                </Badge>
                              </div>
                            </div>

                            <CardHeader>
                              <CardTitle className="text-xl">{pkg.title}</CardTitle>
                              <p className="text-gray-600">{pkg.subtitle}</p>
                            </CardHeader>

                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {pkg.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {pkg.duration}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users className="h-4 w-4 mr-2" />
                                  {pkg.capacity}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Star className="h-4 w-4 mr-2" />
                                  {pkg.rating}/5 ({pkg.bookings} bookings)
                                </div>
                              </div>

                              <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                                {pkg.about}
                              </p>

                              <div className="mt-6 flex space-x-2">
                                <Link href={`/packages/${pkg._id}`} className="flex-1">
                                  <Button className="w-full">
                                    View Details
                                  </Button>
                                </Link>
                                <Link href="/contact" className="flex-1">
                                  <Button variant="outline" className="w-full">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Book Now
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let us help you plan the perfect trip to your dream destination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/packages">
                <Button size="lg" variant="secondary" className="bg-cream text-primary hover:bg-gray-100">
                  <Plane className="h-5 w-5 mr-2" />
                  View All Packages
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-cream hover:text-primary">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinationsPage;

