import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Pencil, Trash2, Globe, FileText,
  ExternalLink, User, Clock, AlertTriangle, Loader2, Users
} from "lucide-react";
import { useContact, useDeleteContact } from "@/hooks/useContacts";

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
          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1.5 transition-colors"
        >
          {displayVal}
          <ExternalLink size={12} />
        </a>
      ) : (
        <span className="text-slate-700 text-sm font-medium">{displayVal}</span>
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

export default function KycDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!id) {
    navigate("/kyc");
    return null;
  }

  const { data: contact, isLoading, error } = useContact(id);
  const deleteMutation = useDeleteContact();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      navigate("/kyc");
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
        <span className="text-sm text-slate-400 font-medium">Fetching KYC details...</span>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-lg font-bold text-slate-800">KYC Record Not Found</h2>
        <p className="text-sm text-slate-400">The KYC record you are looking for does not exist or has been deleted.</p>
        <button
          onClick={() => navigate("/kyc")}
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          Back to KYC List
        </button>
      </div>
    );
  }

  const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();

  // Progress/Score color helpers
  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return "text-slate-400";
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/kyc")}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white"
              style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
            >
              <Users size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">{fullName}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {contact.contactType || "Contact"}
                </span>
                {contact.kycCategory && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {contact.kycCategory}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {contact.designation || "No Designation"} &bull; {contact.account?.name || "No Account"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/kyc/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold transition-all shadow-sm"
          >
            <Pencil size={14} />
            Edit KYC
          </button>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs font-bold transition-all border border-rose-100 shadow-sm"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-xl flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-xl">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Delete KYC Record?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{fullName}</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-all disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete KYC"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Basic Info */}
        <SectionCard title="1 — Basic Contact Information" icon={User}>
          <DetailRow label="Account Name" value={contact.account?.name} />
          <DetailRow label="Contact Type" value={contact.contactType} />
          <DetailRow label="KYC Category" value={contact.kycCategory} />
          <DetailRow label="First Name" value={contact.firstName} />
          <DetailRow label="Last Name" value={contact.lastName} />
          <DetailRow label="Email ID" value={contact.email} />
          <DetailRow label="Mobile Number 1" value={contact.mobileNumber1} />
          <DetailRow label="Mobile Number 2" value={contact.mobileNumber2} />
          <DetailRow label="Landline Number" value={contact.landlineNumber} />
        </SectionCard>

        {/* 2. Professional Info */}
        <SectionCard title="2 — Professional Information" icon={FileText}>
          <DetailRow label="Job Function" value={contact.jobFunction} />
          <DetailRow label="Designation" value={contact.designation} />
          <DetailRow label="Department" value={contact.department} />
          <DetailRow label="Employee Level" value={contact.employeeLevel} />
          <DetailRow label="Employee ID" value={contact.employeeId} />
          <DetailRow
            label="Joining Date"
            value={contact.joiningDate ? new Date(contact.joiningDate).toLocaleDateString() : null}
          />
          <DetailRow label="LinkedIn Profile" value={contact.linkedinProfile} isUrl />
        </SectionCard>

        {/* 3. Buying Influence & Role */}
        <SectionCard title="3 — Buying Influence & Role" icon={Users}>
          <DetailRow label="Decision Authority" value={contact.decisionAuthority} />
          <DetailRow label="Buying Roles" value={Array.isArray(contact.buyingRole) ? contact.buyingRole.join(", ") : contact.buyingRole} />
          <DetailRow
            label="Influencer Score"
            value={contact.influencerScore ? (
              <span className={`font-semibold ${getScoreColor(contact.influencerScore)}`}>
                {contact.influencerScore}/100
              </span>
            ) : null}
          />
          <DetailRow
            label="Relationship Strength"
            value={contact.relationshipStrength ? (
              <span className={`font-semibold ${getScoreColor(contact.relationshipStrength)}`}>
                {contact.relationshipStrength}/100
              </span>
            ) : null}
          />
          <DetailRow label="Budget Ownership" value={contact.budgetOwnership ? "Yes" : "No"} />
          <DetailRow label="Technical Evaluator" value={contact.technicalEvaluator ? "Yes" : "No"} />
        </SectionCard>

        {/* 4. Communication Preferences */}
        <SectionCard title="4 — Communication Preferences" icon={Globe}>
          <DetailRow label="Preferred Communication Mode" value={Array.isArray(contact.preferredCommMode) ? contact.preferredCommMode.join(", ") : contact.preferredCommMode} />
          <DetailRow label="Preferred Contact Time" value={contact.preferredContactTime} />
          <DetailRow label="Time Zone" value={contact.timeZone} />
          <DetailRow label="Language Preference" value={contact.languagePreference} />
          <DetailRow label="Marketing Consent" value={contact.marketingConsent ? "Yes" : "No"} />
          <DetailRow label="Do Not Contact" value={contact.doNotContact ? "Yes" : "No"} />
        </SectionCard>

        {/* 5. Personal Details */}
        <SectionCard title="5 — Personal Details" icon={User}>
          <DetailRow
            label="Date of Birth"
            value={contact.dob ? new Date(contact.dob).toLocaleDateString() : null}
          />
          <DetailRow
            label="Anniversary Date"
            value={contact.anniversaryDate ? new Date(contact.anniversaryDate).toLocaleDateString() : null}
          />
          <DetailRow label="Assistant Name" value={contact.assistantName} />
          <DetailRow label="Assistant Contact" value={contact.assistantContact} />
          <DetailRow label="Personal Interests" value={Array.isArray(contact.personalInterests) ? contact.personalInterests.join(", ") : contact.personalInterests} />
          <div className="sm:col-span-2 mt-2">
            <DetailRow label="Notes" value={contact.notes} />
          </div>
        </SectionCard>

        {/* 6. Manager Structure */}
        <SectionCard title="6 — Manager Reporting Structure" icon={Users}>
          <DetailRow label="Reporting To (Full Name)" value={contact.reportingToText} />
          <DetailRow label="Reporting Function" value={contact.reportingFunction} />
          <DetailRow label="Manager Designation" value={contact.managerDesignation} />
          <DetailRow label="Manager Name" value={contact.managerName} />
          <DetailRow label="Manager Email" value={contact.managerEmail} />
          <DetailRow label="Manager Mobile" value={contact.managerMobile} />
          <DetailRow label="Manager Location" value={contact.managerLocation} />
          <DetailRow label="Manager Function" value={contact.managerFunction} />
        </SectionCard>

        {/* 7. Account Ownership & Engagement */}
        <SectionCard title="7 — Account Ownership & Engagement" icon={Clock}>
          <DetailRow
            label="Account Manager"
            value={contact.accManagerKyc
              ? `${contact.accManagerKyc.firstName} ${contact.accManagerKyc.lastName ?? ""} · ${contact.accManagerKyc.designation}`.trim()
              : contact.accountManager ?? null}
          />
          <DetailRow
            label="Customer Success Manager"
            value={contact.csmKyc
              ? `${contact.csmKyc.firstName} ${contact.csmKyc.lastName ?? ""} · ${contact.csmKyc.designation}`.trim()
              : contact.customerSuccessManager ?? null}
          />
          <DetailRow
            label="Pre-Sales Owner"
            value={contact.preSalesKyc
              ? `${contact.preSalesKyc.firstName} ${contact.preSalesKyc.lastName ?? ""} · ${contact.preSalesKyc.designation}`.trim()
              : contact.preSalesOwner ?? null}
          />
          <DetailRow
            label="Relationship Owner"
            value={contact.relOwnerKyc
              ? `${contact.relOwnerKyc.firstName} ${contact.relOwnerKyc.lastName ?? ""} · ${contact.relOwnerKyc.designation}`.trim()
              : contact.relationshipOwner ?? null}
          />
          {Array.isArray(contact.accountTeam) && contact.accountTeam.length > 0 && (
            <div className="sm:col-span-2 flex flex-col gap-1 py-2.5 border-b border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Account Team</span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {(contact.accountTeam as string[]).map((id, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                    {id.slice(0, 8)}…
                  </span>
                ))}
              </div>
            </div>
          )}
          <DetailRow label="Engagement Frequency" value={contact.engagementFrequency} />
          <DetailRow label="Contact Priority" value={contact.contactPriority} />
          <DetailRow
            label="Last Meeting Date"
            value={contact.lastMeetingDate ? new Date(contact.lastMeetingDate).toLocaleDateString() : null}
          />
          <DetailRow
            label="Next Follow Up Date"
            value={contact.nextFollowUpDate ? new Date(contact.nextFollowUpDate).toLocaleDateString() : null}
          />
          <DetailRow
            label="Last Interaction Date"
            value={contact.lastInteractionDate ? new Date(contact.lastInteractionDate).toLocaleDateString() : null}
          />
          <div className="sm:col-span-2 mt-2">
            <DetailRow label="Last Interaction Notes" value={contact.lastInteractionNotes} />
          </div>
        </SectionCard>

        {/* 8. Scoring & Analytics */}
        <SectionCard title="8 — Scoring & Analytics" icon={Clock}>
          <DetailRow
            label="Relationship Score"
            value={contact.relationshipScore ? (
              <span className={`font-semibold ${getScoreColor(contact.relationshipScore)}`}>
                {contact.relationshipScore}/100
              </span>
            ) : null}
          />
          <DetailRow
            label="Data Quality Score"
            value={contact.dataQualityScore ? (
              <span className={`font-semibold ${getScoreColor(contact.dataQualityScore)}`}>
                {contact.dataQualityScore}/100
              </span>
            ) : null}
          />
          <DetailRow label="Influence Level" value={contact.influenceLevel} />
          <DetailRow label="Decision Making Power" value={contact.decisionMakingPower} />
          <DetailRow label="Customer Sentiment" value={contact.customerSentiment} />
          {/* System-identified fields – read-only badges */}
          <div className="sm:col-span-2 flex flex-col gap-2 pt-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">System Status</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                contact.duplicateContactCheck
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${contact.duplicateContactCheck ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                {contact.duplicateContactCheck ? 'Duplicate Detected' : 'No Duplicate'}
              </span>
              {contact.associationStatus && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-slate-50 text-slate-700 border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {contact.associationStatus}
                </span>
              )}
              <span className="text-[10px] text-slate-400 italic ml-1">Auto-identified by system</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
