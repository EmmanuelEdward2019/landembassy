import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Mail, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import headerImage from "@assets/crop for header_1761621717723.jpg";

export default function Quote() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "",
    budgetRange: "",
    message: "",
  });

  const handleSubmit = async (method: "email" | "whatsapp") => {
    if (!formData.name || !formData.email || !formData.phone || !formData.propertyInterest || !formData.budgetRange || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          preferredContact: method,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      if (method === "whatsapp") {
        const message = `Hello Land Embassy, I'm interested in getting a quote.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nProperty Interest: ${formData.propertyInterest}\nBudget Range: ${formData.budgetRange}\nMessage: ${formData.message}`;
        const whatsappUrl = `https://wa.me/2349011072155?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      }

      toast({
        title: "Quote Request Sent!",
        description: `Your quote request has been sent via ${method}. We'll get back to you shortly.`,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        propertyInterest: "",
        budgetRange: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Get a Quote"
        subtitle="Tell us about your property needs and we'll provide a customized quote"
        image={headerImage}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Request a Quote</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Interest *</label>
                    <Select
                      value={formData.propertyInterest}
                      onValueChange={(value) =>
                        setFormData({ ...formData, propertyInterest: value })
                      }
                    >
                      <SelectTrigger data-testid="select-property-interest">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="luxury">Luxury Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range *</label>
                  <Select
                    value={formData.budgetRange}
                    onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
                  >
                    <SelectTrigger data-testid="select-budget-range">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-30m">Under ₦30 Million</SelectItem>
                      <SelectItem value="30-60m">₦30M - ₦60M</SelectItem>
                      <SelectItem value="60-100m">₦60M - ₦100M</SelectItem>
                      <SelectItem value="100-200m">₦100M - ₦200M</SelectItem>
                      <SelectItem value="200m+">Above ₦200M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Information
                  </label>
                  <Textarea
                    placeholder="Tell us more about your requirements..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    data-testid="textarea-message"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => handleSubmit("email")}
                    data-testid="button-submit-email"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send via Email
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSubmit("whatsapp")}
                    data-testid="button-submit-whatsapp"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send via WhatsApp
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <Clock className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Quick Response</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond to all quote requests within 24 hours
              </p>
            </Card>
            <Card className="p-6">
              <ShieldCheck className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Your Privacy Matters</h3>
              <p className="text-sm text-muted-foreground">
                Your information is safe with us and will never be shared with third parties
              </p>
            </Card>
            <Card className="p-6">
              <Mail className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Direct Contact</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Prefer to reach out directly?
              </p>
              <p className="text-sm font-medium">info@landembassy.com</p>
              <p className="text-sm font-medium">+234 XXX XXX XXXX</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
