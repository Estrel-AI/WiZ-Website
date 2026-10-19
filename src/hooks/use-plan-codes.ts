import { useEffect, useState } from 'react';

export type PlanCodesState = {
  codes: Record<string, string>;
  loading: boolean;
  error: string | null;
};

export function usePlanCodes() {
  const [state, setState] = useState<PlanCodesState>({
    codes: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchPlanCodes = async () => {
      try {
        const response = await fetch('/api/pricing/plan-codes', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch plan codes: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          const codes = data.data?.planCodes || data.planCodes || {};
          setState({
            codes,
            loading: false,
            error: null,
          });
        } else {
          throw new Error(data.error || 'Failed to load plan codes');
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load plan codes',
          }));
        }
      }
    };

    fetchPlanCodes();

    return () => controller.abort();
  }, []);

  return state;
}