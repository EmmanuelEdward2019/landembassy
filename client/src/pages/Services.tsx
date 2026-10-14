import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Pencil, Palette, ClipboardList, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import headerImage from "@assets/page-header.jpg";

export default function Services() {
  const services = [
    {
      icon: Building2,
      title: "Property Development and Management",
      description:
        "At Land Embassy Limited, we specialize in comprehensive property development and management services. From concept to completion, we oversee every phase of development, ensuring high-quality construction, timely delivery, and optimal functionality. Our expert management team handles the day-to-day operations, maintenance, and tenant relations, maximizing the value and performance of your investment.",
    },
    {
      icon: Users,
      title: "Real Estate Brokerage",
      description:
        "Our experienced real estate brokerage team at Land Embassy Limited is dedicated to connecting buyers and sellers in the property market. We offer personalized service, extensive market knowledge, and strategic marketing to help you find the perfect property or the right buyer. Trust us to handle all negotiations and transactions with the utmost professionalism and integrity.",
    },
    {
      icon: Pencil,
      title: "Architectural Services",
      description:
        "Our architectural team at Land Embassy Limited is committed to creating innovative, sustainable, and aesthetically pleasing designs. We work closely with clients to understand their vision and requirements, delivering bespoke architectural solutions that meet their needs. From residential homes to commercial spaces, our designs are tailored to enhance functionality and elevate the living experience.",
    },
    {
      icon: Palette,
      title: "Interior Decoration & Finishing",
      description:
        "Enhance the beauty and functionality of your spaces with Land Embassy Limited's interior decoration and finishing services. Our skilled designers bring your vision to life with customized decor, high-quality materials, and meticulous attention to detail. Whether you're looking to refresh a single room or complete a full-scale renovation, our interior decoration services will transform your space into a stylish and inviting environment.",
    },
    {
      icon: ClipboardList,
      title: "Consultancy Services",
      description:
        "Land Embassy Limited provides expert consultancy services to guide you through every aspect of real estate investment. Our seasoned consultants offer valuable insights, market analysis, and strategic advice to help you make informed decisions. Whether you're a first-time investor or a seasoned professional, our consultancy services are designed to support your goals and ensure successful outcomes.",
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Our Services"
        subtitle="Creating real estate solutions of tomorrow"
        image={headerImage}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Real Estate Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We provide tailored solutions for clients of all sizes, in every sector, and across Nigeria and beyond.
            </p>
          </div>

          <div className="space-y-12">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-8 hover-elevate transition-all duration-300"
                data-testid={`service-card-${index}`}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Link href="/quote">
                      <Button variant="outline">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let us help you achieve your real estate goals. Contact us today for a consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="px-8">
                Get a Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
