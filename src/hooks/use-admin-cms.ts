"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminCmsData, DashboardStats } from "@/src/types/admin-cms";

type CmsResponse = {
  data: AdminCmsData;
  stats: DashboardStats;
};

async function fetchCmsData() {
  const response = await fetch("/api/admin/cms", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load CMS data.");
  }

  return (await response.json()) as CmsResponse;
}

export function useAdminCms() {
  const [data, setData] = useState<AdminCmsData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const payload = await fetchCmsData();
    setData(payload.data);
    setStats(payload.stats);
    setLoading(false);
    return payload;
  }, []);

  const save = useCallback(async (nextData: AdminCmsData) => {
    setSaving(true);
    const response = await fetch("/api/admin/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: nextData }),
    });

    if (!response.ok) {
      setSaving(false);
      throw new Error("Unable to save CMS data.");
    }

    const payload = (await response.json()) as { data: AdminCmsData; stats: DashboardStats };
    setData(payload.data);
    setStats(payload.stats);
    setSaving(false);
    return payload;
  }, []);

  useEffect(() => {
    let active = true;

    fetchCmsData()
      .then((payload) => {
        if (!active) return;
        setData(payload.data);
        setStats(payload.stats);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, stats, loading, saving, load, save, setData };
}
