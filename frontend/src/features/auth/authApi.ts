import api from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginPayload) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};
