import { useEffect, useState } from "react";
import type { AuthSession } from "../types/auth.types";
import { fetchSession } from "../services/auth.service";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSession()
      .then((data) => {
        if (active) {
          setSession(data);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { session, loading };
}
