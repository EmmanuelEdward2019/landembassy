import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import headerImage from "@assets/page-header.jpg";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Remove mock data
  const blogPosts = [
    {
      id: "1",
      title: "Top 10 Investment Opportunities in Lagos Real Estate",
      excerpt: "Explore the most lucrative real estate investment opportunities in Lagos and maximize your returns in 2024.",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      author: "David Johnson",
      publishedAt: "Oct 25, 2024",
    },
    {
      id: "2",
      title: "Understanding Property Documentation in Nigeria",
      excerpt: "A comprehensive guide to the legal requirements and documentation needed for property transactions in Nigeria.",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
      author: "Sarah Adeyemi",
      publishedAt: "Oct 20, 2024",
    },
    {
      id: "3",
      title: "The Future of Smart Homes in Nigeria",
      excerpt: "How technology is transforming modern living spaces and what it means for homebuyers and investors.",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      author: "Michael Chen",
      publishedAt: "Oct 15, 2024",
    },
    {
      id: "4",
      title: "Real Estate Market Trends in Abuja",
      excerpt: "An in-depth analysis of the current real estate market trends in Nigeria's capital city.",
      category: "Market Insights",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      author: "Amina Ibrahim",
      publishedAt: "Oct 10, 2024",
    },
    {
      id: "5",
      title: "First-Time Homebuyer's Guide",
      excerpt: "Everything you need to know before purchasing your first property in Nigeria.",
      category: "Guide",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      author: "David Johnson",
      publishedAt: "Oct 5, 2024",
    },
    {
      id: "6",
      title: "Commercial Property Investment Strategies",
      excerpt: "Proven strategies for successful commercial real estate investment in major Nigerian cities.",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      author: "Sarah Adeyemi",
      publishedAt: "Sep 30, 2024",
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Latest News & Insights"
        subtitle="Stay informed with the latest real estate trends, tips, and market analysis"
        image={headerImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-blog"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
