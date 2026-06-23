import { motion } from "framer-motion";
import {
  Building2,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppStore";
import { useAccounts } from "@/hooks/useAccounts";
import { useContacts } from "@/hooks/useContacts";

const quickActions = [
  {
    title: "Create an Account",
    desc: "Add a company or business account to the CRM",
    path: "/accounts/new",
    dot: "#3b5bdb",
  },
  {
    title: "Add a Contact",
    desc: "Create a contact linked to an existing account",
    path: "/contacts/new",
    dot: "#845ef7",
  },
  {
    title: "View All Accounts",
    desc: "Browse and manage all your CRM accounts",
    path: "/accounts",
    dot: "#0ca678",
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const { data: accountsData, isLoading: accountsLoading } = useAccounts({ limit: 1 });
  const { data: contactsData, isLoading: contactsLoading } = useContacts({ limit: 1 });

  const totalAccounts = accountsLoading ? "..." : (accountsData?.total ?? 0);
  const totalContacts = contactsLoading ? "..." : (contactsData?.total ?? 0);

  const statCards = [
    {
      label: "Total Accounts",
      value: totalAccounts,
      icon: Building2,
      bg: "#3b5bdb",
      glow: "rgba(59,91,219,0.15)",
      note: "Live accounts count",
    },
    {
      label: "Total Contacts",
      value: totalContacts,
      icon: Users,
      bg: "#845ef7",
      glow: "rgba(132,94,247,0.15)",
      note: "Live KYC contacts count",
    },
    {
      label: "Active Deals",
      value: "—",
      icon: TrendingUp,
      bg: "#0ca678",
      glow: "rgba(12,166,120,0.15)",
      note: "Coming soon",
    },
    {
      label: "Activities",
      value: "—",
      icon: Activity,
      bg: "#f76707",
      glow: "rgba(247,103,7,0.15)",
      note: "Coming soon",
    },
  ];

  return (
    <div className="flex flex-col gap-7">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[1.55rem] font-extrabold text-slate-800 tracking-tight mb-1">
            {getGreeting()},{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#3b5bdb,#845ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {user?.fullName?.split(" ")[0] || "User"}
            </span>{" "}
            👋
          </h1>
          <p className="text-[0.875rem] text-slate-500 m-0">
            Here's what's happening in your CRM today.
          </p>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            onClick={() => navigate("/accounts/new")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.85rem] font-semibold text-white border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)",
              boxShadow: "0 2px 12px rgba(59,91,219,0.25)",
            }}
          >
            <PlusCircle size={15} />
            New Account
          </button>
          <button
            onClick={() => navigate("/contacts/new")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.85rem] font-semibold text-slate-600 bg-white border border-slate-200 cursor-pointer transition-all hover:bg-slate-50 hover:text-slate-800 shadow-sm"
          >
            <PlusCircle size={15} />
            New Contact
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
            className="flex items-start gap-4 rounded-2xl p-5 bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <div
              className="w-[42px] h-[42px] rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: card.bg, boxShadow: `0 4px 12px ${card.glow}` }}
            >
              <card.icon size={20} color="#fff" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[1.6rem] font-extrabold text-slate-800 leading-none tracking-tight">
                {card.value}
              </span>
              <span className="text-[0.78rem] text-slate-500 font-medium">
                {card.label}
              </span>
              <span className="text-[0.7rem] text-slate-400 mt-1">{card.note}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Quick start ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
        className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm"
      >
        <h2 className="text-[1rem] font-bold text-slate-800 mb-3.5 tracking-tight">
          Get Started
        </h2>
        <div className="flex flex-col gap-2">
          {quickActions.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-left w-full transition-all hover:bg-slate-100/70 hover:border-slate-300 group"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: item.dot }}
              />
              <div className="flex-1">
                <p className="text-[0.875rem] font-semibold text-slate-800 m-0 mb-0.5">
                  {item.title}
                </p>
                <p className="text-[0.76rem] text-slate-500 m-0">{item.desc}</p>
              </div>
              <ArrowRight
                size={15}
                className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── System status badges ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex gap-2.5 flex-wrap"
      >
        {[
          "✓ Backend connected at localhost:5000",
          `✓ JWT authenticated as ${user?.email || "anonymous"}`,
          `✓ Role: ${user?.roles?.[0]?.name ?? "Platform Admin"}`,
        ].map((badge) => (
          <span
            key={badge}
            className="text-[0.74rem] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2.5 py-1.5 font-medium"
          >
            {badge}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
