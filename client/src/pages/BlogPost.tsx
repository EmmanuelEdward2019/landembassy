import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BlogCard from "@/components/BlogCard";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const { toast } = useToast();

  // TODO: Remove mock data - fetch from API using params.id
  const blogPosts = {
    "1": {
      id: "1",
      title: "Top 10 Investment Opportunities in Lagos Real Estate",
      excerpt: "Explore the most lucrative real estate investment opportunities in Lagos and maximize your returns.",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
      author: "David Johnson",
      publishedAt: "Oct 25, 2024",
      readTime: "8 min read",
      content: `
        <p>Lagos, Nigeria's commercial capital, continues to be a hotbed for real estate investment opportunities. With a growing population and expanding economy, the city offers numerous avenues for investors looking to maximize their returns.</p>

        <h2>1. Lekki Peninsula</h2>
        <p>The Lekki Peninsula has emerged as one of the most sought-after areas in Lagos. With ongoing infrastructure development, including the Lekki-Epe Expressway expansion and the new Lekki Deep Sea Port, property values are expected to appreciate significantly over the next decade.</p>

        <h2>2. Ikoyi Premium Residences</h2>
        <p>Ikoyi remains the prime location for luxury real estate in Lagos. High-end apartments and commercial properties in this area command premium prices and offer excellent rental yields, making them ideal for investors seeking stable returns.</p>

        <h2>3. Victoria Island Commercial Properties</h2>
        <p>Victoria Island's central business district continues to attract multinational corporations and financial institutions. Office spaces and mixed-use developments in this area present lucrative investment opportunities.</p>

        <h2>4. Ajah and Sangotedo</h2>
        <p>These emerging areas along the Lekki-Epe corridor offer affordable entry points for investors. With improving infrastructure and growing demand, properties in these locations are poised for substantial appreciation.</p>

        <h2>5. Yaba Tech Hub</h2>
        <p>As Nigeria's Silicon Valley, Yaba has become a magnet for tech startups and young professionals. Residential and co-working spaces in this area offer strong rental demand and good returns.</p>

        <h2>6. Banana Island Luxury Market</h2>
        <p>For high-net-worth investors, Banana Island offers exclusive luxury properties with consistent value appreciation and strong rental yields from expatriate tenants.</p>

        <h2>7. Ikeja GRA</h2>
        <p>The Government Reserved Area in Ikeja provides a stable investment environment with good infrastructure and proximity to the airport, making it attractive for both residential and commercial developments.</p>

        <h2>8. Lekki Phase 1 Gated Estates</h2>
        <p>Gated communities in Lekki Phase 1 offer secure, modern living environments that appeal to middle and upper-class families, ensuring steady rental income and capital appreciation.</p>

        <h2>9. Festac Town Redevelopment</h2>
        <p>With ongoing redevelopment efforts, Festac Town presents opportunities for renovation and modernization projects that can yield significant returns.</p>

        <h2>10. Student Housing Near Universities</h2>
        <p>Purpose-built student accommodations near major universities like UNILAG offer consistent rental income and lower vacancy rates.</p>

        <h2>Conclusion</h2>
        <p>Investing in Lagos real estate requires careful research and understanding of market dynamics. Whether you're looking for luxury properties or affordable housing developments, Lagos offers diverse opportunities for investors at all levels. Always conduct thorough due diligence and consider working with experienced real estate professionals to maximize your investment potential.</p>
      `,
    },
    "2": {
      id: "2",
      title: "Understanding Property Documentation in Nigeria",
      excerpt: "A comprehensive guide to the legal requirements and documentation needed for property transactions.",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200",
      author: "Sarah Adeyemi",
      publishedAt: "Oct 20, 2024",
      readTime: "10 min read",
      content: `
        <p>Navigating property documentation in Nigeria can be complex, but understanding the essential documents is crucial for protecting your investment and ensuring legal compliance.</p>

        <h2>Essential Property Documents</h2>
        
        <h3>1. Certificate of Occupancy (C of O)</h3>
        <p>The C of O is the most important document in Nigerian property transactions. It serves as evidence of the right to occupy and use land for a specified period, typically 99 years. This document is issued by the state government and is essential for any legitimate property transaction.</p>

        <h3>2. Deed of Assignment</h3>
        <p>This document transfers ownership rights from the seller to the buyer. It must be properly executed, signed by both parties, and registered at the land registry to be legally binding.</p>

        <h3>3. Survey Plan</h3>
        <p>A survey plan is a detailed drawing that shows the boundaries and dimensions of the property. It must be prepared by a licensed surveyor and approved by the state surveyor-general's office.</p>

        <h3>4. Governor's Consent</h3>
        <p>Following the Land Use Act of 1978, any transfer of property interest requires the consent of the state governor. This consent legitimizes the transaction and should be obtained within six months of the sale.</p>

        <h3>5. Tax Clearance Certificate</h3>
        <p>This document proves that all property taxes have been paid up to date. It's essential for completing property transactions and obtaining Governor's Consent.</p>

        <h2>The Verification Process</h2>
        
        <h3>Physical Verification</h3>
        <p>Always visit the property and verify its physical existence. Check that the property boundaries match those indicated in the survey plan.</p>

        <h3>Document Verification</h3>
        <p>Conduct a thorough search at the land registry to verify the authenticity of all documents and check for any encumbrances or pending litigation.</p>

        <h3>Title Investigation</h3>
        <p>Engage a property lawyer to conduct a comprehensive title investigation. This includes tracing the chain of ownership and ensuring there are no defects in the title.</p>

        <h2>Common Pitfalls to Avoid</h2>
        
        <ul>
          <li>Purchasing property without conducting proper due diligence</li>
          <li>Accepting photocopied documents without verifying originals</li>
          <li>Ignoring pending litigation or disputes on the property</li>
          <li>Failing to obtain Governor's Consent after purchase</li>
          <li>Not engaging professional legal services</li>
        </ul>

        <h2>Best Practices</h2>
        
        <p>Always work with reputable real estate companies and legal practitioners. Ensure all documents are properly registered and obtain Governor's Consent promptly after purchase. Keep all original documents in a secure location and maintain copies for regular use.</p>

        <h2>Conclusion</h2>
        <p>Understanding property documentation is essential for secure real estate transactions in Nigeria. While the process may seem daunting, working with experienced professionals and following proper procedures will protect your investment and ensure legal compliance.</p>
      `,
    },
    "3": {
      id: "3",
      title: "The Future of Smart Homes in Nigeria",
      excerpt: "How technology is transforming modern living spaces and what it means for homebuyers.",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
      author: "Michael Chen",
      publishedAt: "Oct 15, 2024",
      readTime: "6 min read",
      content: `
        <p>Smart home technology is revolutionizing the real estate landscape in Nigeria, offering homeowners unprecedented control, convenience, and efficiency in managing their living spaces.</p>

        <h2>What Are Smart Homes?</h2>
        <p>Smart homes integrate various automated and internet-connected devices to create an intelligent living environment. These systems can control lighting, climate, entertainment, security, and more through centralized platforms accessible via smartphones or voice commands.</p>

        <h2>Key Smart Home Technologies</h2>
        
        <h3>1. Automated Lighting Systems</h3>
        <p>Smart lighting allows homeowners to control lights remotely, set schedules, and adjust brightness levels. These systems can significantly reduce energy consumption while enhancing home security and ambiance.</p>

        <h3>2. Smart Security Systems</h3>
        <p>Modern security systems feature HD cameras, motion sensors, smart locks, and real-time alerts. Homeowners can monitor their properties remotely and grant access to visitors from anywhere in the world.</p>

        <h3>3. Climate Control</h3>
        <p>Smart thermostats and air conditioning systems learn homeowner preferences and adjust temperatures automatically, optimizing comfort while reducing energy costs.</p>

        <h3>4. Energy Management</h3>
        <p>Solar panels integrated with smart energy management systems allow homeowners to monitor consumption, store excess energy, and reduce dependence on the national grid.</p>

        <h2>Benefits for Nigerian Homeowners</h2>
        
        <h3>Energy Efficiency</h3>
        <p>With Nigeria's power supply challenges, smart homes offer solutions for optimizing energy use and reducing electricity bills through intelligent automation and solar integration.</p>

        <h3>Enhanced Security</h3>
        <p>Smart security systems provide peace of mind through 24/7 monitoring, instant alerts, and remote access control, addressing one of the primary concerns for Nigerian homeowners.</p>

        <h3>Increased Property Value</h3>
        <p>Homes equipped with smart technology command premium prices and attract tech-savvy buyers, making them excellent long-term investments.</p>

        <h2>Challenges and Solutions</h2>
        
        <h3>Internet Connectivity</h3>
        <p>While internet infrastructure is improving, some areas still face connectivity challenges. However, many smart home systems now offer offline functionality with cloud synchronization when connectivity is restored.</p>

        <h3>Initial Cost</h3>
        <p>The upfront investment for smart home technology can be significant. However, the long-term savings on energy and increased property value often justify the initial expense.</p>

        <h3>Technical Support</h3>
        <p>As the market grows, more local technicians are being trained in smart home installation and maintenance, making support more accessible.</p>

        <h2>The Future Outlook</h2>
        <p>The smart home market in Nigeria is expected to grow significantly over the next decade. As technology becomes more affordable and internet infrastructure improves, we'll see wider adoption across all property segments, from luxury estates to middle-income housing developments.</p>

        <h2>Conclusion</h2>
        <p>Smart home technology represents the future of residential real estate in Nigeria. For homebuyers, investing in smart-enabled properties or retrofitting existing homes with smart technology is becoming increasingly attractive. As the technology matures and becomes more affordable, smart homes will likely become the standard rather than the exception in Nigeria's real estate market.</p>
      `,
    },
  };

  const post = blogPosts[params?.id as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = Object.values(blogPosts)
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Blog post link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article>
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.publishedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleShare} data-testid="button-share-post">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <div className="aspect-[21/9] mb-12 rounded-lg overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-muted-foreground">Real Estate Expert</p>
              </div>
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} {...relatedPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
