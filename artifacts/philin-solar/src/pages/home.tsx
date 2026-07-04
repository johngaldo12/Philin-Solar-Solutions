import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, ShieldCheck, Sun, Building2, Home } from "lucide-react";
import homeSolarImg from "@/assets/images/home-solar.png";
import solarCloseUpImg from "@/assets/images/solar-close-up.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30 z-10"></div>
          <img 
            src={homeSolarImg} 
            alt="Solar installation on a modern home" 
            className="w-full h-full object-cover object-right"
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide border border-primary/20">
              Government Accredited Solar Contractor
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Powering the Philippines, <br/><span className="text-primary">One Roof at a Time.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Philin Solar provides premium, reliable solar panel installations for homes and businesses. Achieve energy independence and reduce your electricity bills with our expert engineering.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full text-base h-14 px-8" asChild>
                <Link href="/contact">Get a Free Consultation</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base h-14 px-8" asChild>
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale">
            <div className="flex items-center gap-3 font-semibold text-lg"><ShieldCheck className="text-primary"/> SEC Registered</div>
            <div className="flex items-center gap-3 font-semibold text-lg"><ShieldCheck className="text-primary"/> PCAB Licensed</div>
            <div className="flex items-center gap-3 font-semibold text-lg"><ShieldCheck className="text-primary"/> PhilGEPS Platinum</div>
            <div className="flex items-center gap-3 font-semibold text-lg"><ShieldCheck className="text-primary"/> BIR Certified</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="order-2 lg:order-1 relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                <img src={solarCloseUpImg} alt="Solar panel close up" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-border/30 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Sun className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">100%</p>
                    <p className="text-sm font-medium text-muted-foreground">Clean Energy</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="order-1 lg:order-2"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">
                Engineering a brighter, sustainable tomorrow.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Philin Industrial Corp. (Philin Solar) is a leading provider of solar energy solutions in the Philippines. We don't just install panels; we engineer custom energy systems designed to withstand local weather conditions and maximize your return on investment.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With full government accreditations and a team of seasoned engineers, we deliver peace of mind alongside lower electricity bills.
              </motion.p>
              
              <motion.ul variants={staggerContainer} className="space-y-4 mb-10">
                {[
                  "Tailored engineering for every roof type",
                  "Assistance with MERALCO net metering",
                  "High-efficiency monocrystalline panels",
                  "Comprehensive maintenance & warranties"
                ].map((item, i) => (
                  <motion.li variants={fadeInUp} key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle2 className="text-primary h-6 w-6 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              
              <motion.div variants={fadeInUp}>
                <Button variant="link" className="group text-primary hover:text-primary font-semibold p-0 h-auto" asChild>
                  <Link href="/accreditations">
                    View our accreditations 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white/75 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Solutions for every scale</h2>
            <p className="text-lg text-muted-foreground">From private residences to massive commercial warehouses, we design systems that deliver optimal power generation.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="h-10 w-10 mb-6 text-primary" />,
                title: "Residential Solar",
                desc: "Reduce your monthly electricity bills and protect your home from rising energy costs with a custom rooftop installation."
              },
              {
                icon: <Building2 className="h-10 w-10 mb-6 text-primary" />,
                title: "Commercial Solar",
                desc: "Maximize ROI, reduce operational expenses, and meet corporate sustainability goals with large-scale solar arrays."
              },
              {
                icon: <Zap className="h-10 w-10 mb-6 text-primary" />,
                title: "Off-Grid & Hybrid",
                desc: "Ensure continuous power supply with battery-backed hybrid systems, perfect for areas with unreliable grid connections."
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow group"
              >
                {service.icon}
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">{service.desc}</p>
                <Link href="/services" className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-8 text-white">
              Ready to harness the sun?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-12">
              Contact us today for a free site assessment and a customized solar proposal tailored to your energy needs.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-lg h-14 px-10">
                <Link href="/contact">Request a Quote</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
