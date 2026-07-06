'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, Shield, CheckCircle, Star, Sparkles, Users, Clock, Car, UserCheck, TrendingUp, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/branding";
import { COFFEE_IMAGES } from "@/lib/coffeeImages";

const AboutPage = () => {
  const whatSetsUsApart = [
    {
      icon: Shield,
      title: "Transparent Sourcing",
      description: "Clear origin details, roast dates, and pricing on every bag — no surprises",
      image: COFFEE_IMAGES.beans
    },
    {
      icon: Star,
      title: "Small-Batch Roasting",
      description: "Roasted in limited batches for peak flavor and consistent quality",
      image: COFFEE_IMAGES.beansDark
    },
    {
      icon: Users,
      title: "Farm Partnerships",
      description: "Direct relationships with growers who share our commitment to quality",
      image: COFFEE_IMAGES.pour
    },
    {
      icon: Sparkles,
      title: "Custom Grind Options",
      description: "Whole bean or ground for espresso, pour-over, French press, and more",
      image: COFFEE_IMAGES.latte
    },
    {
      icon: UserCheck,
      title: "Roaster Support",
      description: "Brewing advice and product guidance from our team, order to cup",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const beliefs = [
    {
      icon: Star,
      title: "Service Quality Defines Value",
      description: "We believe that exceptional service creates lasting value for our guests"
    },
    {
      icon: Sparkles,
      title: "Small Upgrades Create Meaningful Comfort",
      description: "Every detail matters in creating a comfortable and memorable experience"
    },
    {
      icon: Shield,
      title: "Transparency Builds Long-Term Trust",
      description: "Honest communication and clear pricing foster lasting relationships"
    }
  ];

  const valueDifferences = [
    "Freshly roasted to order",
    "Ethically sourced beans",
    "Roast date on every bag",
    "Whole bean & ground options",
    "Expert brewing guidance"
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Transparency",
      description: "No hidden costs or misleading inclusions. What you see is what you get.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Car,
      title: "Comfort",
      description: "High-quality vehicles and vetted locations for your peace of mind.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: UserCheck,
      title: "Service",
      description: "Professional support throughout your journey, from start to finish.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative text-white py-28 md:py-40 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#faf8f3] to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[#bd9245] font-bold uppercase tracking-[0.3em] text-sm mb-6">Our Story</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] mb-6 leading-none tracking-tighter uppercase">
              About Us
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-4xl mx-auto font-medium leading-relaxed">
              {SITE_NAME} is a specialty coffee roaster dedicated to sourcing exceptional beans, roasting in small batches, and delivering peak freshness with every bag.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Specialty Roaster</span>
              </div>
              <span className="text-white/30">·</span>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Licensed Operator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Travel Group"
                    width={600}
                    height={700}
                    className="w-full h-[500px] md:h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="inline-block">
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-3 w-3 mr-2" />
                    Our Story
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e1f44] leading-tight">
                  About {SITE_NAME}
                </h2>
                <div className="space-y-5 text-gray-700 leading-relaxed text-lg">
                  <p>
                    {SITE_NAME} is a specialty coffee company dedicated to sourcing exceptional beans and roasting them with care. We blend origin expertise with small-batch precision.
                  </p>
                  <p>
                    Whether you brew at home or run a café, {SITE_NAME} delivers freshly roasted coffee with transparent sourcing and reliable quality in every bag.
                  </p>
                  <p className="font-semibold text-[#1e1f44]">
                    We are a passionate roasting team dedicated to quality, transparency, and the craft of great coffee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Our Core Values
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e1f44] mb-6">
                Our Philosophy: <span className="text-primary">Absolute Clarity</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg order-2 lg:order-1">
                <p>
                  In a market full of stale supermarket coffee, {SITE_NAME} stands for freshness and honesty. We believe every bag should tell you where the beans came from, when they were roasted, and how to brew them best.
                </p>
                <p>
                  We bridge the gap between price and value. We don't simply chase the lowest fare; we pursue the highest standard. Our commitment is to ensure you understand exactly what you are paying for—eliminating uncertainty through transparent pricing, expert vetting, and premium service.
                </p>
                <p className="font-semibold text-[#1e1f44]">
                  At {SITE_NAME}, we don’t just sell tickets; we deliver peace of mind.
                </p>
              </div>
              <div className="relative group order-1 lg:order-2">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Travel Experience"
                    width={600}
                    height={600}
                    className="w-full h-[400px] md:h-[500px] object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Beliefs Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {beliefs.map((belief, index) => (
                <Card key={index} className="group border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      <belief.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1e1f44] mb-4">
                      {belief.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {belief.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Value Differences */}
            <div className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 rounded-3xl p-8 md:p-12 shadow-xl border border-primary/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1e1f44] mb-2">
                    Sometimes, a modest price difference results in:
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {valueDifferences.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium text-lg">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-700 mt-10 text-xl font-semibold italic">
                  That difference is intentional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Star className="h-3 w-3 mr-2" />
                What Makes Us Different
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e1f44] mb-6">
                What Sets Us Apart
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {whatSetsUsApart.map((item, index) => (
                <Card key={index} className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl bg-white">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#1e1f44] mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-8 border border-primary/20">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                  Whether travelers are seeking luxury international tours, private experiences, or premium-managed sightseeing across the globe, we focus on delivering travel services with care and consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-md text-white border-white/30">
              <Sparkles className="h-4 w-4 mr-2" />
              Start Brewing
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Taste the Difference?
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
              Explore our single-origin beans, signature blends, and subscription options — roasted fresh and delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
                  Book Now
                </Button>
              </Link>
              <Link href="/packages">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 backdrop-blur-sm bg-white/10">
                  Shop Coffee
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

