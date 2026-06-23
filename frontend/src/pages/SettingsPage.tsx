import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Database, RefreshCw, CheckCircle2, AlertTriangle, Play, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCleanOpen, setConfirmCleanOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/settings/seed-dummy");
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both accounts and contacts query keys to refresh dashboard/lists
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Database successfully seeded with dummy data!");
      setConfirmOpen(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to seed database";
      toast.error(msg);
    },
  });

  const cleanMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/settings/clean-db");
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both accounts and contacts query keys to refresh dashboard/lists
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Database successfully cleared of all test records (except admin)!");
      setConfirmCleanOpen(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to clear database";
      toast.error(msg);
    },
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div>
        <h1 className="text-[1.55rem] font-extrabold text-slate-800 tracking-tight mb-1">
          System Settings
        </h1>
        <p className="text-[0.875rem] text-slate-500 m-0">
          Configure CRM global settings, system modules, and developer tools.
        </p>
      </div>

      {/* ── Settings Sections ── */}
      <div className="flex flex-col gap-5">
        
        {/* Developer / Testing Utilities Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-[38px] h-[38px] rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-[1rem] font-bold text-slate-800 m-0">Developer & Testing Utilities</h2>
              <p className="text-[0.78rem] text-slate-400 m-0">Tools for system testing and evaluation</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* 1. Seed Demo / Dummy Data */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[0.875rem] font-semibold text-slate-800 m-0">
                    Seed Demo / Dummy Data
                  </h3>
                  <p className="text-[0.82rem] text-slate-500 m-0 max-w-xl">
                    Re-populates the database with clean, enterprise-aligned mockup records (Accounts, Contacts, and client KYC documents). 
                    <span className="text-amber-600 font-semibold block mt-1.5">
                      ⚠️ Warning: This will clear all existing KYC records and Accounts, retaining only the Platform Admin account.
                    </span>
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {!confirmOpen ? (
                    <button
                      onClick={() => {
                        setConfirmOpen(true);
                        setConfirmCleanOpen(false);
                      }}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg text-[0.82rem] font-semibold text-white bg-indigo-600 border border-indigo-700 cursor-pointer shadow-sm hover:bg-indigo-700 transition-all"
                    >
                      <Play size={14} />
                      Run Seed Script
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmOpen(false)}
                      className="px-4 py-2.5 rounded-lg text-[0.82rem] font-semibold text-slate-600 bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Confirm Dialog panel inside card */}
              {confirmOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50/60 border border-amber-200 rounded-xl p-4.5 flex flex-col gap-3.5 mt-2"
                >
                  <div className="flex gap-3">
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.82rem] font-bold text-amber-900">Are you absolutely sure?</span>
                      <span className="text-[0.78rem] text-amber-800">
                        This operation runs the CRM dummy seed script. It deletes your current CRM test data and recreates default accounts and contacts. This cannot be undone.
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => setConfirmOpen(false)}
                      disabled={mutation.isPending}
                      className="px-3.5 py-1.5 rounded-md text-[0.78rem] font-semibold text-slate-600 bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all disabled:opacity-60"
                    >
                      No, Cancel
                    </button>
                    <button
                      onClick={() => mutation.mutate()}
                      disabled={mutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[0.78rem] font-semibold text-white bg-amber-600 border border-amber-700 cursor-pointer hover:bg-amber-700 transition-all disabled:opacity-60"
                    >
                      {mutation.isPending ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          Seeding Database...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={13} />
                          Yes, Seed Now
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-slate-100" />

            {/* 2. Clean Database except Admin */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[0.875rem] font-semibold text-slate-800 m-0">
                    Clean Database (Except Admin)
                  </h3>
                  <p className="text-[0.82rem] text-slate-500 m-0 max-w-xl">
                    Clears all CRM records, accounts, contacts, and KYC documents, returning the database to an empty state. Only the primary Platform Admin account is preserved.
                    <span className="text-rose-600 font-semibold block mt-1.5">
                      🚨 Critical: All user-created entries will be permanently removed.
                    </span>
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {!confirmCleanOpen ? (
                    <button
                      onClick={() => {
                        setConfirmCleanOpen(true);
                        setConfirmOpen(false);
                      }}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg text-[0.82rem] font-semibold text-white bg-rose-600 border border-rose-700 cursor-pointer shadow-sm hover:bg-rose-700 transition-all"
                    >
                      <Trash2 size={14} />
                      Clean Database
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmCleanOpen(false)}
                      className="px-4 py-2.5 rounded-lg text-[0.82rem] font-semibold text-slate-600 bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Confirm Dialog panel for clean db */}
              {confirmCleanOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50/60 border border-rose-200 rounded-xl p-4.5 flex flex-col gap-3.5 mt-2"
                >
                  <div className="flex gap-3">
                    <AlertTriangle className="text-rose-600 flex-shrink-0 mt-0.5" size={18} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.82rem] font-bold text-rose-900">Are you absolutely sure?</span>
                      <span className="text-[0.78rem] text-rose-800">
                        This action will completely wipe all CRM accounts, contacts, and KYC records. This process is irreversible.
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => setConfirmCleanOpen(false)}
                      disabled={cleanMutation.isPending}
                      className="px-3.5 py-1.5 rounded-md text-[0.78rem] font-semibold text-slate-600 bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all disabled:opacity-60"
                    >
                      No, Cancel
                    </button>
                    <button
                      onClick={() => cleanMutation.mutate()}
                      disabled={cleanMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[0.78rem] font-semibold text-white bg-rose-600 border border-rose-700 cursor-pointer hover:bg-rose-700 transition-all disabled:opacity-60"
                    >
                      {cleanMutation.isPending ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          Clearing Database...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={13} />
                          Yes, Clear Now
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
