import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi, type AccountListParams } from "@/features/accounts/accountsApi";
import toast from "react-hot-toast";

// ── Query keys — single source of truth ──────────────────────────────────────
export const accountKeys = {
  all:    () => ["accounts"] as const,
  lists:  () => [...accountKeys.all(), "list"] as const,
  list:   (params: AccountListParams) => [...accountKeys.lists(), params] as const,
  detail: (id: string) => [...accountKeys.all(), "detail", id] as const,
};

// ── List (paginated + filtered) ───────────────────────────────────────────────
export const useAccounts = (params: AccountListParams = {}) =>
  useQuery({
    queryKey: accountKeys.list(params),
    queryFn:  () => accountsApi.list(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

// ── Single ────────────────────────────────────────────────────────────────────
export const useAccount = (id: string) =>
  useQuery({
    queryKey: accountKeys.detail(id),
    queryFn:  () => accountsApi.getOne(id).then((r) => r.data.data),
    enabled:  !!id,
  });

// ── Create ────────────────────────────────────────────────────────────────────
export const useCreateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success("Account created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create account");
    },
  });
};

// ── Update ────────────────────────────────────────────────────────────────────
export const useUpdateAccount = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof accountsApi.update>[1]) =>
      accountsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.detail(id) });
      qc.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success("Account updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update account");
    },
  });
};

// ── Delete ────────────────────────────────────────────────────────────────────
export const useDeleteAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: accountsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success("Account deleted");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete account");
    },
  });
};
