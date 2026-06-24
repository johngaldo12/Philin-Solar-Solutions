import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ImagePlus, Video } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const placeholders = Array.from({ length: 9 }, (_, i) => i + 1);

export default function GalleryPage() {
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
              className="inline-block mb-4 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30"
            >
              Our Work
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Project Gallery
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-300 leading-relaxed max-w-2xl"
            >
              Browse our completed solar installations across homes and businesses in the Philippines. Photos and videos of our work — coming soon.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">

          {/* Filter tabs — ready for future content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {["All", "Residential", "Commercial", "Before & After", "Videos"].map((tab, i) => (
              <button
                key={tab}
                data-testid={`tab-gallery-${tab.toLowerCase().replace(/\s|&/g, "-")}`}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                  i === 0
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          {/* Placeholder Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {placeholders.map((n) => (
              <motion.div
                key={n}
                variants={fadeInUp}
                data-testid={`placeholder-gallery-${n}`}
                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-border bg-white flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                {n % 4 === 0 ? (
                  <Video className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary/50 transition-colors" />
                ) : (
                  <ImagePlus className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary/50 transition-colors" />
                )}
                <span className="text-sm font-medium text-muted-foreground/50">
                  {n % 4 === 0 ? "Video coming soon" : "Photo coming soon"}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Coming soon message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center p-10 rounded-2xl border border-border bg-white max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <ImagePlus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Gallery Coming Soon</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We are uploading photos and videos of our completed solar installations. Check back soon to see Philin Solar's work across Luzon, Visayas, and Mindanao.
            </p>
            <Button asChild className="rounded-full px-8">
              <Link href="/contact">Contact Us in the Meantime</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              Want to See Our Work in Person?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Schedule a site visit or call us to speak directly with our project team.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-10 font-semibold text-primary">
                <Link href="/contact">Schedule a Visit</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-10 text-white border-white hover:bg-white hover:text-primary">
                <Link href="/packages">View Packages</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
