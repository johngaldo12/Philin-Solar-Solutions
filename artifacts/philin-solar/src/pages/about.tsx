import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Building2, ShieldCheck, Zap, Droplets } from "lucide-react";
import ownerPortraitImg from "@assets/received_2509195862884631_1782283912935.jpeg";
import ownerCardImg from "@assets/received_2130557644183010_1782283912972.jpeg";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const specializations = [
  { icon: Zap, label: "Renewable Energy / Hybrid Solar" },
  { icon: Droplets, label: "Solar Water System — Purified Water, Power & Starlink" },
  { icon: Building2, label: "Versa Pumps / Energy Conservation" },
  { icon: ShieldCheck, label: "Smart Waste to Energy Thermolysis" },
];

export default function AboutPage() {
  return (
    <div className="w-full overflow-hidden">
      {/* Page Header */}
      <section className="bg-foreground text-white py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-block mb-4 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30"
            >
              About Us
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Who We Are
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 leading-relaxed"
            >
              Philin Industrial Corporation is a government-accredited construction and solar energy company dedicated to powering homes and businesses across the Philippines with clean, reliable, and affordable energy solutions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Building a Brighter, <span className="text-primary">Greener Philippines</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded and registered with the SEC in 2020, Philin Industrial Corp. has grown into a trusted name in solar energy installation, general construction, and renewable energy systems throughout the country.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We are a PhilGEPS Platinum-registered supplier and hold a PCAB License (General Building, Category B), making us qualified to deliver solar and construction projects for both private clients and government agencies.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our philosophy is simple: <strong className="text-foreground">Solution with Innovation. Stability. Sustainability.</strong> Every project we undertake is designed to deliver lasting value — for our clients, their communities, and the planet.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">SEC Registered</span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">PCAB Licensed</span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">PhilGEPS Platinum</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <h3 className="text-xl font-bold text-foreground mb-5">Products & Specialization</h3>
              {specializations.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2">General Construction</p>
                <p className="text-sm text-foreground font-medium">Civil Works &bull; Electrical Works &bull; CCTV HD</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Owner / Contact Person */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-block mb-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20"
            >
              Leadership
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-foreground tracking-tight"
            >
              Meet the Man Behind the Mission
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          >
            {/* Portrait */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl -z-10"></div>
                <img
                  src={ownerPortraitImg}
                  alt="Gamaliel C. Ermac — COO, Philin Solar"
                  data-testid="img-owner-portrait"
                  className="w-full max-w-sm rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div variants={fadeInUp} className="flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                Gamaliel "Gamz" C. Ermac
              </h3>
              <p className="text-primary font-semibold text-lg mb-1">COO / Project Consultant</p>
              <p className="text-muted-foreground text-sm mb-2">Philin Industrial Corp. — Philin Cebu</p>
              <p className="text-muted-foreground text-sm mb-6 italic">
                Regional Director R7, Climate Change Task Force — Climate Change Commission, Philippines
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href="tel:+639666651623"
                    data-testid="link-owner-phone"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    +63 966 665 1623
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href="mailto:gamz.philincebu2025@gmail.com"
                    data-testid="link-owner-email"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    gamz.philincebu2025@gmail.com
                  </a>
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Main Address</p>
                    <p className="text-sm text-foreground">Lot 3, Block 1, Ruby Street, Sta. Lucia Village 5, Punturin, Valenzuela, Metro Manila 1447, Philippines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-primary/30 bg-primary/5">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Satellite Office — Cebu</p>
                    <p className="text-sm text-foreground font-medium">SM Consolacion Diversion Road, Danglag, Consolacion, Cebu, Philippines 6001</p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-fit rounded-full px-8">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Business Card Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="mt-16 flex justify-center"
          >
            <div className="w-full max-w-2xl">
              <p className="text-center text-sm text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Official Business Card</p>
              <img
                src={ownerCardImg}
                alt="Gamaliel C. Ermac — Official Business Card"
                data-testid="img-owner-card"
                className="w-full rounded-2xl shadow-xl border border-border object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Go Solar?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Connect with our team today and take the first step toward energy independence.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-10 font-semibold text-primary">
                <Link href="/contact">Get a Free Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-10 text-white border-white hover:bg-white hover:text-primary">
                <Link href="/services">View Our Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
