import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const staticCeremonialImages: GalleryPhoto[] = [
  { id: -1, src: "/images/ceremonial/ceremonial-01.jpg", alt: "Team at Climate Change Commission Philippines office", category: "ceremonial" },
  { id: -2, src: "/images/ceremonial/ceremonial-02.jpg", alt: "Team at Solar & Storage Live exhibition", category: "ceremonial" },
  { id: -3, src: "/images/ceremonial/ceremonial-03.jpg", alt: "Team at trade show floorplan", category: "ceremonial" },
  { id: -4, src: "/images/ceremonial/ceremonial-04.jpg", alt: "Turn Over Ceremony solar water system", category: "ceremonial" },
  { id: -5, src: "/images/ceremonial/ceremonial-05.jpg", alt: "Team at HYCSOLAR booth", category: "ceremonial" },
  { id: -6, src: "/images/ceremonial/ceremonial-06.jpg", alt: "Team at GOODWE Tier 1 booth", category: "ceremonial" },
  { id: -7, src: "/images/ceremonial/ceremonial-07.jpg", alt: "Water Philippines 2025 exhibition", category: "ceremonial" },
  { id: -8, src: "/images/ceremonial/ceremonial-08.jpg", alt: "Conference networking session", category: "ceremonial" },
  { id: -9, src: "/images/ceremonial/ceremonial-09.jpg", alt: "Conference with climate action partners", category: "ceremonial" },
  { id: -10, src: "/images/ceremonial/ceremonial-10.jpg", alt: "Meeting with climate action leaders", category: "ceremonial" },
  { id: -11, src: "/images/ceremonial/ceremonial-11.jpg", alt: "Team at formal conference event", category: "ceremonial" },
  { id: -12, src: "/images/ceremonial/ceremonial-12.jpg", alt: "Handshake ceremony at Province of Cebu", category: "ceremonial" },
  { id: -13, src: "/images/ceremonial/ceremonial-13.jpg", alt: "Climate Impact awareness event", category: "ceremonial" },
  { id: -14, src: "/images/ceremonial/ceremonial-14.jpg", alt: "Team with provincial officials", category: "ceremonial" },
  { id: -15, src: "/images/ceremonial/ceremonial-15.jpg", alt: "Sustainability workshop ceremony", category: "ceremonial" },
  { id: -16, src: "/images/ceremonial/ceremonial-16.jpg", alt: "National Adaptation Plan workshop", category: "ceremonial" },
];

function useGalleryPhotos() {
  return useQuery<GalleryPhoto[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      return data.photos || [];
    },
  });
}

const tabs = ["All", "Ceremonial", "Installation", "Team", "Products", "Events"];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { data: apiPhotos } = useGalleryPhotos();

  const allPhotos = apiPhotos ? [...staticCeremonialImages, ...apiPhotos] : staticCeremonialImages;

  const filteredImages = activeTab === "All"
    ? allPhotos
    : allPhotos.filter(p =>
        p.category.toLowerCase() === activeTab.toLowerCase() ||
        (activeTab === "Ceremonial" && p.category.toLowerCase() === "ceremonial")
      );

  const showCeremonial = activeTab === "All" || activeTab === "Ceremonial";

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox((prev) => (prev === null ? null : prev === 0 ? filteredImages.length - 1 : prev - 1));
  const nextImage = () => setLightbox((prev) => (prev === null ? null : prev === filteredImages.length - 1 ? 0 : prev + 1));

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
              Browse our completed solar installations, ceremonial events, and team highlights across the Philippines.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">

          {/* Filter tabs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeTab === tab
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          {/* Ceremonial Album */}
          <AnimatePresence mode="wait">
            {showCeremonial && (
              <motion.div
                key="ceremonial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Album Header */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {activeTab === "All" ? "All Photos" : `${activeTab} Photos`}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredImages.length} photos {activeTab === "All" ? "" : `— ${activeTab.toLowerCase()}`}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-border w-full" />
                </div>

                {/* Photo Grid */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {filteredImages.map((img, i) => (
                    <motion.div
                      key={`${img.id}-${i}`}
                      variants={fadeInUp}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-white shadow-sm border border-border hover:shadow-md transition-all"
                      onClick={() => openLightbox(i)}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                          {img.alt}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {activeTab !== "All" && activeTab !== "Ceremonial" && filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center p-10 rounded-2xl border border-border bg-white max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <ImagePlus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                No {activeTab} photos yet
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                We are uploading photos of our {activeTab.toLowerCase()} work. Check back soon!
              </p>
              <Button asChild className="rounded-full px-8">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={filteredImages[lightbox].src}
              alt={filteredImages[lightbox].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white/80 text-sm bg-black/40 inline-block px-4 py-2 rounded-full">
                {filteredImages[lightbox].alt}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
