import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, MapPin, HeartHandshake, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      {/* Hero Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Crafting Unforgettable Journeys in{" "}
          <span className="text-primary">Bangladesh</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Discover the soul of a land rich with culture, nature, and history. We
          are your trusted partner in exploring Bangladesh, one breathtaking
          experience at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Our Story */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="text-center">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-2" />
              <CardTitle>Our Story</CardTitle>
              <CardDescription>Passion drives our every step.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Born from a deep love for travel and the vibrant landscapes of
                Bangladesh, our journey began with a simple idea: to share the
                country's hidden gems with the world. We believe that a great
                tour is more than just a trip; it's an immersive story, a
                personal adventure that leaves a lasting impact.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Offer */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
              <CardDescription>
                Tailored experiences for every traveler.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Diverse Tours</h4>
                  <p className="text-sm text-muted-foreground">
                    From the serene tea gardens of Sylhet to the bustling city
                    life of Dhaka, our tours cover every corner of Bangladesh.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Local Expertise</h4>
                  <p className="text-sm text-muted-foreground">
                    Our local guides offer authentic insights, leading you to
                    genuine cultural encounters and off-the-beaten-path
                    destinations.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <HeartHandshake className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Seamless Booking</h4>
                  <p className="text-sm text-muted-foreground">
                    Our platform is designed to make your planning effortless,
                    from finding the perfect tour to secure online payment.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Personalized Service</h4>
                  <p className="text-sm text-muted-foreground">
                    We're dedicated to making your trip uniquely yours. Our team
                    is here to assist you every step of the way.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary/10 rounded-xl p-8 md:p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          Ready to Start Your Adventure?
        </h3>
        <p className="text-lg text-muted-foreground mb-6">
          Explore our hand-picked tours and find the perfect trip that speaks to
          your wanderlust.
        </p>
        <Button size="lg" asChild>
          <Link to="/tours">Explore Tours</Link>
        </Button>
      </div>
    </div>
  );
}
