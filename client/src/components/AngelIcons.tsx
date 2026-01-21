import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function AngelWings({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 200 80"
      className={cn("w-full h-auto", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Wing */}
      <path
        d="M100 40 C80 35, 60 20, 20 25 C40 30, 55 35, 70 40 C55 40, 40 45, 15 50 C40 48, 60 45, 80 42 C65 48, 50 55, 25 65 C50 58, 70 50, 90 43"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        fill="url(#wingFill)"
        opacity="0.9"
      />
      {/* Right Wing */}
      <path
        d="M100 40 C120 35, 140 20, 180 25 C160 30, 145 35, 130 40 C145 40, 160 45, 185 50 C160 48, 140 45, 120 42 C135 48, 150 55, 175 65 C150 58, 130 50, 110 43"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        fill="url(#wingFill)"
        opacity="0.9"
      />
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f4e4a6" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="wingFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#f4e4a6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Halo({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 40"
      className={cn("w-full h-auto", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="50"
        cy="20"
        rx="40"
        ry="12"
        stroke="url(#haloGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.8"
      />
      <ellipse
        cx="50"
        cy="20"
        rx="35"
        ry="9"
        stroke="url(#haloGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <defs>
        <linearGradient id="haloGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#f4e4a6" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DivineStar({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 50 50"
      className={cn("w-6 h-6", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 0 L27 20 L50 25 L27 30 L25 50 L23 30 L0 25 L23 20 Z"
        fill="url(#starGradient)"
        opacity="0.9"
      />
      <circle cx="25" cy="25" r="3" fill="#f4e4a6" />
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f4e4a6" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DivineRays({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("w-full h-full absolute inset-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="100"
          x2={100 + 90 * Math.cos((i * 30 * Math.PI) / 180)}
          y2={100 + 90 * Math.sin((i * 30 * Math.PI) / 180)}
          stroke="url(#rayGradient)"
          strokeWidth="1"
          opacity={0.3 + (i % 2) * 0.2}
        />
      ))}
      <defs>
        <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Dove({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={cn("w-12 h-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 20 C25 15, 15 10, 5 15 C15 18, 20 20, 25 22 M30 20 C35 15, 45 10, 55 15 C45 18, 40 20, 35 22 M30 20 L30 35 M25 30 L30 35 L35 30"
        stroke="url(#doveGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="30" cy="18" r="4" fill="url(#doveGradient)" />
      <defs>
        <linearGradient id="doveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f4e4a6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Cross({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 40 60"
      className={cn("w-8 h-12", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="15" y="0" width="10" height="60" rx="2" fill="url(#crossGradient)" />
      <rect x="0" y="15" width="40" height="10" rx="2" fill="url(#crossGradient)" />
      <defs>
        <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f4e4a6" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FloatingParticles({ className }: IconProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#d4af37] animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}
