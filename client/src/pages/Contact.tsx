import { useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, MessageCircle, Clock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import headerImage from "@assets/customer-care.jpg";

export default function Contact() {
  const { toast } = useToast();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, website: honeypotRef.current?.value }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact");
      }

      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello Land Embassy, I would like to get in touch.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/2349011072155?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with our team - we're here to help you find your perfect property"
        image={headerImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Spam trap: hidden from people, often filled in by bots */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+234 XXX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-contact-phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    placeholder="How can we help you?"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="flex-1" data-testid="button-send-message">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleWhatsApp}
                    data-testid="button-whatsapp-contact"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Us
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <MapPin className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Visit Our Office</h3>
              <p className="text-sm text-muted-foreground">
                27 Ekpeyong Street<br />
                Uyo, Akwa Ibom State<br />
                Nigeria
              </p>
            </Card>

            <Card className="p-6">
              <Phone className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <a href="tel:+2349011072155" className="text-sm text-muted-foreground hover:text-primary transition-colors block mb-1">
                +234 901 107 2155
              </a>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </Card>

            <Card className="p-6">
              <Mail className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a href="mailto:info@landembassy.com" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                info@landembassy.com
              </a>
            </Card>

            <Card className="p-6">
              <MessageCircle className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Chat with us on WhatsApp for quick responses
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open("https://wa.me/2349011072155", "_blank")}
                data-testid="button-whatsapp"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            </Card>

            <Card className="p-6">
              <Globe className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Follow Us</h3>
              <p className="text-sm text-muted-foreground">
                Stay connected on social media for updates and news
              </p>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <Card className="overflow-hidden">
            <div className="aspect-[21/9] bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.8363!2d7.9334!3d5.0447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDInNDEuMyJOIDfCsDU2JzAwLjIiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
