import { ReactNode } from "react";

export function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Green base */}
      <div className="absolute inset-0 -z-10 bg-[#0b8a52]" />

      {/* Prominent triangle mesh — large triangles with thick visible lines */}
      <svg
        className="absolute inset-0 -z-10 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="tri-mesh"
            width="500"
            height="433"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer triangle */}
            <path
              d="M250 0 L500 433 L0 433 Z"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="4"
            />
            {/* Inner triangle */}
            <path
              d="M250 70 L420 360 L80 360 Z"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2.5"
            />
            {/* Small inner triangle */}
            <path
              d="M250 140 L340 300 L160 300 Z"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            {/* Center to vertex lines */}
            <line x1="250" y1="0" x2="250" y2="140" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            <line x1="0" y1="433" x2="160" y2="300" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            <line x1="500" y1="433" x2="340" y2="300" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tri-mesh)" />
      </svg>

      {/* Second mesh layer — offset for density */}
      <svg
        className="absolute inset-0 -z-10 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="tri-mesh-2"
            width="500"
            height="433"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(250, 216)"
          >
            <path
              d="M250 433 L500 0 L0 0 Z"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="3"
            />
            <path
              d="M250 363 L420 73 L80 73 Z"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tri-mesh-2)" />
      </svg>

      {children}
    </div>
  );
}
