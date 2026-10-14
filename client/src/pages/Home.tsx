import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PropertyCard from "@/components/PropertyCard";
import BlogCard from "@/components/BlogCard";
import TestimonialCard from "@/components/TestimonialCard";
import StatCard from "@/components/StatCard";
import FeatureCard from "@/components/FeatureCard";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Home as HomeIcon,
  ArrowRight,
  Building2,
  Award,
  Target,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@shared/schema";
import heroImage from "@assets/hero.jpg";
import welcomeImage from "@assets/welcome.jpg";
import customerCareImage from "@assets/customer-care.jpg";

export default function Home() {
  const { data: properties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });
  // Featured listings first (the API sorts them to the top); fall back to the newest
  const featuredProperties = properties.slice(0, 3);

  const blogPosts = [
    {
      id: "1",
      title: "Top 10 Investment Opportunities in Lagos Real Estate",
      excerpt: "Explore the most lucrative real estate investment opportunities in Lagos and maximize your returns.",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      author: "David Johnson",
      publishedAt: "Oct 25, 2024",
    },
    {
      id: "2",
      title: "Understanding Property Documentation in Nigeria",
      excerpt: "A comprehensive guide to the legal requirements and documentation needed for property transactions.",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
      author: "Sarah Adeyemi",
      publishedAt: "Oct 20, 2024",
    },
    {
      id: "3",
      title: "The Future of Smart Homes in Nigeria",
      excerpt: "How technology is transforming modern living spaces and what it means for homebuyers.",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      author: "Michael Chen",
      publishedAt: "Oct 15, 2024",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-in fade-in zoom-in-95 duration-1000"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Welcome to Land Embassy
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            Building Wealth, One Investment at a Time
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Making real estate investment easy and accessible for everyone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button
                size="lg"
                variant="default"
                className="text-lg px-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700"
                data-testid="button-browse-properties"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/quote">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-background/20 backdrop-blur border-white/30 text-white hover:bg-background/30 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000"
                data-testid="button-get-quote-hero"
              >
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={welcomeImage}
                alt="Welcome to Land Embassy"
                className="rounded-lg w-full h-[500px] object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-xl">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-sm">Years Experience</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">About Land Embassy Limited</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Land Embassy Limited is a leading real estate investment, architectural, development and management company, making real estate investment easy and accessible for everyone, thereby fostering financial growth and stability for all.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We are the No. 1 leader in residential and commercial real estate services and investments. We provide tailored solutions for clients of all sizes, in every sector, and across Nigeria and beyond.
              </p>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="500+" label="Properties Sold" />
            <StatCard value="1000+" label="Happy Clients" />
            <StatCard value="15+" label="Years Experience" />
            <StatCard value="25+" label="Locations" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Land Embassy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Integrity</h3>
              <p className="text-sm text-muted-foreground">
                We conduct all our business with honesty and transparency
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trust</h3>
              <p className="text-sm text-muted-foreground">
                Building lasting relationships through reliability and dependability
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Excellence</h3>
              <p className="text-sm text-muted-foreground">
                We strive for excellence in every property and service we deliver
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Growth</h3>
              <p className="text-sm text-muted-foreground">
                Committed to continuous improvement and expansion
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Land Embassy</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide exceptional real estate services backed by years of experience and expertise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={ShieldCheck}
              title="Verified Properties"
              description="All properties are thoroughly verified and legally documented"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Best Investment"
              description="Prime locations with high ROI and growth potential"
            />
            <FeatureCard
              icon={Users}
              title="Expert Team"
              description="Professional agents committed to your satisfaction"
            />
            <FeatureCard
              icon={HomeIcon}
              title="Wide Selection"
              description="Diverse portfolio of residential and commercial properties"
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
              <p className="text-muted-foreground text-lg">
                Explore our handpicked selection of premium properties
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" data-testid="button-view-all-properties">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground text-lg">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              name="Adebayo Okonkwo"
              property="3 Bedroom Apartment, Ikoyi"
              text="Land Embassy made my dream of owning a home come true. Their professionalism and attention to detail exceeded my expectations."
            />
            <TestimonialCard
              name="Chioma Nwosu"
              property="Commercial Property, Lekki"
              text="Excellent service from start to finish. The team guided me through every step and found the perfect investment property for my business."
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Latest News & Insights</h2>
              <p className="text-muted-foreground text-lg">
                Stay informed with the latest real estate trends and tips
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" data-testid="button-view-all-blog">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Let us help you navigate the real estate market and find the perfect property that meets your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button size="lg" variant="secondary" className="px-8">
                Browse Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Us Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
