import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  ChevronLeft,
  LogOut,
  Bell,
  Search,
  Settings,
  UserCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { logout } from "@/store/authSlice";
import { authApi } from "@/features/auth/authApi";
import toast from "react-hot-toast";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/accounts",  icon: Building2,        label: "Accounts"  },
  { to: "/kyc",       icon: Users,             label: "KYC"       },
  { to: "/contacts",  icon: UserCircle,        label: "Contacts"  },
  { to: "/settings",  icon: Settings,          label: "Settings"  },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const user       = useAppSelector((s) => s.auth.user);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* silent */ }
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col flex-shrink-0 bg-white border-r border-slate-200 overflow-hidden relative z-20 shadow-sm"
      >
        {/* Brand */}
        <div className="relative flex items-center gap-2.5 px-4 py-[1.1rem] border-b border-slate-100 min-h-[60px]">
          <div
            className="flex items-center justify-center w-[34px] h-[34px] rounded-[9px] flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)",
              boxShadow:  "0 2px 8px rgba(59,91,219,0.35)",
            }}
          >
            <Building2 size={18} color="#fff" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="text-[0.88rem] font-bold text-slate-800 tracking-tight whitespace-nowrap flex-1"
              >
                TechGlora CRM
              </motion.span>
            )}
          </AnimatePresence>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer z-10 shadow-sm"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronLeft size={13} />
            </motion.div>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-[0.58rem] rounded-lg text-[0.875rem] font-medium whitespace-nowrap min-h-[40px] no-underline transition-all ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50 border border-indigo-200/70"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.14 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User / logout */}
        <div className="px-2 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg mb-1 overflow-hidden">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[0.82rem] font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#3b5bdb,#845ef7)" }}
            >
              {user?.fullName?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                  className="overflow-hidden"
                >
                  <p className="text-[0.82rem] font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis m-0">
                    {user?.fullName}
                  </p>
                  <p className="text-[0.68rem] text-slate-400 whitespace-nowrap m-0">
                    {user?.roles?.[0]?.name ?? "Admin"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="w-full flex items-center gap-2.5 px-3 py-[0.52rem] rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 text-[0.85rem] font-medium whitespace-nowrap transition-all cursor-pointer border-none bg-transparent"
          >
            <LogOut size={15} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-[60px] flex items-center justify-between px-6 bg-white border-b border-slate-200 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-[0.45rem] w-[280px]">
            <Search size={15} className="text-slate-400 flex-shrink-0" />
            <input
              className="bg-transparent border-none outline-none text-[0.85rem] text-slate-600 w-full placeholder:text-slate-400"
              placeholder="Search accounts, KYC…"
              aria-label="Search"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-none bg-transparent"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white" />
            </button>
            <button
              aria-label="Profile"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-none bg-transparent"
            >
              <UserCircle size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
