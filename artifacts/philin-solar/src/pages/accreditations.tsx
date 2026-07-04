import { motion } from "framer-motion";
import { FileText, CheckCircle, ShieldCheck } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const accreditations = [
  {
    title: "SEC Registration",
    issuer: "Securities and Exchange Commission (SEC), Philippines",
    refNo: "CS202000969",
    date: "January 2020",
    desc: "Official corporate registration recognizing Philin Industrial Corp. as a legitimate legal entity."
  },
  {
    title: "PhilGEPS Platinum Membership",
    issuer: "PhilGEPS / Department of Budget and Management",
    refNo: "202307-355748-1438120746",
    date: "July 27, 2023",
    desc: "Certified as a qualified government supplier/contractor under RA 9184 (Government Procurement Reform Act)."
  },
  {
    title: "PCAB License",
    issuer: "Philippine Contractors Accreditation Board",
    refNo: "50866",
    date: "Latest: August 1, 2024",
    desc: "Principal Classification: General Building, Category B. Legally authorized to undertake contracting projects."
  },
  {
    title: "Tax Clearance Certificate",
    issuer: "Bureau of Internal Revenue (BIR), Philippines",
    refNo: "RR5-024-08-08-R1061-2024-M",
    date: "August 8, 2024",
    desc: "Proof of full compliance with national tax obligations and clear standing with the BIR."
  },
  {
    title: "Mayor's Business Permit",
    issuer: "City Government of Valenzuela",
    refNo: "23152444",
    date: "January 20, 2024",
    desc: "Official permit to operate business within Valenzuela City jurisdiction."
  },
  {
    title: "Audited Financial Statements",
    issuer: "Nonita A. Dela Paz, CPA",
    refNo: "Period: 2023-2024",
    date: "Annual",
    desc: "Financially sound track record verified by a PRC and BIR accredited independent auditor."
  }
];

export default function AccreditationsPage() {
  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-white/60 backdrop-blur-sm border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="w-10 h-10" />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6">
              Our Accreditations
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed">
              Trust is the foundation of our business. Philin Solar is fully licensed, accredited, and compliant with all Philippine regulatory bodies.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accreditations.map((item, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-border flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                
                <div className="flex items-start gap-4 mb-6 relative z-10">
                  <FileText className="text-primary w-8 h-8 shrink-0" />
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                </div>
                
                <div className="space-y-4 mb-8 flex-grow relative z-10">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Issuing Body</p>
                    <p className="text-sm font-medium">{item.issuer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Registration / Ref No.</p>
                    <p className="text-sm font-medium font-mono bg-muted px-2 py-1 rounded inline-block">{item.refNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Date</p>
                    <p className="text-sm font-medium">{item.date}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-auto relative z-10">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
