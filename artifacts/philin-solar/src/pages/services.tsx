import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap, Sun, Battery, Settings, Wrench, Home, Building2, ArrowRight } from "lucide-react";
import commercialSolarImg from "@/assets/images/commercial-solar.png";

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

const services = [
  {
    id: "residential",
    icon: <Home className="h-8 w-8" />,
    title: "Residential Solar Installation",
    description: "Transform your roof into a power plant. We design and install high-efficiency solar panel systems for homes, significantly reducing monthly electricity bills while increasing your property value and energy independence."
  },
  {
    id: "commercial",
    icon: <Building2 className="h-8 w-8" />,
    title: "Commercial Solar Installation",
    description: "Large-scale solar solutions for offices, warehouses, and industrial facilities. Take control of your operational costs, maximize ROI, and meet your corporate sustainability targets with reliable, grid-tied commercial systems."
  },
  {
    id: "engineering",
    icon: <Settings className="h-8 w-8" />,
    title: "System Design & Engineering",
    description: "Every building is unique. Our certified engineers create custom-designed solar systems tailored to your specific energy consumption profile, roof architecture, structural integrity, and budget requirements."
  },
  {
    id: "net-metering",
    icon: <Zap className="h-8 w-8" />,
    title: "Net Metering Assistance",
    description: "We handle the complex paperwork. Our team assists clients with the complete registration process for MERALCO and local utility net metering programs, allowing you to legally sell excess electricity back to the grid."
  },
  {
    id: "hybrid",
    icon: <Battery className="h-8 w-8" />,
    title: "Off-grid & Hybrid Systems",
    description: "Achieve complete energy security. We install battery-backed hybrid systems for critical load protection during outages, and full off-grid solutions for remote areas without reliable utility connections."
  },
  {
    id: "maintenance",
    icon: <Wrench className="h-8 w-8" />,
    title: "Solar Maintenance & Repair",
    description: "Protect your investment. We offer scheduled maintenance, professional panel cleaning, system diagnostics, and swift repair services to ensure your solar array continues operating at peak efficiency for decades."
  }
];

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-foreground text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 hidden lg:block">
          <img src={commercialSolarImg} alt="Commercial solar" className="w-full h-full object-cover object-left" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Comprehensive Solar Solutions
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-gray-400 mb-8 leading-relaxed">
              From initial engineering to lifetime maintenance, Philin Solar provides end-to-end energy solutions tailored to your specific needs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Process</h2>
            <p className="text-lg text-muted-foreground">We make transitioning to solar simple, transparent, and hassle-free.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border -z-10"></div>
            
            {[
              { step: "01", title: "Consultation", desc: "We evaluate your energy usage and site viability." },
              { step: "02", title: "Engineering", desc: "Custom system design tailored to your property." },
              { step: "03", title: "Installation", desc: "Professional deployment by certified technicians." },
              { step: "04", title: "Activation", desc: "Final testing, grid connection, and handover." }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }
                }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto bg-white border-4 border-muted flex items-center justify-center rounded-full text-2xl font-bold text-foreground mb-6 shadow-sm">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your solar journey?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg max-w-2xl mx-auto">
            Our experts are ready to design the perfect system for your needs.
          </p>
          <Button size="lg" variant="secondary" className="rounded-full text-primary font-bold h-14 px-10" asChild>
            <Link href="/contact">Get a Free Proposal</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
