import api from "@/lib/axios";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface UserRole {
  code: string;
  name: string;
}

export interface CRMUser {
  id: string;
  fullName: string;
  email: string;
  status: "active" | "inactive";
  phone?: string | null;
  employeeId?: string | null;
  designation?: string | null;
  department?: string | null;
  timezone?: string | null;
  language?: string | null;
  bio?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface UserListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: CRMUser[];
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  status?: "active" | "inactive";
  phone?: string;
  employeeId?: string;
  designation?: string;
  department?: string;
  role?: string;
  timezone?: string;
  language?: string;
  bio?: string;
  location?: string;
  linkedinUrl?: string;
}

export type UpdateUserPayload = Omit<Partial<CreateUserPayload>, "password">;

// ── API calls ──────────────────────────────────────────────────────────────────
export const usersApi = {
  list:         (params?: UserListParams) =>
    api.get<{ data: UserListResponse }>("/contacts", { params }),
  getOne:       (id: string) =>
    api.get<{ data: CRMUser }>(`/contacts/${id}`),
  create:       (data: CreateUserPayload) =>
    api.post<{ data: CRMUser }>("/contacts", data),
  update:       (id: string, data: UpdateUserPayload) =>
    api.patch<{ data: CRMUser }>(`/contacts/${id}`, data),
  toggleStatus: (id: string) =>
    api.patch<{ data: CRMUser }>(`/contacts/${id}/toggle-status`),
};
