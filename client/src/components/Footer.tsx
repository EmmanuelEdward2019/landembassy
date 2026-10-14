import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src={logoImage} alt="Land Embassy" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Building Wealth, One Investment at a Time. Creating real estate solutions of tomorrow.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61566008745364&mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/landembassy?igsh=MTFrdXAzN21qcGpnaw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="http://x.com/landembassy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/landembassy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-elevate p-2 rounded-md"
                data-testid="link-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/properties" className="text-muted-foreground hover:text-primary transition-colors">Properties</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">Property Development</span></li>
              <li><span className="text-muted-foreground">Real Estate Brokerage</span></li>
              <li><span className="text-muted-foreground">Architectural Services</span></li>
              <li><span className="text-muted-foreground">Interior Decoration</span></li>
              <li><span className="text-muted-foreground">Consultancy Services</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">27 Ekpeyong Street, Uyo, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+2349011072155" className="text-muted-foreground hover:text-primary transition-colors">
                  +234 901 107 2155
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:info@landembassy.com" className="text-muted-foreground hover:text-primary transition-colors">
                  info@landembassy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Land Embassy Limited. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
