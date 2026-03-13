import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "dark" | "light" | "gold";

interface LogoProps {
  /** Size preset: sm=24px, md=44px, lg=80px, xl=140px */
  size?: LogoSize;
  /** Color variant for different backgrounds */
  variant?: LogoVariant;
  /** Enable subtle pulse glow animation */
  animated?: boolean;
  className?: string;
}

const sizes: Record<LogoSize, number> = {
  sm: 24,
  md: 44,
  lg: 80,
  xl: 140,
};

const coreColors: Record<LogoVariant, { letter: string; ringOpacityMul: number }> = {
  dark: { letter: "#06080f", ringOpacityMul: 1 },
  light: { letter: "#f5f0e8", ringOpacityMul: 0.6 },
  gold: { letter: "#06080f", ringOpacityMul: 1 },
};

/**
 * MathLumen SVG logo — 16-ray radiant burst with concentric rings
 * and an "L" letterform at center.
 *
 * Includes a radial gradient core: #f0de9a -> #c9a84c -> #6a4e10.
 * Animated variant adds a 3s pulse glow.
 */
export function Logo({
  size = "md",
  variant = "dark",
  animated = false,
  className,
}: LogoProps) {
  const px = sizes[size];
  const { letter, ringOpacityMul } = coreColors[variant];
  const id = `logo-grad-${size}`;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MathLumen logo"
      className={cn(animated && "logo-pulse", className)}
    >
      <defs>
        {/* Radial gradient for the core circle */}
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0de9a" />
          <stop offset="55%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#6a4e10" />
        </radialGradient>
      </defs>

      {/* 16 radiant burst rays, 22.5 degree intervals */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = i * 22.5;
        const rad = (angle * Math.PI) / 180;
        const x2 = 50 + 48 * Math.cos(rad);
        const y2 = 50 + 48 * Math.sin(rad);
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={x2.toFixed(2)}
            y2={y2.toFixed(2)}
            stroke="#c9a84c"
            strokeWidth="0.6"
            opacity={0.3}
          />
        );
      })}

      {/* 3 concentric rings */}
      <circle cx="50" cy="50" r="42" stroke="#c9a84c" strokeWidth="0.5" opacity={0.08 * ringOpacityMul} fill="none" />
      <circle cx="50" cy="50" r="34" stroke="#c9a84c" strokeWidth="0.5" opacity={0.12 * ringOpacityMul} fill="none" />
      <circle cx="50" cy="50" r="26" stroke="#c9a84c" strokeWidth="0.7" opacity={0.25 * ringOpacityMul} fill="none" />

      {/* Core gradient circle */}
      <circle cx="50" cy="50" r="18" fill={`url(#${id})`} />

      {/* "L" letterform */}
      <path
        d="M43 38 L43 60 L57 60"
        stroke={letter}
        strokeWidth="4.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
