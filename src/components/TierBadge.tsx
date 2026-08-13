import { Shield, Cog, ShieldCheck, Snowflake, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type TierNumber = 1 | 2 | 3 | 4 | 5;

type TierStyle = {
  name: string;
  from: string;
  to: string;
  ring: string;
  text: string;
  glow: string;
  Icon: typeof Shield;
  pulse?: boolean;
};

const STYLES: Record<TierNumber, TierStyle> = {
  1: {
    name: "Bronze Core",
    from: "oklch(0.55 0.12 45)",
    to: "oklch(0.28 0.09 40)",
    ring: "oklch(0.68 0.13 55)",
    text: "oklch(0.96 0.03 60)",
    glow: "oklch(0.55 0.14 45 / 0.5)",
    Icon: Shield,
  },
  2: {
    name: "Iron Core",
    from: "oklch(0.42 0.02 260)",
    to: "oklch(0.22 0.01 260)",
    ring: "oklch(0.55 0.02 260)",
    text: "oklch(0.96 0.01 260)",
    glow: "oklch(0.4 0.02 260 / 0.5)",
    Icon: Cog,
  },
  3: {
    name: "Steel Sentinel",
    from: "oklch(0.62 0.02 230)",
    to: "oklch(0.32 0.02 230)",
    ring: "oklch(0.82 0.02 230)",
    text: "oklch(0.99 0.01 230)",
    glow: "oklch(0.6 0.03 230 / 0.55)",
    Icon: ShieldCheck,
  },
  4: {
    name: "Titanium Warden",
    from: "oklch(0.72 0.06 220)",
    to: "oklch(0.38 0.09 230)",
    ring: "oklch(0.85 0.14 220)",
    text: "oklch(0.99 0.02 220)",
    glow: "oklch(0.7 0.18 225 / 0.7)",
    Icon: Snowflake,
  },
  5: {
    name: "Platinum Core",
    from: "oklch(0.92 0.14 92)",
    to: "oklch(0.6 0.16 70)",
    ring: "oklch(0.98 0.14 92)",
    text: "oklch(0.2 0.06 80)",
    glow: "oklch(0.88 0.2 88 / 0.75)",
    Icon: Sparkles,
    pulse: true,
  },
};

export function tierStyle(tier: TierNumber) {
  return STYLES[tier];
}

export function TierBadge({
  tier,
  size = 48,
  fractured = false,
  showLabel = false,
  loopCount = 0,
  className,
}: {
  tier: TierNumber;
  size?: number;
  fractured?: boolean;
  showLabel?: boolean;
  loopCount?: number;
  className?: string;
}) {
  const style = STYLES[tier];
  const { Icon } = style;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative grid place-items-center rounded-xl",
          style.pulse && !fractured && "animate-pulse",
        )}
        style={{ width: size, height: size, filter: `drop-shadow(0 4px 14px ${style.glow})` }}
        aria-label={`${style.name}${fractured ? " (Fractured)" : ""}${loopCount > 0 ? ` x${loopCount + 1}` : ""}`}
      >
        <svg viewBox="0 0 60 66" width={size} height={size}>
          <defs>
            <linearGradient id={`tg-${tier}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={style.from} />
              <stop offset="100%" stopColor={style.to} />
            </linearGradient>
            <linearGradient id={`ts-${tier}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="60%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M30 2 L55 11 V32 C55 49 44 60 30 64 C16 60 5 49 5 32 V11 Z"
            fill={`url(#tg-${tier})`}
            stroke={style.ring}
            strokeWidth="1.5"
          />
          <path
            d="M30 2 L55 11 V32 C55 49 44 60 30 64 C16 60 5 49 5 32 V11 Z"
            fill={`url(#ts-${tier})`}
          />
          {fractured && (
            <g stroke="oklch(0.62 0.28 25)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M30 4 L26 20 L34 30 L24 42 L32 54 L28 63" />
              <path d="M26 20 L18 26" />
              <path d="M34 30 L44 34" />
              <path d="M24 42 L14 46" />
              <path d="M32 54 L42 58" />
            </g>
          )}
        </svg>
        <Icon
          className="pointer-events-none absolute"
          style={{
            color: style.text,
            width: size * 0.36,
            height: size * 0.36,
            top: size * 0.24,
          }}
          strokeWidth={2.4}
        />
        {loopCount > 0 && (
          <span
            className="pointer-events-none absolute -right-1 -top-1 rounded-full border border-amber-200 bg-gradient-to-br from-amber-300 to-amber-500 px-1.5 py-[1px] text-[9px] font-black leading-none text-black shadow-[0_0_8px_rgba(251,191,36,0.9)]"
            aria-hidden
          >
            x{loopCount + 1}
          </span>
        )}
      </div>
      {showLabel && (
        <span
          className="text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ color: fractured ? "oklch(0.62 0.28 25)" : style.ring }}
        >
          {fractured ? "Fractured" : style.name}
          {loopCount > 0 && ` x${loopCount + 1}`}
        </span>
      )}
    </div>
  );
}