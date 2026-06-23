import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, type UserListParams } from "@/features/users/usersApi";
import toast from "react-hot-toast";

// ── Query keys ────────────────────────────────────────────────────────────────
export const userKeys = {
  all:    () => ["users"] as const,
  lists:  () => [...userKeys.all(), "list"] as const,
  list:   (params: UserListParams) => [...userKeys.lists(), params] as const,
  detail: (id: string) => [...userKeys.all(), "detail", id] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export const useUsers = (params: UserListParams = {}) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn:  () => usersApi.list(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

// ── Single ────────────────────────────────────────────────────────────────────
export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn:  () => usersApi.getOne(id).then((r) => r.data.data),
    enabled:  !!id,
  });

// ── Create ────────────────────────────────────────────────────────────────────
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Contact created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create contact");
    },
  });
};

// ── Update ────────────────────────────────────────────────────────────────────
export const useUpdateUser = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof usersApi.update>[1]) =>
      usersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.detail(id) });
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Contact updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update contact");
    },
  });
};

// ── Toggle status ─────────────────────────────────────────────────────────────
export const useToggleUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.toggleStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Contact status updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update status");
    },
  });
};
