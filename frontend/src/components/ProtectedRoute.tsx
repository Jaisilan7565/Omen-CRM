import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
