import { ReactNode } from "react";

export function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Base gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #0d4f2f 0%, #1a7a4e 25%, #22a86b 50%, #1a7a4e 75%, #0d4f2f 100%)",
        }}
      />

      {/* Geometric triangle pattern overlay */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77)
          `,
          backgroundSize: "80px 140px",
          backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(34,168,107,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(13,79,47,0.4) 0%, transparent 60%)",
        }}
      />

      {children}
    </div>
  );
}
