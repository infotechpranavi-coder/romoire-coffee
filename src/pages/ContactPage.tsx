import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import contactHeroImage from "@/assets/modify.webp";
import BestPlaceSection from "@/components/BestPlaceSection";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+237 6 83 57 76 76"],
      description: "Call us anytime for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["sales@skygovoyages.com"],
      description: "Send us your queries and we'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: ["Head Office — Navi Mumbai, Maharashtra 400706"],
      description: "Visit our office for personalized travel planning"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: 10:00 AM - 5:00 PM"],
      description: "We're here to help during business hours"
    }
  ];

  return (
    <div className="min-h-screen bg-travel-light-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('${contactHeroImage}')`
          }}
        ></div>
        {/* Removed overlay */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center space-y-6 fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Contact <span className="text-secondary">Sky Go</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We're here to help you plan your next adventure. Get in touch with us!
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8 slide-up">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-4">Get In Touch</h2>
                <p className="text-lg text-muted-foreground">
                  Ready to embark on your next adventure? We're here to help you plan the perfect trip.
                  Contact us today and let's make your travel dreams come true.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover-lift bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-secondary/10 p-3 rounded-lg">
                          <info.icon className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground font-medium">{detail}</p>
                          ))}
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white hover-lift flex items-center gap-2"
                  onClick={() => window.open('https://wa.me/237683577676', '_blank')}
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="hover-lift flex items-center gap-2 border-secondary text-secondary hover:bg-secondary/10">
                  <Phone className="h-5 w-5" />
                  Call Now
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="scale-in">
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center text-secondary">
                    Book Your Trip
                  </CardTitle>
                  <p className="text-center text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name*</Label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name*</Label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address*</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number*</Label>
                        <Input id="phone" placeholder="Enter your phone number" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="destination">Preferred Destination</Label>
                        <Input id="destination" placeholder="Where would you like to go?" />
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Input id="budget" placeholder="Your budget (optional)" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="travelDate">Preferred Travel Date</Label>
                        <Input id="travelDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <Input id="travelers" type="number" placeholder="How many people?" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Requirements</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your travel preferences, special requirements, or any questions you have..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <Button className="w-full bg-secondary hover:bg-secondary/90 hover-lift text-lg py-3">
                      Send Inquiry
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-bold text-secondary mb-4">Visit Our Office</h2>
            <p className="text-lg text-muted-foreground">
              Come meet us in person for personalized travel planning
            </p>
          </div>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Interactive Map Coming Soon</p>
          </div>
        </div>
      </section>

      {/* Best Place Section */}
      <BestPlaceSection
        subtitle="Let's Connect"
        title="Plan your dream trip with"
        destination="Our Experts"
        buttonText="GET QUOTE"
        buttonLink="/contact"
      />
    </div>
  );
};

export default ContactPage;