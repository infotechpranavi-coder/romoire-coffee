import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Map, Users, Award } from "lucide-react";
import { SITE_NAME } from "@/lib/branding";

const About = () => {
  const features = [
    {
      icon: Plane,
      title: "Expert Travel Planning",
      description: "Our experienced team crafts personalized itineraries for unforgettable journeys"
    },
    {
      icon: Map,
      title: "South African Destinations",
      description: "Explore the best of South Africa and its regions with our curated tours"
    },
    {
      icon: Users,
      title: "Family-Friendly Tours",
      description: "Special packages designed for families and groups of all sizes"
    },
    {
      icon: Award,
      title: "Trusted Service",
      description: "Years of experience in creating memorable travel experiences"
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-blue-600">About {SITE_NAME}</h2>
              <p className="text-lg text-blue-500 leading-relaxed font-medium">
                "Travel with Heart, Explore with Us"
              </p>
              <p className="text-lg text-blue-600 leading-relaxed">
                {SITE_NAME} turns your holidays into memorable journeys across South Africa. Every trip is personal, seamless, and unforgettable.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're seeking luxury experiences at Table Mountain, adventure in the Kruger safari, cultural immersion at traditional markets, or relaxation at world-class beaches, our expert team is here to guide you every step of the way through South Africa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View Packages
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right content - Features grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">ARE YOU READY TO TRAVEL? REMEMBER US !!</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              View Packages
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-cream hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;