import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Pencil, Trash2, Globe, FileText, MapPin,
  PhoneCall, Laptop, ShieldAlert, HeartHandshake, ExternalLink,
  User, Clock, AlertTriangle, ShieldCheck
} from "lucide-react";
import { useAccount, useDeleteAccount } from "@/hooks/useAccounts";
import toast from "react-hot-toast";

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

export default function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!id) {
    navigate("/accounts");
    return null;
  }

  const { data: account, isLoading, error } = useAccount(id);
  const deleteMutation = useDeleteAccount();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Account deleted successfully");
      navigate("/accounts");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-[#3b5bdb]" />
        </motion.div>
        <span className="text-sm text-slate-400 font-medium">Fetching account details...</span>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-lg font-bold text-slate-800">Account Not Found</h2>
        <p className="text-sm text-slate-400">The account you are looking for does not exist or has been deleted.</p>
        <button
          onClick={() => navigate("/accounts")}
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          Back to Accounts List
        </button>
      </div>
    );
  }

  // Format revenue / currencies
  const fmtCurrency = (val: any) => {
    if (val === null || val === undefined || val === "") return null;
    const num = Number(val);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
  };

  // Determine color for quality score
  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-500 bg-amber-50 border-amber-200";
    return "text-rose-500 bg-rose-50 border-rose-200";
  };

  const getQualityProgressColor = (score: number) => {
    if (score >= 80) return "#10b981"; // emerald
    if (score >= 50) return "#f59e0b"; // amber
    return "#f43f5e"; // rose
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/accounts")}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white"
              style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
            >
              <Building2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">{account.name}</h1>
                {account.strategicAccount && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <ShieldCheck size={10} />
                    Strategic
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {account.industry || "No Industry"} &bull; {account.accountType || "No Type"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/accounts/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold transition-all shadow-sm"
          >
            <Pencil size={14} />
            Edit Account
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
              <h3 className="font-bold text-slate-800">Delete Account?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{account.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Full fields list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Details */}
          <SectionCard title="Basic Details" icon={Building2}>
            <DetailRow label="Account Name" value={account.name} />
            <DetailRow label="Account Owner" value={account.owner?.fullName} />
            <DetailRow label="Account Type" value={account.accountType} />
            <DetailRow label="Status" value={account.status} />
            <DetailRow label="Category" value={account.category} />
            <DetailRow label="Organization Profile" value={account.organizationProfile} />
            <DetailRow label="Industry" value={account.industry} />
            <DetailRow label="Sub-Industry" value={account.subIndustry} />
            <DetailRow label="Website" value={account.website} isUrl />
            <DetailRow label="LinkedIn Page" value={account.linkedinPage} isUrl />
          </SectionCard>

          {/* Company Profile */}
          <SectionCard title="Company Profile" icon={Globe}>
            <DetailRow label="Year Established" value={account.yearEstablished} />
            <DetailRow label="Employee Size Band" value={account.employeeSize} />
            <DetailRow label="Annual Revenue Band" value={account.annualRevenueRange} />
            <DetailRow label="Market Segment" value={account.marketSegment} />
            <DetailRow label="Exact Employee Count" value={account.employees} />
            <DetailRow label="Number of Offices" value={account.officesCount} />
            <DetailRow label="Global Presence" value={account.globalPresence ? "Yes" : "No"} />
            <DetailRow label="Parent Company" value={account.parentCompany?.name} />
            <div className="sm:col-span-2 py-2.5 border-b border-slate-100 last:border-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Countries of Operation</span>
              {account.countriesOperation && account.countriesOperation.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {account.countriesOperation.map((c: string) => (
                    <span key={c} className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 text-sm italic">—</span>
              )}
            </div>
          </SectionCard>

          {/* Compliance & Financials */}
          <SectionCard title="Compliance & Financials" icon={FileText}>
            <DetailRow label="GSTIN Number" value={account.gstNumber} />
            <DetailRow label="PAN Number" value={account.panNumber} />
            <DetailRow label="CIN Number" value={account.cinNumber} />
            <DetailRow label="Payment Terms" value={account.paymentTerms} />
            <DetailRow label="Credit Limit" value={fmtCurrency(account.creditLimit)} />
            <DetailRow label="Tax Exemption Status" value={account.taxExemptionStatus} />
          </SectionCard>

          {/* Address Information */}
          <SectionCard title="Address Information" icon={MapPin}>
            <div className="sm:col-span-2 py-1 flex flex-col gap-0.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">Head Office Address</h4>
            </div>
            <DetailRow label="Street Address" value={account.billingStreet} />
            <DetailRow label="Street Address 2" value={account.billingStreet2} />
            <DetailRow label="City" value={account.billingCity} />
            <DetailRow label="State/Province" value={account.billingState} />
            <DetailRow label="Country" value={account.billingCountry} />
            <DetailRow label="ZIP/Postal Code" value={account.billingZip} />

            <div className="sm:col-span-2 py-1 flex flex-col gap-0.5 mt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">Shipping / Warehouse Address</h4>
            </div>
            <DetailRow label="Location Name" value={account.shippingLocation} />
            <DetailRow label="Shipping Street" value={account.shippingStreet} />
            <DetailRow label="Shipping City" value={account.shippingCity} />
            <DetailRow label="Shipping Country" value={account.shippingCountry} />
            <div className="sm:col-span-2">
              <DetailRow label="Shipping Phone" value={account.shippingPhone} />
            </div>
          </SectionCard>

          {/* Primary Contact */}
          <SectionCard title="Primary Contact Details" icon={PhoneCall}>
            <DetailRow label="Contact Name" value={account.primaryContactName} />
            <DetailRow label="Designation" value={account.primaryContactDesignation} />
            <DetailRow label="Department" value={account.primaryContactDepartment} />
            <DetailRow label="Contact Email" value={account.primaryContactEmail} />
            <DetailRow label="Contact Mobile" value={account.primaryContactMobile} />
            <DetailRow label="Contact Phone" value={account.primaryContactPhone} />
            <div className="sm:col-span-2">
              <DetailRow label="Contact LinkedIn" value={account.primaryContactLinkedin} isUrl />
            </div>
          </SectionCard>

          {/* Technology Landscape */}
          <SectionCard title="Technology Landscape" icon={Laptop}>
            <DetailRow label="Cloud Provider" value={account.cloudProvider} />
            <DetailRow label="Data Centre Provider" value={account.dataCentreProvider} />
            <DetailRow label="System Integrator" value={account.systemIntegrator} />
            <DetailRow label="Security Partner" value={account.securityPartner} />
            <DetailRow label="Core Tech Platforms" value={account.techPlatforms} />
            <DetailRow label="Digital Initiatives" value={account.digitalInitiatives} />
            <DetailRow label="Existing Contracts" value={account.existingContracts} />
            <DetailRow label="Renewal Dates" value={account.renewalDates} />
          </SectionCard>

          {/* Sales Qualification */}
          <SectionCard title="Sales Qualification" icon={ShieldAlert}>
            <DetailRow label="Lead Source" value={account.leadSource} />
            <DetailRow label="Account Source" value={account.accountSource} />
            <DetailRow label="Referral Partner" value={account.referralPartner} />
            <DetailRow label="Account Priority" value={account.accountPriority} />
            <DetailRow label="Account Tier" value={account.accountTier} />
            <DetailRow label="Strategic Account" value={account.strategicAccount ? "Yes" : "No"} />
            <DetailRow label="Estimated Revenue" value={fmtCurrency(account.estimatedRevenue)} />
            <DetailRow label="Current IT/SaaS Spend" value={fmtCurrency(account.currentSpend)} />
            <div className="sm:col-span-2">
              <DetailRow label="Competitor Landscape Info" value={account.competitorInfo} />
            </div>
            <div className="sm:col-span-2">
              <DetailRow label="Key Business Challenges" value={account.keyChallenges} />
            </div>
            <DetailRow label="Next Action Item" value={account.nextAction} />
            <DetailRow label="Next Follow Up Date" value={account.nextFollowUpDate} />
          </SectionCard>

          {/* Relationship Info */}
          <SectionCard title="Relationship & Opportunity Info" icon={HeartHandshake}>
            <DetailRow label="Existing Customer" value={account.existingCustomer ? "Yes" : "No"} />
            <DetailRow label="Last Purchase Date" value={account.lastPurchaseDate} />
            <DetailRow label="Active Opportunities Count" value={account.activeOpportunities} />
            <DetailRow label="Expected Deal Size" value={fmtCurrency(account.expectedDealSize)} />
            <DetailRow label="Expected Closure Date" value={account.expectedClosureDate} />
            <DetailRow label="Probability of Closure" value={account.probabilityClosure ? `${account.probabilityClosure}%` : "—"} />
            <div className="sm:col-span-2">
              <DetailRow label="Current Products / Services" value={account.currentProducts} />
            </div>
            <div className="sm:col-span-2">
              <DetailRow label="Previous Orders" value={account.previousOrders} />
            </div>
            <div className="sm:col-span-2">
              <DetailRow label="Description / Notes" value={account.description} />
            </div>
          </SectionCard>
        </div>

        {/* Right 1 Column: Metadata & System controls */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6">
          {/* Data Quality Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center gap-4 text-center"
          >
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest self-start pb-2 border-b border-slate-100 w-full text-left">
              Record Completeness
            </h3>
            
            {/* Progress circle */}
            <div className="relative w-28 h-28 flex items-center justify-center mt-2">
              <svg className="absolute w-full h-full -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke={getQualityProgressColor(account.dataQualityScore || 0)}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - (account.dataQualityScore || 0) / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">{account.dataQualityScore || 0}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Health</span>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getQualityColor(account.dataQualityScore || 0)}`}>
              {(account.dataQualityScore || 0) >= 80 ? "Excellent Profile" : (account.dataQualityScore || 0) >= 50 ? "Average Profile" : "Needs Review"}
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed px-2">
              This score indicates how completely this record's fields are filled. Fill more fields to increase the score.
            </p>
          </motion.div>

          {/* Automated System Controls */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4"
          >
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-100">
              Internal CRM Controls
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-xs font-semibold text-slate-400">Region</span>
                <span className="text-xs font-bold text-slate-700">{account.region || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-xs font-semibold text-slate-400">Territory</span>
                <span className="text-xs font-bold text-slate-700">{account.territory || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-xs font-semibold text-slate-400">Business Unit</span>
                <span className="text-xs font-bold text-slate-700">{account.businessUnit || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs font-semibold text-slate-400">Account ID</span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 select-all">
                  {account.id}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Audit Logs / Activity */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4"
          >
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-100">
              Audit Information
            </h3>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 mt-0.5">
                  <User size={13} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Created By</p>
                  <p className="text-[11px] text-slate-500">{account.creator?.fullName || "System"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 mt-0.5">
                  <Clock size={13} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Created At</p>
                  <p className="text-[11px] text-slate-500">{account.createdAt ? new Date(account.createdAt).toLocaleString() : "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3">
                <div className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 mt-0.5">
                  <User size={13} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Modified By</p>
                  <p className="text-[11px] text-slate-500">{account.updater?.fullName || account.creator?.fullName || "System"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-400 mt-0.5">
                  <Clock size={13} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Modified At</p>
                  <p className="text-[11px] text-slate-500">{account.updatedAt ? new Date(account.updatedAt).toLocaleString() : "—"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Simple loader helper fallback
function Loader2({ className, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-loader-2 ${className}`}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
