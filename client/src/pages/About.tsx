import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Award, Target, Heart } from "lucide-react";
import welcomeImage from "@assets/welcome_1761621717729.jpg";
import customerCareImage from "@assets/Customer Care_1761621717724.jpg";
import plazaImage from "@assets/LARGEST PLAZA RESIZED_1761621717726.jpg";

export default function About() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="About Land Embassy"
        subtitle="Building dreams, creating homes, and empowering communities since 2009"
        image={welcomeImage}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground font-serif text-lg">
                <p>
                  Land Embassy Limited was founded in 2009 with a vision to revolutionize the real estate industry in Nigeria. What started as a small team of passionate real estate professionals has grown into one of the most trusted names in the industry.
                </p>
                <p>
                  Over the years, we have successfully helped thousands of families find their dream homes and assisted numerous businesses in securing prime commercial properties. Our commitment to excellence, transparency, and customer satisfaction has been the cornerstone of our success.
                </p>
                <p>
                  Today, Land Embassy stands as a testament to what dedication, integrity, and hard work can achieve. We continue to expand our reach while maintaining the personal touch that has made us a household name in Nigerian real estate.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={customerCareImage}
                alt="Customer Care"
                className="rounded-lg w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Integrity</h3>
              <p className="text-sm text-muted-foreground">
                We conduct all our business with honesty and transparency
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Excellence</h3>
              <p className="text-sm text-muted-foreground">
                We strive for excellence in every property and service we deliver
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Commitment</h3>
              <p className="text-sm text-muted-foreground">
                We are dedicated to helping you achieve your real estate goals
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Care</h3>
              <p className="text-sm text-muted-foreground">
                We treat every client like family and care about your satisfaction
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
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
              className="rounded-lg w-full h-[400px] object-cover"
            />
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-primary">2009</h3>
                <p className="text-muted-foreground">Founded Land Embassy Limited</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-primary">2012</h3>
                <p className="text-muted-foreground">Completed our first major commercial development</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-primary">2018</h3>
                <p className="text-muted-foreground">Expanded operations to Abuja and Port Harcourt</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-primary">2024</h3>
                <p className="text-muted-foreground">Celebrating over 1000 satisfied clients and 500+ properties sold</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
