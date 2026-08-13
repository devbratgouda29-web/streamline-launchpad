import { useEffect, useState, type ReactNode } from "react";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import {
  isSubscriptionActive,
  isTrialActive,
  trialDaysRemaining,
  paidDaysRemaining,
  simulatePayment,
} from "@/lib/subscription-store";
import { IS_TESTING_MODE } from "@/lib/testing-mode";


export function DisciplineGate({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<boolean | null>(null);
  const [trialDays, setTrialDays] = useState(0);
  const [paidDays, setPaidDays] = useState(0);
  const [onTrial, setOnTrial] = useState(false);
  const [paying, setPaying] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const refresh = () => {
    const now = Date.now();
    setActive(isSubscriptionActive(now));
    setOnTrial(isTrialActive(now));
    setTrialDays(trialDaysRemaining(now));
    setPaidDays(paidDaysRemaining(now));
  };

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      simulatePayment();
      refresh();
      setPaying(false);
      setFlash("Payment confirmed. Welcome back, Cadet.");
      setTimeout(() => setFlash(null), 2400);
    }, 900);
  };

  if (active === null) return null;

  if (!active) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-5 backdrop-blur-sm">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-400/30 bg-[oklch(0.12_0.03_60)] p-7 text-center shadow-2xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 30% 0%, oklch(0.55 0.18 60 / 0.35), transparent 55%), radial-gradient(circle at 80% 100%, oklch(0.4 0.15 20 / 0.35), transparent 55%)",
            }}
          />
          <div className="relative">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40">
              <Lock className="h-7 w-7" />
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">
              Trial Completed
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
              Cadet, your vault is sealed.
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Keep your vault open and protect your shields.
            </p>
            <div className="mt-5 rounded-2xl border border-amber-400/30 bg-black/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300/80">
                Discipline Membership
              </p>
              <p className="mt-1 text-4xl font-black text-white">
                ₹15<span className="text-base font-bold text-white/60"> / Month</span>
              </p>
              <p className="mt-1 text-[11px] text-white/50">
                Rolling 30-day access · Cancel anytime
              </p>
            </div>
            <button
              type="button"
              onClick={pay}
              disabled={paying}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-black shadow-lg shadow-amber-500/25 hover:brightness-110 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {paying ? "Processing…" : "Pay Now · ₹15"}
            </button>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-white/40">
              Simulated payment · No real charge
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="sticky top-0 z-30 flex justify-center px-5 pt-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur ${
            IS_TESTING_MODE
              ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
              : onTrial
                ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                : "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          }`}
        >
          <ShieldCheck className="h-3 w-3" />
          {IS_TESTING_MODE
            ? "Demo Mode · All features unlocked"
            : onTrial
              ? `Trial · ${trialDays} day${trialDays === 1 ? "" : "s"} remaining`
              : `Member · ${paidDays} day${paidDays === 1 ? "" : "s"} remaining`}

        </div>
      </div>
      {flash && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
          <div className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-emerald-200 backdrop-blur">
            {flash}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
