"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "dark" | "light" | "gold";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  animated?: boolean;
  className?: string;
}

const sizes: Record<LogoSize, number> = {
  sm: 24,
  md: 44,
  lg: 80,
  xl: 140,
};

const coreColors: Record<LogoVariant, { letter: string }> = {
  dark: { letter: "#080d1a" },
  light: { letter: "#080d1a" },
  gold: { letter: "#080d1a" },
};

export function Logo({
  size = "md",
  variant = "dark",
  animated = false,
  className,
}: LogoProps) {
  const uid = useId();
  const px = sizes[size];
  const { letter } = coreColors[variant];

  const gradId = `${uid}-core-grad`;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MathLumen logo"
      className={cn(animated && "logo-pulse", className)}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f0de9a" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#6a4e10" />
        </radialGradient>
      </defs>

      {/* Background */}
      <circle cx="60" cy="60" r="59" fill="#06080f" />

      {/* Glow ring */}
      <circle cx="60" cy="60" r="58" fill="#c9a84c" fillOpacity="0.16" />

      {/* Outer rings */}
      <circle cx="60" cy="60" r="53" stroke="#c9a84c" strokeWidth="0.8" opacity="0.9" fill="none" />
      <circle cx="60" cy="60" r="42" stroke="#c9a84c" strokeWidth="0.5" opacity="0.8" fill="none" />

      {/* Cardinal rays */}
      <line x1="60" y1="4" x2="60" y2="20" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="100" x2="60" y2="116" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="4" y1="60" x2="20" y2="60" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="60" x2="116" y2="60" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" />

      {/* Diagonal rays */}
      <line x1="16" y1="16" x2="27" y2="27" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <line x1="104" y1="16" x2="93" y2="27" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <line x1="16" y1="104" x2="27" y2="93" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <line x1="104" y1="104" x2="93" y2="93" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

      {/* Micro rays */}
      <line x1="35" y1="6" x2="39" y2="19" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />
      <line x1="85" y1="6" x2="81" y2="19" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />

      <line x1="6" y1="35" x2="19" y2="39" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />
      <line x1="6" y1="85" x2="19" y2="81" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />

      <line x1="114" y1="35" x2="101" y2="39" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />
      <line x1="114" y1="85" x2="101" y2="81" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />

      <line x1="35" y1="114" x2="39" y2="101" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />
      <line x1="85" y1="114" x2="81" y2="101" stroke="#c9a84c" strokeWidth="0.9" opacity="0.42" strokeLinecap="round" />

      {/* Core glow */}
      <circle cx="60" cy="60" r="16" fill="#c9a84c" opacity="0.2" />
      <circle cx="60" cy="60" r="9" fill={`url(#${gradId})`} />

      {/* L letter */}
      <line x1="55" y1="52" x2="55" y2="67" stroke={letter} strokeWidth="4" strokeLinecap="round" />
      <line x1="55" y1="67" x2="66" y2="67" stroke={letter} strokeWidth="4" strokeLinecap="round" />
      <circle cx="55" cy="52" r="2.2" fill={letter} />
    </svg>
  );
}