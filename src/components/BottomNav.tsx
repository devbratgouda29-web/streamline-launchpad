import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Flame, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { isLockdownActive, subscribe as subscribeRevision } from "@/lib/revision-engine";
import { getSession, subscribe as subscribeSession } from "@/lib/recall-session";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/library", label: "Library", icon: BookOpen, lockable: true },
  { to: "/discipline", label: "Discipline", icon: Flame },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    const compute = () => {
      const s = getSession();
      const activeRecall = !!s && !s.completed && s.remainingMs > 0;
      setLocked(isLockdownActive() || activeRecall);
    };
    compute();
    const u1 = subscribeRevision(compute);
    const u2 = subscribeSession(compute);
    return () => { u1(); u2(); };
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => {
          const { to, label, icon: Icon } = t;
          const active = pathname === to || pathname.startsWith(to + "/");
          const isLocked = locked;
          if (isLocked) {
            return (
              <li key={to} className="flex-1">
                <span
                  aria-disabled="true"
                  title="Locked — complete recall or use Dev Pass to bypass"
                  className="flex cursor-not-allowed flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-destructive/70"
                >
                  <span className="grid h-9 w-14 place-items-center rounded-full bg-destructive/10">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span>{label}</span>
                </span>
              </li>
            );
          }
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-14 place-items-center rounded-full transition-colors",
                    active ? "bg-primary/10" : "bg-transparent",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
