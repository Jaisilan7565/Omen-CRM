import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsApi, type ContactListParams, type ContactPayload } from "@/features/contacts/contactsApi";
import toast from "react-hot-toast";

// ── Query keys ────────────────────────────────────────────────────────────────
export const contactKeys = {
  all:    () => ["contacts"] as const,
  lists:  () => [...contactKeys.all(), "list"] as const,
  list:   (params: ContactListParams) => [...contactKeys.lists(), params] as const,
  detail: (id: string) => [...contactKeys.all(), "detail", id] as const,
};

// ── List (paginated + filtered) ───────────────────────────────────────────────
export const useContacts = (params: ContactListParams = {}) =>
  useQuery({
    queryKey: contactKeys.list(params),
    queryFn:  () => contactsApi.list(params).then((r) => r.data.data),
    placeholderData: (prev) => prev,
  });

// ── Single ────────────────────────────────────────────────────────────────────
export const useContact = (id: string) =>
  useQuery({
    queryKey: contactKeys.detail(id),
    queryFn:  () => contactsApi.getOne(id).then((r) => r.data.data),
    enabled:  !!id,
  });

// ── Create ────────────────────────────────────────────────────────────────────
export const useCreateContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactPayload) => contactsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success("KYC record created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create KYC record");
    },
  });
};

// ── Update ────────────────────────────────────────────────────────────────────
export const useUpdateContact = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactPayload) => contactsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.detail(id) });
      qc.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success("KYC record updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update KYC record");
    },
  });
};

// ── Delete ────────────────────────────────────────────────────────────────────
export const useDeleteContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contactsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.lists() });
      toast.success("KYC record deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete KYC record");
    },
  });
};
