import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/logo resized_1761621717727.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/properties", label: "Properties" },
    { path: "/services", label: "Services" },
    { path: "/gallery", label: "Gallery" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" data-testid="link-home">
            <img src={logoImage} alt="Land Embassy" className="h-12 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                data-testid={`link-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.path ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/quote">
              <Button variant="default" data-testid="button-get-quote">
                Get a Quote
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span
                  className={`block px-4 py-3 rounded-md text-sm font-medium ${
                    location === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover-elevate"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="default" className="w-full mt-2">
                Get a Quote
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
