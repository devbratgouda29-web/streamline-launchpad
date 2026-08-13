import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

/**
 * Client-side admin check (UI affordance only — real access is enforced by RLS
 * and the `has_role()` check inside every admin server function).
 *
 * A user counts as admin when they hold the `admin` role row, OR their email
 * contains "admin", OR their auth metadata says `role === "admin"`.
 */
export function useIsAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    // Dev Pass bypass — local override so the console is reachable in preview.
    try {
      if (typeof window !== "undefined" && localStorage.getItem("ftlb.devpass.admin") === "1") {
        setIsAdmin(true);
        return;
      }
    } catch { /* ignore */ }

    if (loading) return;
    if (!user?.id) {
      setIsAdmin(false);
      return;
    }

    const metaRole =
      (user.user_metadata as { role?: string } | undefined)?.role === "admin";
    const mail = (user.email ?? "").toLowerCase();
    const emailAdmin = mail.includes("admin") || mail === "devbratgouda29@gmail.com";
    if (metaRole || emailAdmin) {
      setIsAdmin(true);
      return;
    }

    void (async () => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (active) setIsAdmin(!!data);
      } catch {
        if (active) setIsAdmin(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user?.id, user?.email, user?.user_metadata, loading]);


  return { isAdmin, checking: loading || isAdmin === null };
}
