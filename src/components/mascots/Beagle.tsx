import type { MascotProps } from "./types";

/**
 * Beagle mascot (face bust): long droopy brown ears, white muzzle and a tan
 * patch over the head. Pairs with the Pug as the app's two mascots.
 */
export function Beagle({ size = 64, className, ring = false, mood = "happy" }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="Beagle"
    >
      {ring && <circle cx="32" cy="32" r="31" className="fill-accent-pastel/30" />}

      {/* Long droopy ears (behind the head) */}
      <ellipse cx="15" cy="36" rx="6.5" ry="14" fill="#8B5A2B" transform="rotate(8 15 36)" />
      <ellipse cx="49" cy="36" rx="6.5" ry="14" fill="#8B5A2B" transform="rotate(-8 49 36)" />

      {/* Head */}
      <circle cx="32" cy="32" r="17" fill="#FBF4EA" />
      {/* Tan patch over the top of the head */}
      <path d="M16 28 Q32 12 48 28 Q40 22 32 22 Q24 22 16 28 Z" fill="#C98A4B" />

      {/* Eyes */}
      {mood === "sleepy" ? (
        <>
          <path d="M21 30 Q25 33 29 30" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M35 30 Q39 33 43 30" stroke="#2A2622" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="25" cy="30" r="3.2" fill="#2A2622" />
          <circle cx="39" cy="30" r="3.2" fill="#2A2622" />
          <circle cx="26" cy="29" r="1" fill="#fff" />
          <circle cx="40" cy="29" r="1" fill="#fff" />
        </>
      )}

      {/* Muzzle */}
      <ellipse cx="32" cy="40" rx="8" ry="6.5" fill="#FFFFFF" />
      {/* Nose */}
      <ellipse cx="32" cy="37.5" rx="2.8" ry="2" fill="#1C1916" />
      {/* Mouth */}
      <path d="M32 39 Q32 44 28 45 M32 39 Q32 44 36 45" stroke="#6B4A2B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
