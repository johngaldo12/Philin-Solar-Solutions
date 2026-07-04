import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, Mail, Zap, Battery, Shield, Leaf } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const packages = [
  {
    id: "offgrid-6kw",
    badge: "Basic Set-Up",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    tag: "Limited Warranty",
    tagColor: "bg-amber-500",
    type: "Hybrid Pure Off-Grid",
    brand: "LIVOLTEK",
    brandColor: "text-blue-600",
    capacity: "6.2",
    unit: "KWp",
    price: "255,000",
    highlight: false,
    includes: [
      "8 pcs. Bi Facial Solar Panels 600–650 Watts",
      "1 Set 51.2V 100Ah LiFePO4 Battery",
      "Labor / Materials / Power-Up / Commissioning",
      "Professional and Reliable Service",
    ],
    features: ["Warranty Included", "Renewable Energy", "Eco Friendly", "Fast Charging"],
  },
  {
    id: "hybrid-5kw",
    badge: "Popular Choice",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    tag: "On-Grid / Off-Grid",
    tagColor: "bg-primary",
    type: "Hybrid Solar",
    brand: "LIVOLTEK",
    brandColor: "text-blue-600",
    capacity: "5",
    unit: "KW",
    price: "399,000",
    highlight: false,
    includes: [
      "8 pcs. Bi Facial Solar Panels 600–650 Watts",
      "1 Set 51.2V 100AH LiFePO4 Battery",
      "Labor / Materials / Power-Up / Commissioning",
      "Professional and Reliable Service",
    ],
    features: ["Warranty Included", "Renewable Energy", "Eco Friendly", "Fast Charging"],
  },
  {
    id: "hybrid-8kw",
    badge: "Best Value",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    tag: "With Battery Banking",
    tagColor: "bg-green-600",
    type: "Hybrid Solar",
    brand: "GOODWE",
    brandColor: "text-orange-600",
    capacity: "8",
    unit: "KW",
    price: "499,000",
    highlight: true,
    includes: [
      "10 pcs. Bi Facial Solar Panels 600–650 Watts",
      "1 Set 51.2V-200AH / 10KWhr LiFePO4 Battery",
      "Labor / Materials / Power-Up / Commissioning",
      "Professional and Reliable Service",
    ],
    features: ["Warranty Included", "Renewable Energy", "Eco Friendly", "Fast Charging"],
  },
  {
    id: "hybrid-12kw",
    badge: "Premium",
    badgeColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    tag: "With Battery Banking",
    tagColor: "bg-yellow-500",
    type: "Hybrid Solar",
    brand: "GOODWE",
    brandColor: "text-orange-600",
    capacity: "12",
    unit: "KW",
    price: "699,000",
    highlight: false,
    includes: [
      "20 pcs. Bi Facial Solar Panels 600–650 Watts",
      "1 Set 51.2V-314AH / 16KWhr LiFePO4 Battery",
      "Labor / Materials / Power-Up / Commissioning",
      "Professional and Reliable Service",
    ],
    features: ["Warranty Included", "Renewable Energy", "Eco Friendly", "Fast Charging"],
  },
];

const featureIcons: Record<string, React.ElementType> = {
  "Warranty Included": Shield,
  "Renewable Energy": Zap,
  "Eco Friendly": Leaf,
  "Fast Charging": Battery,
};

export default function PackagesPage() {
  return (
    <div className="w-full overflow-hidden">
      {/* Header */}
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
              className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-sm font-semibold border border-yellow-400/30"
            >
              Special Offer — May 2026
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Solar Packages &amp; Pricing
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 leading-relaxed max-w-2xl"
            >
              Transparent pricing on our most popular hybrid solar packages. All-inclusive — panels, batteries, installation, and commissioning. No hidden fees.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 bg-white/75 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={fadeInUp}
                data-testid={`card-package-${pkg.id}`}
                className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  pkg.highlight
                    ? "border-primary shadow-lg shadow-primary/10 bg-white"
                    : "border-border bg-white"
                }`}
              >
                {/* Top ribbon */}
                {pkg.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-2xl" />
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${pkg.tagColor}`}>
                      {pkg.tag}
                    </span>
                  </div>

                  {/* Type & brand */}
                  <h3 className="text-lg font-bold text-foreground leading-tight mb-1">
                    {pkg.type}
                  </h3>
                  <p className={`text-sm font-extrabold tracking-widest mb-4 ${pkg.brandColor}`}>
                    {pkg.brand}
                  </p>

                  {/* Capacity */}
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-5xl font-black text-foreground leading-none">{pkg.capacity}</span>
                    <span className="text-xl font-bold text-muted-foreground mb-1">{pkg.unit}</span>
                  </div>

                  {/* Feature icons */}
                  <div className="grid grid-cols-4 gap-2 mb-6 p-3 bg-muted/40 rounded-xl">
                    {pkg.features.map((f) => {
                      const Icon = featureIcons[f] ?? Zap;
                      return (
                        <div key={f} className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-[9px] text-center text-muted-foreground leading-tight">{f}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Inclusions */}
                  <ul className="space-y-2 mb-8 flex-1">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className={`rounded-xl p-4 mb-6 text-center ${pkg.highlight ? "bg-primary" : "bg-foreground"}`}>
                    <p className="text-xs font-semibold text-white/70 mb-1 uppercase tracking-wider">Special Offer Price</p>
                    <p className="text-3xl font-black text-white">
                      &#8369;{pkg.price}
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    asChild
                    variant={pkg.highlight ? "default" : "outline"}
                    className="w-full rounded-full"
                    data-testid={`button-inquire-${pkg.id}`}
                  >
                    <Link href="/contact">Inquire Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto"
          >
            All packages include labor, materials, power-up, and commissioning. Prices are special offer rates valid for May 2026. Contact us for custom configurations and bulk pricing.
          </motion.p>
        </div>
      </section>

      {/* What's Always Included */}
      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Every Package Includes
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-xl mx-auto">
              No matter which package you choose, Philin Solar delivers the same commitment to quality and reliability.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Shield, title: "Warranty Coverage", desc: "All systems come with manufacturer and service warranty for peace of mind." },
              { icon: Zap, title: "Full Installation", desc: "Complete labor and materials — panels, wiring, inverter mounting, and more." },
              { icon: Battery, title: "Power-Up & Commissioning", desc: "We test and commission the entire system before handing it over to you." },
              { icon: Leaf, title: "Professional Service", desc: "Certified engineers and technicians handle every installation end-to-end." },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="p-6 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              Not Sure Which Package to Choose?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Our team will assess your energy needs and recommend the right system for your home or business — for free.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-10 font-semibold text-primary">
                <Link href="/contact">Get a Free Assessment</Link>
              </Button>
              <a
                href="tel:+639666651623"
                data-testid="link-cta-phone"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-primary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +63 966 665 1623
              </a>
            </motion.div>
            <motion.p variants={fadeInUp} className="mt-6 text-white/60 text-sm flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              gamz.philincebu2025@gmail.com
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
