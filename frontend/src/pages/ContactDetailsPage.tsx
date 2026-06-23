import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Pencil, Globe, User,
  AlertTriangle, Loader2, ToggleLeft, ToggleRight, Clock
} from "lucide-react";
import { useUser, useToggleUserStatus } from "@/hooks/useUsers";

// Helper components for displaying details
function DetailRow({ label, value, isUrl = false }: { label: string; value: any; isUrl?: boolean }) {
  const displayVal = value !== null && value !== undefined && value !== "" ? String(value) : "—";
  const isEmpty = displayVal === "—";

  return (
    <div className="flex flex-col gap-1 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      {isEmpty ? (
        <span className="text-slate-400 text-sm italic">{displayVal}</span>
      ) : isUrl ? (
        <a
          href={displayVal.startsWith("http") ? displayVal : `https://${displayVal}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1.5 transition-colors truncate"
        >
          {displayVal}
        </a>
      ) : (
        <span className="text-slate-700 text-sm font-medium break-words">{displayVal}</span>
      )}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4"
    >
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon size={16} />
        </div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        {children}
      </div>
    </motion.div>
  );
}

const statusBadge = (s: string) =>
  s === "active"
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-red-50 text-red-600 border border-red-200";

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

export default function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toggleMutation = useToggleUserStatus();

  if (!id) {
    navigate("/contacts");
    return null;
  }

  const { data: user, isLoading, error } = useUser(id);

  const handleToggle = async () => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch (err) {
      // toast error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin text-[#3b5bdb]">
          <Loader2 className="w-8 h-8" />
        </div>
        <span className="text-sm text-slate-400 font-medium">Fetching contact details...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-lg font-bold text-slate-800">Contact Record Not Found</h2>
        <p className="text-sm text-slate-400">The contact record you are looking for does not exist or has been deleted.</p>
        <button
          onClick={() => navigate("/contacts")}
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          Back to Contacts List
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/contacts")}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 bg-gradient-to-br ${getGradient(user.fullName)} shadow-sm`}
            >
              {initials(user.fullName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">{user.fullName}</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${statusBadge(user.status)}`}>
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {user.designation || "No Designation"} {user.department ? `• ${user.department}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Status Toggle Action */}
          <button
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all shadow-sm ${
              user.status === "active"
                ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
                : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
            }`}
          >
            {toggleMutation.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : user.status === "active" ? (
              <>
                <ToggleLeft size={15} /> Deactivate
              </>
            ) : (
              <>
                <ToggleRight size={15} /> Activate
              </>
            )}
          </button>

          {/* Edit Contact Button */}
          <button
            onClick={() => navigate(`/contacts/${user.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Pencil size={15} /> Edit Contact
          </button>
        </div>
      </div>

      {/* Main details content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card + Primary Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <SectionCard title="Personal & Professional Information" icon={User}>
            <DetailRow label="Full Name" value={user.fullName} />
            <DetailRow label="Email Address" value={user.email} />
            <DetailRow label="Phone Number" value={user.phone} />
            <DetailRow label="Employee ID" value={user.employeeId} />
            <DetailRow label="Designation / Title" value={user.designation} />
            <DetailRow label="Department" value={user.department} />
            <DetailRow label="Location / Office" value={user.location} />
            <DetailRow label="LinkedIn Profile" value={user.linkedinUrl} isUrl />
            <div className="col-span-1 sm:col-span-2 mt-2">
              <DetailRow label="Short Bio" value={user.bio} />
            </div>
          </SectionCard>
        </div>

        {/* Right Column: Preferences & Metadata */}
        <div className="flex flex-col gap-6">
          {/* Preferences */}
          <SectionCard title="Preferences" icon={Globe}>
            <div className="col-span-1 sm:col-span-2">
              <DetailRow label="Timezone" value={user.timezone} />
              <DetailRow label="Language" value={user.language} />
            </div>
          </SectionCard>

          {/* System metadata */}
          <SectionCard title="System Information" icon={Clock}>
            <div className="col-span-1 sm:col-span-2">
              <DetailRow
                label="Created At"
                value={new Date(user.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
              <DetailRow
                label="Last Updated"
                value={new Date(user.updatedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
