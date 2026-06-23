import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "@/store";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout/AppLayout";

// ── Pages ─────────────────────────────────────────────────────────────────────
import LoginPage          from "@/pages/LoginPage";
import DashboardPage      from "@/pages/DashboardPage";
import AccountsListPage   from "@/pages/AccountsListPage";
import CreateAccountPage  from "@/pages/CreateAccountPage";
import EditAccountPage      from "@/pages/EditAccountPage";
import AccountDetailsPage from "@/pages/AccountDetailsPage";
import KycListPage         from "@/pages/KycListPage";
import CreateKycPage       from "@/pages/CreateKycPage";
import EditKycPage         from "@/pages/EditKycPage";
import KycDetailsPage      from "@/pages/KycDetailsPage";
import ContactsListPage    from "@/pages/ContactsListPage";
import CreateContactPage   from "@/pages/CreateContactPage";
import EditContactPage     from "@/pages/EditContactPage";
import ContactDetailsPage  from "@/pages/ContactDetailsPage";
import SettingsPage        from "@/pages/SettingsPage";

// ── Query client ──────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1e293b",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "0.875rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            },
            success: { iconTheme: { primary: "#0ca678", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#e03131", secondary: "#fff" } },
          }}
        />


        <Routes>
          {/* ── Public ─────────────────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Protected (requires JWT) ────────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>

              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Accounts */}
              <Route path="/accounts"     element={<AccountsListPage />} />
              <Route path="/accounts/new" element={<CreateAccountPage />} />
              <Route
                path="/accounts/:id/edit"
                element={<EditAccountPage />}
              />
              <Route
                path="/accounts/:id"
                element={<AccountDetailsPage />}
              />

              {/* KYC */}
              <Route path="/kyc"     element={<KycListPage />} />
              <Route path="/kyc/new" element={<CreateKycPage />} />
              <Route path="/kyc/:id" element={<KycDetailsPage />} />
              <Route path="/kyc/:id/edit" element={<EditKycPage />} />

              {/* Contacts */}
              <Route path="/contacts"     element={<ContactsListPage />} />
              <Route path="/contacts/new" element={<CreateContactPage />} />
              <Route path="/contacts/:id" element={<ContactDetailsPage />} />
              <Route path="/contacts/:id/edit" element={<EditContactPage />} />

              {/* Settings */}
              <Route
                path="/settings"
                element={<SettingsPage />}
              />
            </Route>
          </Route>

          {/* ── Fallback ────────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </QueryClientProvider>
    </Provider>
  );
}
