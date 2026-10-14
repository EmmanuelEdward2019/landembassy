import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Award, Target, Heart, TrendingUp } from "lucide-react";
import welcomeImage from "@assets/welcome.jpg";
import customerCareImage from "@assets/customer-care.jpg";
import plazaImage from "@assets/largest-plaza-resized.jpg";

export default function About() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="About Land Embassy"
        subtitle="Building dreams, creating homes, and empowering communities since 2021"
        image={welcomeImage}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
              <div className="space-y-4 text-muted-foreground font-serif text-lg">
                <p>
                  Land Embassy Limited is a leading real estate investment, architectural, development and management company, making real estate investment easy and accessible for everyone, thereby fostering financial growth and stability for all.
                </p>
                <p>
                  We are the No. 1 leader in residential and commercial real estate services and investments. We provide tailored solutions for clients of all sizes, in every sector, and across Nigeria and beyond.
                </p>
                <p>
                  Over the years, we have successfully helped thousands of families find their dream homes and assisted numerous businesses in securing prime commercial properties. Our commitment to excellence, transparency, and customer satisfaction has been the cornerstone of our success.
                </p>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
              <img
                src={customerCareImage}
                alt="Customer Care"
                className="rounded-lg w-full h-[500px] object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8 hover-elevate transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-muted-foreground font-serif text-lg">
                To be the No. 1 real estate investment, architectural, development and management company globally.
              </p>
            </Card>

            <Card className="p-8 hover-elevate transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground font-serif text-lg">
                Our mission is to simplify and democratize real estate investment, providing innovative solutions for clients of all sizes, in every sector, and across the globe.
              </p>
            </Card>
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
                We conduct all our business with honesty and transparency, building trust with every interaction
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trust</h3>
              <p className="text-sm text-muted-foreground">
                Building lasting relationships through reliability, dependability, and consistent service delivery
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Excellence</h3>
              <p className="text-sm text-muted-foreground">
                We strive for excellence in every property and service we deliver to our valued clients
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Growth</h3>
              <p className="text-sm text-muted-foreground">
                Committed to continuous improvement, expansion, and fostering financial growth for all
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Achievements</h2>
            <p className="text-muted-foreground text-lg">
              Milestones that reflect our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <img
              src={plazaImage}
              alt="Our Largest Plaza Development"
              className="rounded-lg w-full h-[400px] object-cover shadow-xl"
            />
            <div className="space-y-6">
              <Card className="p-6 hover-elevate transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2 text-primary">2021</h3>
                <p className="text-muted-foreground">Founded Land Embassy Limited with a vision to democratize real estate investment</p>
              </Card>
              <Card className="p-6 hover-elevate transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2 text-primary">2022</h3>
                <p className="text-muted-foreground">Completed our first major commercial development project</p>
              </Card>
              <Card className="p-6 hover-elevate transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2 text-primary">2024</h3>
                <p className="text-muted-foreground">Expanded operations to multiple cities across Nigeria</p>
              </Card>
              <Card className="p-6 hover-elevate transition-all duration-300">
                <h3 className="font-semibold text-xl mb-2 text-primary">2026</h3>
                <p className="text-muted-foreground">Celebrating over 1000 satisfied clients and 500+ properties sold</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
