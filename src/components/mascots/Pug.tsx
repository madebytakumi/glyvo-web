import type { MascotProps } from "./types";

/**
 * Pug mascot (face bust), drawn with simple shapes. Fawn coat with the classic
 * dark mask so it stays recognizable; the optional `ring` adds a pastel-purple
 * backdrop for brand cohesion.
 */
export function Pug({ size = 64, className, ring = false, mood = "happy" }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="Pug"
    >
      {ring && <circle cx="32" cy="32" r="31" className="fill-accent-pastel/30" />}

      {/* Ears */}
      <ellipse cx="19" cy="22" rx="6" ry="9" fill="#3A332E" transform="rotate(-18 19 22)" />
      <ellipse cx="45" cy="22" rx="6" ry="9" fill="#3A332E" transform="rotate(18 45 22)" />

      {/* Head */}
      <circle cx="32" cy="34" r="18" fill="#E3C2A0" />
      {/* Forehead wrinkle */}
      <path d="M24 27 Q32 23 40 27" stroke="#C9A579" strokeWidth="1.6" strokeLinecap="round" />

      {/* Eyes */}
      {mood === "sleepy" ? (
        <>
          <path d="M21 32 Q25 35 29 32" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M35 32 Q39 35 43 32" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="25" cy="32" r="3.6" fill="#2A2622" />
          <circle cx="39" cy="32" r="3.6" fill="#2A2622" />
          <circle cx="26.2" cy="30.8" r="1.1" fill="#fff" />
          <circle cx="40.2" cy="30.8" r="1.1" fill="#fff" />
        </>
      )}

      {/* Muzzle mask */}
      <ellipse cx="32" cy="42" rx="9.5" ry="7.5" fill="#3A332E" />
      {/* Nose */}
      <ellipse cx="32" cy="39.5" rx="3.2" ry="2.2" fill="#1C1916" />
      {/* Mouth */}
      <path d="M32 41 Q32 45 28 46 M32 41 Q32 45 36 46" stroke="#1C1916" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
