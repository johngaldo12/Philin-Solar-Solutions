import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Imported Shield icon for the Admin button
import { MapPin, Phone, Mail, Clock, Facebook, CreditCard, MessageCircle, Shield } from "lucide-react"; 
import aerialSolarImg from "@/assets/images/aerial-solar.png";
// Adjust this import depending on your framework (e.g., 'react-router-dom' if not using Next.js)
import Link from "next/link"; 

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-foreground text-white py-20 relative">
        <div className="absolute inset-0 z-0">
          <img src={aerialSolarImg} alt="Aerial view of solar array" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-foreground/80"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Get in touch with our team for consultations, site assessments, or any inquiries about our solar solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border"
            >
              <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Juan" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Dela Cruz" className="h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="juan@example.com" className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+63 917 123 4567" className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Interested In</Label>
                  <select id="service" className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select a service...</option>
                    <option value="residential">Residential Solar</option>
                    <option value="commercial">Commercial Solar</option>
                    <option value="maintenance">Maintenance & Repair</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] resize-none" />
                </div>

                {/* Updated Button Group */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button type="submit" size="lg" className="flex-1 h-14 text-lg rounded-xl">
                    Send Message
                  </Button>
                  
                  <Link href="/admin" passHref className="flex-1 sm:flex-initial">
                    <Button type="button" variant="outline" size="lg" className="w-full h-14 text-lg rounded-xl border-dashed border-2 hover:bg-muted gap-2">
                      <Shield className="w-5 h-5" />
                      Admin Portal
                    </Button>
                  </Link>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Satellite Office</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Philin Industrial Corp.<br />
                        SM Consolacion Diversion Road,<br />
                        Danglag, Consolacion, Cebu,<br />
                        Philippines 6001
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Phone</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        <a href="tel:+639666651623" className="hover:text-primary transition-colors">+63 966 665 1623</a><br />
                        <a href="tel:+6390662409733" className="hover:text-primary transition-colors">+63 906 240 9733</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Email</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        <a href="mailto:gamz.philincebu2025@gmail.com" className="hover:text-primary transition-colors">gamz.philincebu2025@gmail.com</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Facebook className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Facebook</h4>
                      <p className="text-muted-foreground leading-relaxed">Gamaliel C. Ermac</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">WhatsApp / Viber</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        <a href="tel:+639666651623" className="hover:text-primary transition-colors">09666651623</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Business Hours</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Monday - Friday: 8:00 AM - 5:00 PM<br />
                        Saturday: 8:00 AM - 12:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-white p-8 rounded-3xl">
                <h4 className="font-semibold text-lg mb-4">Contact Person</h4>
                <p className="text-white/90 leading-relaxed mb-2">
                  <strong className="text-white">Gamaliel C. Ermac</strong>
                </p>
                <p className="text-white/80 text-sm mb-4">COO / Project Consultant</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">Phone: +63 966 665 1623</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">WhatsApp / Viber: 09666651623</span>
                </div>
              </div>

              <div className="bg-muted p-8 rounded-3xl">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Methods Accepted
                </h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-foreground border border-border">Bank Transfer</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-foreground border border-border">GCash</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-foreground border border-border">Maya</span>
                </div>
              </div>

              <div className="bg-muted p-8 rounded-3xl">
                <h4 className="font-semibold text-lg mb-4">Corporate Info</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">SEC Reg No.</span>
                    <span className="font-mono font-medium">CS202000969</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">TIN</span>
                    <span className="font-mono font-medium">010-456-761-000</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">PCAB License</span>
                    <span className="font-mono font-medium">50866</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
