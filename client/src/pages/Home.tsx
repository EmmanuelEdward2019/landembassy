import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PropertyCard from "@/components/PropertyCard";
import BlogCard from "@/components/BlogCard";
import TestimonialCard from "@/components/TestimonialCard";
import StatCard from "@/components/StatCard";
import FeatureCard from "@/components/FeatureCard";
import { ShieldCheck, TrendingUp, Users, Home as HomeIcon, ArrowRight } from "lucide-react";
import heroImage from "@assets/hero image_1761621717725.jpg";

export default function Home() {
  // TODO: Remove mock data
  const featuredProperties = [
    {
      id: "1",
      title: "Luxury 5 Bedroom Duplex",
      price: "85,000,000",
      location: "Banana Island, Lagos",
      bedrooms: 5,
      bathrooms: 6,
      area: 450,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      type: "Luxury",
    },
    {
      id: "2",
      title: "Modern 3 Bedroom Apartment",
      price: "32,000,000",
      location: "Victoria Island, Lagos",
      bedrooms: 3,
      bathrooms: 4,
      area: 220,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      type: "Residential",
    },
    {
      id: "3",
      title: "Commercial Plaza",
      price: "250,000,000",
      location: "Abuja",
      bedrooms: 0,
      bathrooms: 8,
      area: 1200,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      type: "Commercial",
    },
  ];

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
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Welcome to Land Embassy
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Your gateway to premium real estate across Nigeria. Find your dream property today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button
                size="lg"
                variant="default"
                className="text-lg px-8"
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
                className="text-lg px-8 bg-background/20 backdrop-blur border-white/30 text-white hover:bg-background/30"
                data-testid="button-get-quote-hero"
              >
                Get a Quote
              </Button>
            </Link>
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

      <section className="py-20 bg-muted/30">
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
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
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

      <section className="py-20 bg-muted/30">
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
    </div>
  );
}
