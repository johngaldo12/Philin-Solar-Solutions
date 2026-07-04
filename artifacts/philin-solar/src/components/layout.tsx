import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageBackground } from "@/components/page-background";
import logoImg from "@assets/received_1026107686615140_1782283900710.jpeg";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/packages", label: "Packages" },
    { href: "/gallery", label: "Gallery" },
    { href: "/accreditations", label: "Accreditations" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <PageBackground>
      <div className="min-h-screen flex flex-col font-sans text-foreground">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <img src={logoImg} alt="Philin Solar Logo" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="ml-4 rounded-full px-6">
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-border animate-in slide-in-from-top-2">
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-4 text-base font-medium border-b border-border/50 hover:bg-muted/50 ${
                    location === link.href ? "text-primary bg-primary/5" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="p-6">
                <Button asChild className="w-full rounded-full">
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">
        {children}
      </main>

      <footer className="bg-foreground text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="flex items-center mb-6">
                <img src={logoImg} alt="Philin Solar Logo" className="h-14 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Grounded in the Philippines, powered by the future. Providing reliable, high-quality solar panel installations for homes and businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">Home</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">About</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Services</Link></li>
                <li><Link href="/packages" className="text-gray-400 hover:text-primary transition-colors text-sm">Packages &amp; Pricing</Link></li>
                <li><Link href="/gallery" className="text-gray-400 hover:text-primary transition-colors text-sm">Gallery</Link></li>
                <li><Link href="/accreditations" className="text-gray-400 hover:text-primary transition-colors text-sm">Accreditations</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-4">
                <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Residential Solar</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Commercial Solar</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">System Design</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">Maintenance</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>SM Consolacion Diversion Road, Danglag, Consolacion, Cebu, Philippines 6001</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>+63 966 665 1623</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>gamz.philincebu2025@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Philin Industrial Corp. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>TIN: 010-456-761-000</span>
              <span>SEC: CS202000969</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </PageBackground>
  );
}
