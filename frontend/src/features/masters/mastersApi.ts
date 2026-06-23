import api from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MasterItem {
  id: string;
  code: string;
  label: string;
}

export interface MastersGrouped {
  ACCOUNT_TYPE?: MasterItem[];
  INDUSTRY?: MasterItem[];
  LEAD_SOURCE?: MasterItem[];
  ACCOUNT_STATUS?: MasterItem[];
  [category: string]: MasterItem[] | undefined;
}

// ── API calls ─────────────────────────────────────────────────────────────────
export const mastersApi = {
  list:    (category?: string) =>
    api.get<{ data: MasterItem[] }>("/masters", { params: { category } }),
  grouped: () =>
    api.get<{ data: MastersGrouped }>("/masters/grouped"),
};
