import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * MathLumen brand logo with mathematical symbol accent.
 */
export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-gold font-mono text-xl leading-none" aria-hidden="true">
        &Sigma;
      </span>
      <span className="font-display text-xl font-bold text-paper tracking-tight">
        Math<span className="text-gold">Lumen</span>
      </span>
    </div>
  );
}
