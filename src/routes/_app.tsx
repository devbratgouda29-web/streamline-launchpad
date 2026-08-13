import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RecoveryScreen } from "@/components/RecoveryScreen";
import { checkStreakStatus } from "@/lib/revision-engine";
import { isQuietHours } from "@/lib/notifications";
import { playShatter } from "@/lib/fracture-sfx";

import {
  getSession,
  subscribe as subscribeSession,
  type RecallSession,
} from "@/lib/recall-session";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  const [session, setSession] = useState<RecallSession | null>(() => getSession());
  // Hydration safeguard: every screen below reads localStorage-backed stores,
  // so we only render them after mount to guarantee server/client markup match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const key = "ftlb.fractures.lastCheck";
    const now = Date.now();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    const last = Number(localStorage.getItem(key) ?? 0);
    const freshlyFractured = checkStreakStatus(now).broken;
    // Suppress the shatter alert during quiet hours (10PM–6AM).
    if (freshlyFractured.length > 0 && last < midnight.getTime() && !isQuietHours(now)) {
      playShatter();
    }
    localStorage.setItem(key, String(now));
  }, []);


  useEffect(() => {
    setSession(getSession());
    const unsub = subscribeSession((s) => setSession(s));
    return () => unsub();
  }, []);

  const showLockdown =
    !!session && !session.completed && session.remainingMs > 0;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col bg-background">
      <main className="flex-1 pb-24">
        {mounted ? (
          <ErrorBoundary fallback={(_err, reset) => <RecoveryScreen onReset={reset} />}>
            <Outlet />
          </ErrorBoundary>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" aria-hidden />
          </div>
        )}
      </main>
      <BottomNav />
      {mounted && showLockdown && <RecallLockdownOverlay session={session!} />}
    </div>
  );
}

function RecallLockdownOverlay({ session }: { session: RecallSession }) {
  // Guard: never render on top of the reader itself.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/reader/")) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-6 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl border border-destructive/40 bg-neutral-950 p-6 text-center shadow-2xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/20 text-destructive">
          <Lock className="h-6 w-6" />
        </div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.28em] text-destructive">
          Lockdown Engaged
        </p>
        <h2 className="mt-1 text-2xl font-black text-white">
          Complete your Obligatory Recall
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Bottom navigation is disabled until you finish this recall session.
        </p>
        <Link
          to="/reader/$noteId"
          params={{ noteId: session.sourceId }}
          search={{ mode: "recall" }}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-amber-300"
        >
          <BookOpen className="h-4 w-4" /> Open PDF
        </Link>
      </div>
    </div>
  );
}
