import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, Search, ChevronLeft, ChevronRight,
  Globe, Phone, Mail, Users, MoreVertical, Trash2, Pencil,
  AlertTriangle,
} from "lucide-react";
import { useAccounts, useDeleteAccount } from "@/hooks/useAccounts";
import type { Account, AccountListParams } from "@/features/accounts/accountsApi";
import { useDebounce } from "@/hooks/useDebounce";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtRevenue = (n: number | null) => {
  if (!n) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

const statusBadge = (s: string) =>
  s === "active"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-red-50 text-red-600 border border-red-200";

// ── sub-components ────────────────────────────────────────────────────────────
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(59,91,219,0.08)" }}
      >
        <Building2 size={28} className="text-[#3b5bdb]" />
      </div>
      <p className="text-slate-700 font-semibold text-lg">
        {hasFilters ? "No accounts match your filters" : "No accounts yet"}
      </p>
      <p className="text-slate-400 text-sm">
        {hasFilters
          ? "Try clearing your search or filters"
          : "Create your first account to get started"}
      </p>
    </div>
  );
}

function AccountCard({
  account,
  onDelete,
}: {
  account: Account;
  onDelete: (id: string, name: string) => void;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="relative rounded-xl border border-slate-200 p-5 cursor-pointer group transition-all hover:border-[#3b5bdb]/50 hover:shadow-md bg-white"
      onClick={() => navigate(`/accounts/${account.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
          >
            {account.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-slate-800 font-semibold text-[0.95rem] truncate">
              {account.name}
            </p>
            <p className="text-slate-400 text-xs truncate">
              {account.industry ?? "No industry"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[0.68rem] font-medium px-2 py-0.5 rounded-full ${statusBadge(account.status)}`}>
            {account.status}
          </span>

          {/* Context menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              <MoreVertical size={15} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 z-20 w-36 rounded-xl border border-slate-200 py-1 shadow-xl bg-white"
                >
                  <button
                    onClick={() => { setMenuOpen(false); navigate(`/accounts/${account.id}/edit`); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(account.id, account.name); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
        {account.phone && (
          <span className="flex items-center gap-1">
            <Phone size={11} /> {account.phone}
          </span>
        )}
        {account.email && (
          <span className="flex items-center gap-1">
            <Mail size={11} className="flex-shrink-0" />
            <span className="truncate max-w-[160px]">{account.email}</span>
          </span>
        )}
        {account.website && (
          <span className="flex items-center gap-1">
            <Globe size={11} /> {account.website.replace(/^https?:\/\//, "")}
          </span>
        )}
      </div>

      {/* Footer stats */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
        {account.employees && (
          <span className="flex items-center gap-1">
            <Users size={11} /> {account.employees.toLocaleString()} employees
          </span>
        )}
        {account.annualRevenue && (
          <span>{fmtRevenue(account.annualRevenue)} ARR</span>
        )}
        {account.billingCity && (
          <span>{[account.billingCity, account.billingCountry].filter(Boolean).join(", ")}</span>
        )}
      </div>
    </motion.div>
  );
}

// ── Delete confirmation modal ──────────────────────────────────────────────────
function DeleteModal({
  name,
  onConfirm,
  onCancel,
  isPending,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ scale: 0.93, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93 }}
        className="w-full max-w-sm rounded-2xl p-6 border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-slate-800 font-semibold">Delete Account</p>
            <p className="text-slate-400 text-xs">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to delete <span className="text-slate-800 font-medium">"{name}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-sm font-medium text-white transition-all"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AccountsListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState<AccountListParams>({
    page: 1, limit: 18, sortBy: "createdAt", sortDir: "DESC",
  });
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const activeParams = { ...params, search: debouncedSearch || undefined };
  const { data, isLoading, isError } = useAccounts(activeParams);
  const deleteMutation = useDeleteAccount();

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = useCallback((id: string, name: string) => {
    setDeleteTarget({ id, name });
  }, []);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const hasFilters = !!debouncedSearch || !!params.status || !!params.industry;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Accounts</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {data ? `${data.total} total accounts` : "Manage your business accounts"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/accounts/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm"
          style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
        >
          <Plus size={16} />
          New Account
        </motion.button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setParams((p) => ({ ...p, page: 1 })); }}
            placeholder="Search accounts…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Status filter */}
        <select
          value={params.status ?? ""}
          onChange={(e) => setParams((p) => ({ ...p, status: e.target.value || undefined, page: 1 }))}
          className="px-3 py-2.5 rounded-xl text-sm text-slate-600 bg-white border border-slate-200 outline-none focus:border-indigo-400 transition-all cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Sort */}
        <select
          value={`${params.sortBy}-${params.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split("-");
            setParams((p) => ({ ...p, sortBy, sortDir: sortDir as "ASC"|"DESC", page: 1 }));
          }}
          className="px-3 py-2.5 rounded-xl text-sm text-slate-600 bg-white border border-slate-200 outline-none focus:border-indigo-400 transition-all cursor-pointer"
        >
          <option value="createdAt-DESC">Newest First</option>
          <option value="createdAt-ASC">Oldest First</option>
          <option value="name-ASC">Name A→Z</option>
          <option value="name-DESC">Name Z→A</option>
          <option value="annualRevenue-DESC">Revenue ↓</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center py-20 gap-2">
          <AlertTriangle size={32} className="text-red-400" />
          <p className="text-slate-400 text-sm">Failed to load accounts. Please try again.</p>
        </div>
      ) : !data?.data?.length ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {data.data.map((acc) => (
                <AccountCard key={acc.id} account={acc} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                Page {data.page} of {data.totalPages} · {data.total} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={data.page <= 1}
                  onClick={() => setParams((p) => ({ ...p, page: p.page! - 1 }))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  disabled={data.page >= data.totalPages}
                  onClick={() => setParams((p) => ({ ...p, page: p.page! + 1 }))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            name={deleteTarget.name}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
            isPending={deleteMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
