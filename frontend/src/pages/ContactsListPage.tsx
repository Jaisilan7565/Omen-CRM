import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Search, ChevronLeft, ChevronRight, Mail, Phone,
  Briefcase, MoreVertical, Pencil, ToggleLeft, ToggleRight,
  Users, Eye,
} from "lucide-react";
import { useUsers, useToggleUserStatus } from "@/hooks/useUsers";
import type { CRMUser, UserListParams } from "@/features/users/usersApi";
import { useDebounce } from "@/hooks/useDebounce";

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusBadge = (s: string) =>
  s === "active"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-red-50 text-red-600 border border-red-200";

const roleColors: Record<string, string> = {
  ADMIN:     "bg-purple-50 text-purple-700 border border-purple-200",
  MANAGER:   "bg-blue-50 text-blue-700 border border-blue-200",
  SALES_REP: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  VIEWER:    "bg-slate-50 text-slate-600 border border-slate-200",
};

const avatarGradients = [
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-cyan-500",
  "from-violet-500 to-purple-500",
];

const getGradient = (name: string) =>
  avatarGradients[name.charCodeAt(0) % avatarGradients.length];

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ── Sub-components ────────────────────────────────────────────────────────────
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(59,91,219,0.08)" }}
      >
        <Users size={28} className="text-indigo-500" />
      </div>
      <p className="text-slate-700 font-semibold text-lg">
        {hasFilters ? "No contacts match your filters" : "No contacts yet"}
      </p>
      <p className="text-slate-400 text-sm">
        {hasFilters ? "Try clearing your search or filters" : "Add your first contact to get started"}
      </p>
    </div>
  );
}

function UserCard({ user, onToggle }: { user: CRMUser; onToggle: (id: string) => void }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const primaryRole = user.roles?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md hover:border-indigo-200 transition-all group relative"
    >
      {/* Top row — avatar + name + menu */}
      <div className="flex items-start gap-3">
        {/* Avatar & Name Clickable */}
        <div
          onClick={() => navigate(`/contacts/${user.id}`)}
          className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer group/header"
        >
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br ${getGradient(user.fullName)} shadow-sm transition-transform group-hover/header:scale-105`}
          >
            {initials(user.fullName)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 group-hover/header:text-indigo-600 transition-colors truncate">
              {user.fullName}
            </p>
            {user.designation && (
              <p className="text-xs text-slate-500 truncate">{user.designation}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[0.68rem] font-bold px-2 py-0.5 rounded-full ${statusBadge(user.status)}`}>
                {user.status === "active" ? "Active" : "Inactive"}
              </span>
              {primaryRole && (
                <span className={`text-[0.68rem] font-bold px-2 py-0.5 rounded-full ${roleColors[primaryRole.code] ?? roleColors.VIEWER}`}>
                  {primaryRole.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Context menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            aria-label="User options"
          >
            <MoreVertical size={15} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-9 z-20 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 overflow-hidden"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => { setMenuOpen(false); navigate(`/contacts/${user.id}`); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Eye size={13} /> View Details
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate(`/contacts/${user.id}/edit`); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onToggle(user.id); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                    user.status === "active"
                      ? "text-amber-600 hover:bg-amber-50"
                      : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {user.status === "active" ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info rows */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Mail size={12} className="text-slate-400 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Phone size={12} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{user.phone}</span>
          </div>
        )}
        {user.employeeId && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400 text-[10px] uppercase w-3 text-center">ID</span>
            <span className="truncate">{user.employeeId}</span>
          </div>
        )}
        {user.department && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Briefcase size={12} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{user.department}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ContactsListPage() {
  const navigate = useNavigate();
  const toggleMutation = useToggleUserStatus();

  const [params, setParams] = useState<UserListParams>({
    page: 1, limit: 12, search: "", sortBy: "createdAt", sortDir: "DESC",
  });

  const [rawSearch, setRawSearch] = useState("");
  const debouncedSearch = useDebounce(rawSearch, 400);

  const queryParams: UserListParams = {
    ...params,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useUsers(queryParams);
  const users = data?.data ?? [];
  const hasFilters = !!(rawSearch || params.status);

  const handleToggle = useCallback((id: string) => {
    toggleMutation.mutate(id);
  }, [toggleMutation]);

  const setPage = (p: number) => setParams((prev) => ({ ...prev, page: p }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Contact Directory</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {data?.total ?? 0} contacts in your organisation
          </p>
        </div>
        <button
          id="btn-add-user"
          onClick={() => navigate("/contacts/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
        >
          <UserPlus size={16} />
          Add Contact
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center gap-3 shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="text-slate-400 flex-shrink-0" />
          <input
            id="users-search"
            value={rawSearch}
            onChange={(e) => { setRawSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full"
          />
        </div>

        {/* Status filter */}
        <select
          id="users-status-filter"
          value={params.status ?? ""}
          onChange={(e) => setParams((p) => ({ ...p, page: 1, status: e.target.value || undefined }))}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer focus:border-indigo-300"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select
          id="users-sort"
          value={`${params.sortBy}-${params.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split("-");
            setParams((p) => ({ ...p, sortBy, sortDir: sortDir as "ASC" | "DESC", page: 1 }));
          }}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer focus:border-indigo-300"
        >
          <option value="createdAt-DESC">Newest First</option>
          <option value="createdAt-ASC">Oldest First</option>
          <option value="fullName-ASC">Name A→Z</option>
          <option value="fullName-DESC">Name Z→A</option>
        </select>
      </div>

      {/* Grid / Loading / Empty */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <EmptyState hasFilters={hasFilters} />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((u) => (
              <UserCard key={u.id} user={u} onToggle={handleToggle} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-5 py-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-700">{data.page}</span> of{" "}
            <span className="font-semibold text-slate-700">{data.totalPages}</span>
            {" "}&mdash; {data.total} contacts
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={data.page <= 1}
              onClick={() => setPage(data.page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
              const start = Math.max(1, data.page - 2);
              const pg = start + i;
              if (pg > data.totalPages) return null;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                    pg === data.page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              disabled={data.page >= data.totalPages}
              onClick={() => setPage(data.page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
