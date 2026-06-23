import { useQuery } from "@tanstack/react-query";
import { mastersApi } from "@/features/masters/mastersApi";

// ── Fetch all grouped in one request (for form dropdowns) ─────────────────────
export const useMastersGrouped = () =>
  useQuery({
    queryKey: ["masters", "grouped"],
    queryFn:  () => mastersApi.grouped().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000, // masters rarely change — cache 5 min
  });

// ── Fetch a single category (for lazy selects) ─────────────────────────────────
export const useMasterCategory = (category: string) =>
  useQuery({
    queryKey: ["masters", category],
    queryFn:  () => mastersApi.list(category).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  });
