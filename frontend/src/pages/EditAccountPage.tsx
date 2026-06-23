import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Save, Loader2, Search, Globe, FileText,
  MapPin, PhoneCall, Laptop, ShieldAlert, HeartHandshake
} from "lucide-react";
import { useAccount, useUpdateAccount, useAccounts } from "@/hooks/useAccounts";
import { useUsers } from "@/hooks/useUsers";
import toast from "react-hot-toast";

// Helper — coerces empty string to null so .nullable() + validators work correctly
const optStr = () => Yup.string().transform((v) => (v === "" ? null : v)).nullable().optional();

// ── Validation schema ─────────────────────────────────────────────────────────
const AccountSchema = Yup.object({
  name:               Yup.string().required("Account Name is required").max(255),
  ownerId:            Yup.string().required("Account Owner is required").uuid("Invalid Owner ID format"),
  accountType:        Yup.string().required("Account Type is required").max(100),
  industry:           Yup.string().required("Industry is required").max(100),
  status:             Yup.string().oneOf(["active", "inactive"]).required("Status is required"),
  billingCountry:     Yup.string().required("Head Office Country is required").max(100),
  primaryContactName: Yup.string().required("Primary Contact Name is required").max(255),
  primaryContactEmail:Yup.string().email("Invalid email address").required("Primary Contact Email is required").max(255),
  accountTier:        Yup.string().required("Account Tier is required").max(100),

  // Other optional fields with format/validation
  website:            optStr().test("valid-url", "Must be a valid URL (include https://)", (v) => {
    if (!v) return true;
    try { new URL(v); return true; } catch { return false; }
  }),
  linkedinPage:       optStr().test("valid-url", "Must be a valid URL (include https://)", (v) => {
    if (!v) return true;
    try { new URL(v); return true; } catch { return false; }
  }),
  primaryContactLinkedin: optStr().test("valid-url", "Must be a valid URL (include https://)", (v) => {
    if (!v) return true;
    try { new URL(v); return true; } catch { return false; }
  }),
  yearEstablished:    Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().integer().min(1800).max(new Date().getFullYear() + 1),
  employees:          Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().integer().min(0),
  officesCount:       Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().integer().min(0),
  creditLimit:        Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().min(0),
  estimatedRevenue:   Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().min(0),
  currentSpend:       Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().min(0),
  activeOpportunities: Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().integer().min(0),
  expectedDealSize:   Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().min(0),
  probabilityClosure: Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().integer().min(0).max(100),
});

// ── Dropdown list options ─────────────────────────────────────────────────────
const ACCOUNT_TYPES = ["Prospect", "Customer", "Partner", "Vendor", "System Integrator", "Consultant"];
const INDUSTRIES    = ["IT/ITES", "BFSI", "Healthcare", "Manufacturing", "Government", "Retail", "Education", "Telecommunications", "Other"];
const SEGMENTS      = ["Enterprise", "Mid-Market", "SMB", "Government", "BFSI", "Manufacturing", "Healthcare", "IT/ITES"];
const TIERS         = ["Tier 1 – Strategic Account", "Tier 2 – Large Enterprise", "Tier 3 – Mid Market", "Tier 4 – SMB"];
const EMP_SIZES     = ["< 10", "10-50", "51-200", "201-500", "501-1000", "1000+"];
const REVENUE_RANGES = ["< $1M", "$1M - $10M", "$10M - $50M", "$50M - $100M", "$100M+"];
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt"];
const LEAD_SOURCES  = ["Cold Call", "Website", "Referral", "Partner", "Campaign", "Conference", "Other"];
const PRIORITIES    = ["High", "Medium", "Low"];
const COUNTRIES     = ["United States", "India", "United Kingdom", "Canada", "Australia", "Singapore", "Germany", "France", "Japan", "UAE"];

const inputClass = (hasErr: boolean) =>
  `w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-white border outline-none transition-all ${
    hasErr
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-50"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
  }`;

const labelClass = "block text-[0.72rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

// ── Helper to render mandatory asterisks in red ──────────────────────────────
const renderLabel = (text: string) => {
  if (text.endsWith(" *")) {
    return (
      <>
        {text.slice(0, -2)}
        <span className="text-red-500 ml-0.5">*</span>
      </>
    );
  }
  if (text.endsWith("*")) {
    return (
      <>
        {text.slice(0, -1)}
        <span className="text-red-500 ml-0.5">*</span>
      </>
    );
  }
  return text;
};

function FormField({
  name, label, type = "text", placeholder, errors, touched, ...rest
}: {
  name: string; label: string; type?: string; placeholder?: string;
  errors: any; touched: any;
  [k: string]: unknown;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>{renderLabel(label)}</label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={inputClass(!!errors[name] && !!touched[name])}
        {...rest}
      />
      <ErrorMessage name={name}>
        {(msg) => <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

function SelectField({
  name, label, options, errors, touched, onChange, ...rest
}: {
  name: string; label: string; options: { value: string; label: string }[];
  errors: any; touched: any; onChange?: any;
  [k: string]: unknown;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>{renderLabel(label)}</label>
      <Field
        as="select"
        id={name}
        name={name}
        className={`${inputClass(!!errors[name] && !!touched[name])} cursor-pointer`}
        {...(onChange ? { onChange } : {})}
        {...rest}
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Field>
      <ErrorMessage name={name}>
        {(msg) => <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

function UserLookupField({
  name, label, errors, touched, setFieldValue, initialValue
}: {
  name: string; label: string; errors: any; touched: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  initialValue: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: usersData, isLoading } = useUsers({ limit: 100 });
  const users = usersData?.data ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter((u) =>
    (u.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = users.find((u) => u.id === initialValue);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={name} className={labelClass}>{renderLabel(label)}</label>
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClass(!!errors[name] && !!touched[name])} cursor-pointer flex items-center justify-between min-h-[42px]`}
      >
        {selectedUser ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
              {(selectedUser.fullName || "U").charAt(0).toUpperCase()}
            </div>
            <span className="text-slate-700 text-sm font-medium">
              {selectedUser.fullName} <span className="text-slate-400 font-normal">({selectedUser.email})</span>
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-sm">Select Account Owner</span>
        )}
        <Search size={14} className="text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
          <div className="relative mb-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {isLoading ? (
            <div className="text-xs text-slate-400 py-3 text-center">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-xs text-slate-400 py-3 text-center">No users found</div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => {
                  setFieldValue(name, u.id);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                  initialValue === u.id
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                  {(u.fullName || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{u.fullName}</span>
                  <span className="text-[10px] text-slate-400">{u.email}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <ErrorMessage name={name}>
        {(msg) => <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

function AccountLookupField({
  name, label, errors, touched, setFieldValue, initialValue
}: {
  name: string; label: string; errors: any; touched: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  initialValue: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: accountsData, isLoading } = useAccounts({ limit: 100 });
  const accounts = accountsData?.data ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAccounts = accounts.filter((acc) =>
    (acc.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (acc.industry || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectedAccount = accounts.find((acc) => acc.id === initialValue);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={name} className={labelClass}>{renderLabel(label)}</label>
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClass(!!errors[name] && !!touched[name])} cursor-pointer flex items-center justify-between min-h-[42px] pr-3`}
      >
        {selectedAccount ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-600">
                {(selectedAccount.name || "A").charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-700 text-sm font-medium">
                {selectedAccount.name} {selectedAccount.industry && <span className="text-slate-400 font-normal">({selectedAccount.industry})</span>}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFieldValue(name, "");
                setSearch("");
              }}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              title="Clear selection"
            >
              <svg className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-slate-400 text-sm">Select Parent Company</span>
            <Search size={14} className="text-slate-400" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
          <div className="relative mb-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {initialValue && (
            <div
              onClick={() => {
                setFieldValue(name, "");
                setIsOpen(false);
                setSearch("");
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors text-red-500 hover:bg-red-50 font-medium border border-dashed border-red-100 justify-center"
            >
              Clear Selection
            </div>
          )}

          {isLoading ? (
            <div className="text-xs text-slate-400 py-3 text-center">Loading accounts...</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-xs text-slate-400 py-3 text-center">No accounts found</div>
          ) : (
            filteredAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => {
                  setFieldValue(name, acc.id);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                  initialValue === acc.id
                    ? "bg-violet-50 text-violet-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                  {(acc.name || "A").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{acc.name}</span>
                  {acc.industry && <span className="text-[10px] text-slate-400">{acc.industry}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <ErrorMessage name={name}>
        {(msg) => <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

// ── Sections for form scrolling ───────────────────────────────────────────────
const SECTIONS = [
  { id: "basic", label: "Basic Details", icon: Building2 },
  { id: "company", label: "Company Profile", icon: Globe },
  { id: "financial", label: "Compliance & Financials", icon: FileText },
  { id: "address", label: "Address Information", icon: MapPin },
  { id: "contact", label: "Primary Contact", icon: PhoneCall },
  { id: "tech", label: "Technology Landscape", icon: Laptop },
  { id: "sales", label: "Sales Qualification", icon: ShieldAlert },
  { id: "relationship", label: "Relationship Info", icon: HeartHandshake }
];

export default function EditAccountPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("basic");
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    const observerOptions = {
      root: scrollContainer || null,
      rootMargin: "-10% 0px -50% 0px", // Focus on sections in the top half of the scroll area
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;
      
      // Filter entries that are intersecting
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length > 0) {
        // Sort them so the one closest to the top of the container is first
        const sorted = [...intersecting].sort((a, b) => {
          return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top);
        });
        const sectionId = sorted[0].target.id.replace("sec-", "");
        setActiveTab(sectionId);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(`sec-${sec.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!id) {
    navigate("/accounts");
    return null;
  }

  const { data: account, isLoading: accountLoading } = useAccount(id);
  const updateMutation = useUpdateAccount(id);

  if (accountLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-[#3b5bdb] animate-spin" />
        <span className="text-sm text-slate-400">Loading account details...</span>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <span className="text-sm text-red-500">Account not found.</span>
        <button
          onClick={() => navigate("/accounts")}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm transition-all shadow-sm"
        >
          Back to List
        </button>
      </div>
    );
  }

  const initialValues = {
    name:               account.name || "",
    ownerId:            account.ownerId || "",
    accountType:        account.accountType || "",
    status:             account.status || "active",
    category:           account.category || "",
    organizationProfile:account.organizationProfile || "",
    industry:           account.industry || "",
    subIndustry:        account.subIndustry || "",
    website:            account.website || "",
    linkedinPage:       account.linkedinPage || "",

    // Company Profile
    yearEstablished:    account.yearEstablished !== null ? account.yearEstablished : "",
    employeeSize:       account.employeeSize || "",
    annualRevenueRange: account.annualRevenueRange || "",
    marketSegment:      account.marketSegment || "",
    employees:          account.employees !== null ? account.employees : "",
    officesCount:       account.officesCount !== null ? account.officesCount : "",
    globalPresence:     account.globalPresence === true,
    countriesOperation: account.countriesOperation || [],
    parentCompanyId:    account.parentCompanyId || "",

    // Compliance & Financials
    gstNumber:          account.gstNumber || "",
    panNumber:          account.panNumber || "",
    cinNumber:          account.cinNumber || "",
    paymentTerms:       account.paymentTerms || "",
    creditLimit:        account.creditLimit !== null ? account.creditLimit : "",
    taxExemptionStatus: account.taxExemptionStatus === true,

    // Address Info
    billingStreet:      account.billingStreet || "",
    billingStreet2:     account.billingStreet2 || "",
    billingCity:        account.billingCity || "",
    billingState:       account.billingState || "",
    billingCountry:     account.billingCountry || "",
    billingZip:         account.billingZip || "",
    shippingLocation:   account.shippingLocation || "",
    shippingStreet:     account.shippingStreet || "",
    shippingCity:       account.shippingCity || "",
    shippingCountry:    account.shippingCountry || "",
    shippingPhone:      account.shippingPhone || "",

    // Primary Contact
    primaryContactName:        account.primaryContactName || "",
    primaryContactDesignation: account.primaryContactDesignation || "",
    primaryContactDepartment:  account.primaryContactDepartment || "",
    primaryContactEmail:       account.primaryContactEmail || "",
    primaryContactMobile:      account.primaryContactMobile || "",
    primaryContactPhone:       account.primaryContactPhone || "",
    primaryContactLinkedin:    account.primaryContactLinkedin || "",

    // Technology Landscape
    cloudProvider:      account.cloudProvider || "",
    dataCentreProvider: account.dataCentreProvider || "",
    systemIntegrator:   account.systemIntegrator || "",
    securityPartner:    account.securityPartner || "",
    techPlatforms:      account.techPlatforms || "",
    digitalInitiatives: account.digitalInitiatives || "",
    existingContracts:  account.existingContracts || "",
    renewalDates:       account.renewalDates || "",

    // Sales Qualification
    leadSource:        account.leadSource || "",
    accountSource:     account.accountSource || "",
    referralPartner:   account.referralPartner || "",
    accountPriority:   account.accountPriority || "",
    accountTier:       account.accountTier || "",
    strategicAccount:  account.strategicAccount === true,
    estimatedRevenue:  account.estimatedRevenue !== null ? account.estimatedRevenue : "",
    currentSpend:      account.currentSpend !== null ? account.currentSpend : "",
    competitorInfo:    account.competitorInfo || "",
    keyChallenges:     account.keyChallenges || "",
    nextAction:        account.nextAction || "",
    nextFollowUpDate:  account.nextFollowUpDate || "",

    // Relationship Info
    existingCustomer:    account.existingCustomer === true,
    currentProducts:     account.currentProducts || "",
    previousOrders:      account.previousOrders || "",
    lastPurchaseDate:    account.lastPurchaseDate || "",
    activeOpportunities: account.activeOpportunities !== null ? account.activeOpportunities : "",
    expectedDealSize:    account.expectedDealSize !== null ? account.expectedDealSize : "",
    expectedClosureDate: account.expectedClosureDate || "",
    probabilityClosure:  account.probabilityClosure !== null ? account.probabilityClosure : "",

    description:         account.description || "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    try {
      const payload = {
        ...values,
        yearEstablished: values.yearEstablished ? Number(values.yearEstablished) : null,
        employees:       values.employees       ? Number(values.employees)       : null,
        officesCount:    values.officesCount    ? Number(values.officesCount)    : null,
        creditLimit:     values.creditLimit     ? Number(values.creditLimit)     : null,
        estimatedRevenue:values.estimatedRevenue? Number(values.estimatedRevenue): null,
        currentSpend:    values.currentSpend    ? Number(values.currentSpend)    : null,
        activeOpportunities: values.activeOpportunities ? Number(values.activeOpportunities) : null,
        expectedDealSize:values.expectedDealSize? Number(values.expectedDealSize): null,
        probabilityClosure: values.probabilityClosure ? Number(values.probabilityClosure) : null,
        parentCompanyId: values.parentCompanyId || null,

        // Handle string fallbacks
        website:       values.website       || null,
        linkedinPage:  values.linkedinPage  || null,
        category:      values.category      || null,
        organizationProfile: values.organizationProfile || null,
        subIndustry:   values.subIndustry   || null,
        employeeSize:  values.employeeSize  || null,
        annualRevenueRange: values.annualRevenueRange || null,
        marketSegment: values.marketSegment || null,
        gstNumber:     values.gstNumber     || null,
        panNumber:     values.panNumber     || null,
        cinNumber:     values.cinNumber     || null,
        paymentTerms:  values.paymentTerms  || null,

        // Address Fallbacks
        billingStreet:  values.billingStreet  || null,
        billingStreet2: values.billingStreet2 || null,
        billingCity:    values.billingCity    || null,
        billingState:   values.billingState   || null,
        billingZip:     values.billingZip     || null,
        shippingLocation: values.shippingLocation || null,
        shippingStreet: values.shippingStreet || null,
        shippingCity:   values.shippingCity   || null,
        shippingCountry:values.shippingCountry|| null,
        shippingPhone:  values.shippingPhone  || null,

        // Primary Contact
        primaryContactName:   values.primaryContactName   || null,
        primaryContactDesignation: values.primaryContactDesignation || null,
        primaryContactDepartment:  values.primaryContactDepartment  || null,
        primaryContactEmail:  values.primaryContactEmail  || null,
        primaryContactMobile: values.primaryContactMobile || null,
        primaryContactPhone:  values.primaryContactPhone  || null,
        primaryContactLinkedin: values.primaryContactLinkedin || null,

        // Tech Profile
        cloudProvider:      values.cloudProvider      || null,
        dataCentreProvider: values.dataCentreProvider || null,
        systemIntegrator:   values.systemIntegrator   || null,
        securityPartner:    values.securityPartner    || null,
        techPlatforms:      values.techPlatforms      || null,
        digitalInitiatives: values.digitalInitiatives || null,
        existingContracts:  values.existingContracts  || null,
        renewalDates:       values.renewalDates       || null,

        // Sales intelligence
        leadSource:      values.leadSource      || null,
        accountSource:   values.accountSource   || null,
        referralPartner: values.referralPartner || null,
        accountPriority: values.accountPriority || null,
        competitorInfo:  values.competitorInfo  || null,
        keyChallenges:   values.keyChallenges   || null,
        nextAction:      values.nextAction      || null,
        nextFollowUpDate:values.nextFollowUpDate|| null,

        // Relationship info
        currentProducts:  values.currentProducts  || null,
        previousOrders:   values.previousOrders   || null,
        lastPurchaseDate: values.lastPurchaseDate || null,
        expectedClosureDate: values.expectedClosureDate || null,
      };

      await updateMutation.mutateAsync(payload as any);
      toast.success("Account updated successfully");
      navigate(`/accounts/${id}`);
    } catch (err) {
      toast.error("Failed to update account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/accounts/${id}`)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
          >
            <Building2 size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Edit Account</h1>
            <p className="text-xs text-slate-400">Modify details for {account.name}</p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={AccountSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sticky Left Sidebar Navigation */}
            <div className="w-full md:w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-4 md:sticky md:top-6 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible scrollbar-none shadow-sm">
              {SECTIONS.map((sec) => {
                const SecIcon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      isScrollingRef.current = true;
                      setActiveTab(sec.id);
                      document.getElementById(`sec-${sec.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 800);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap md:w-full ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <SecIcon size={14} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                    {sec.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Form Container */}
            <div className="flex-1 flex flex-col gap-6 w-full max-w-3xl">
              {/* Step 1: Basic Details */}
              <div id="sec-basic" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Basic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField name="name" label="Account Name *" placeholder="e.g. Acme Corporation" errors={errors} touched={touched} />
                  </div>
                  <UserLookupField
                    name="ownerId" label="Account Owner *"
                    errors={errors} touched={touched} setFieldValue={setFieldValue}
                    initialValue={values.ownerId}
                  />
                  <SelectField
                    name="accountType" label="Account Type *"
                    options={ACCOUNT_TYPES.map((t) => ({ value: t, label: t }))}
                    errors={errors} touched={touched}
                  />
                  <SelectField
                    name="status" label="Status *"
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" }
                    ]}
                    errors={errors} touched={touched}
                  />
                  <FormField name="category" label="Category" placeholder="e.g. Technology" errors={errors} touched={touched} />
                  <FormField name="organizationProfile" label="Organization Profile" placeholder="e.g. Private Limited" errors={errors} touched={touched} />
                  <SelectField
                    name="industry" label="Industry *"
                    options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
                    errors={errors} touched={touched}
                  />
                  <FormField name="subIndustry" label="Sub-Industry" placeholder="e.g. Cloud SaaS" errors={errors} touched={touched} />
                  <FormField name="website" label="Website" placeholder="https://example.com" errors={errors} touched={touched} />
                  <FormField name="linkedinPage" label="LinkedIn Page" placeholder="https://linkedin.com/company/example" errors={errors} touched={touched} />
                </div>
              </div>

              {/* Step 2: Company Profile */}
              <div id="sec-company" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Company Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="yearEstablished" type="number" label="Year Established" placeholder="e.g. 2015" errors={errors} touched={touched} />
                  <SelectField
                    name="employeeSize" label="Employee Size Band"
                    options={EMP_SIZES.map((sz) => ({ value: sz, label: sz }))}
                    errors={errors} touched={touched}
                  />
                  <SelectField
                    name="annualRevenueRange" label="Annual Revenue Band"
                    options={REVENUE_RANGES.map((rr) => ({ value: rr, label: rr }))}
                    errors={errors} touched={touched}
                  />
                  <SelectField
                    name="marketSegment" label="Market Segment"
                    options={SEGMENTS.map((seg) => ({ value: seg, label: seg }))}
                    errors={errors} touched={touched}
                  />
                  <FormField name="employees" type="number" label="Exact Employee Count" placeholder="e.g. 450" errors={errors} touched={touched} />
                  <FormField name="officesCount" type="number" label="Number of Offices" placeholder="e.g. 3" errors={errors} touched={touched} />
                  <SelectField
                    name="globalPresence" label="Global Presence"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" }
                    ]}
                    errors={errors} touched={touched}
                    onChange={(e: any) => setFieldValue("globalPresence", e.target.value === "true")}
                  />
                  <AccountLookupField
                    name="parentCompanyId"
                    label="Parent Company"
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    initialValue={values.parentCompanyId}
                  />
                  <div className="md:col-span-2">
                    <label className={labelClass}>Countries of Operation</label>
                    {values.countriesOperation && values.countriesOperation.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
                        {values.countriesOperation.map((ct) => (
                          <span
                            key={ct}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                          >
                            {ct}
                            <button
                              type="button"
                              onClick={() => {
                                setFieldValue(
                                  "countriesOperation",
                                  values.countriesOperation.filter((x) => x !== ct)
                                );
                              }}
                              className="hover:text-indigo-900 focus:outline-none text-[10px]"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                      {COUNTRIES.map((ct) => {
                        const list = values.countriesOperation || [];
                        const isChecked = list.includes(ct);
                        return (
                          <button
                            key={ct}
                            type="button"
                            onClick={() => {
                              const nextList = isChecked
                                ? list.filter((x) => x !== ct)
                                : [...list, ct];
                              setFieldValue("countriesOperation", nextList);
                            }}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                              isChecked
                                ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {ct}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-3 max-w-sm">
                      <input
                        type="text"
                        id="custom-country-input"
                        placeholder="Type custom country..."
                        className={`${inputClass(false)} text-xs !py-2`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val && !values.countriesOperation.includes(val)) {
                              setFieldValue("countriesOperation", [...values.countriesOperation, val]);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("custom-country-input") as HTMLInputElement;
                          const val = input?.value?.trim();
                          if (val && !values.countriesOperation.includes(val)) {
                            setFieldValue("countriesOperation", [...values.countriesOperation, val]);
                            if (input) input.value = "";
                          }
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Compliance & Financials */}
              <div id="sec-financial" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Compliance & Financials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="gstNumber" label="GSTIN Number" placeholder="e.g. 27AAAAA0000A1Z5" errors={errors} touched={touched} />
                  <FormField name="panNumber" label="PAN Number" placeholder="e.g. ABCDE1234F" errors={errors} touched={touched} />
                  <FormField name="cinNumber" label="CIN Number" placeholder="e.g. L27000MH1990PLC058888" errors={errors} touched={touched} />
                  <SelectField
                    name="paymentTerms" label="Payment Terms"
                    options={PAYMENT_TERMS.map((t) => ({ value: t, label: t }))}
                    errors={errors} touched={touched}
                  />
                  <FormField name="creditLimit" type="number" label="Credit Limit ($)" placeholder="e.g. 100000" errors={errors} touched={touched} />
                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="taxExemptionStatus"
                        checked={values.taxExemptionStatus === true}
                        onChange={(e) => setFieldValue("taxExemptionStatus", e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      Tax Exemption Status
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 4: Address Information */}
              <div id="sec-address" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField name="billingStreet" label="Head Office Street" placeholder="Street Address" errors={errors} touched={touched} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField name="billingStreet2" label="Head Office Street 2" placeholder="Suite, Apartment, Unit etc." errors={errors} touched={touched} />
                  </div>
                  <FormField name="billingCity" label="Head Office City" placeholder="City" errors={errors} touched={touched} />
                  <FormField name="billingState" label="Head Office State" placeholder="State/Province" errors={errors} touched={touched} />
                  <FormField name="billingCountry" label="Head Office Country *" placeholder="Country" errors={errors} touched={touched} />
                  <FormField name="billingZip" label="Head Office ZIP/Postal Code" placeholder="ZIP Code" errors={errors} touched={touched} />

                  <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                    <h4 className="text-[0.72rem] font-bold text-slate-500 uppercase tracking-wider mb-4">
                      Shipping / Warehouse Address
                    </h4>
                  </div>
                  <div className="md:col-span-2">
                    <FormField name="shippingLocation" label="Location Name" placeholder="e.g. Warehouse North" errors={errors} touched={touched} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField name="shippingStreet" label="Shipping Street" placeholder="Street Address" errors={errors} touched={touched} />
                  </div>
                  <FormField name="shippingCity" label="Shipping City" placeholder="City" errors={errors} touched={touched} />
                  <FormField name="shippingCountry" label="Shipping Country" placeholder="Country" errors={errors} touched={touched} />
                  <FormField name="shippingPhone" label="Shipping Phone" placeholder="Phone Number" errors={errors} touched={touched} />
                </div>
              </div>

              {/* Step 5: Primary Contact */}
              <div id="sec-contact" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Primary Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="primaryContactName" label="Contact Name *" placeholder="e.g. John Doe" errors={errors} touched={touched} />
                  <FormField name="primaryContactDesignation" label="Designation" placeholder="e.g. Director IT" errors={errors} touched={touched} />
                  <FormField name="primaryContactDepartment" label="Department" placeholder="e.g. Infrastructure" errors={errors} touched={touched} />
                  <FormField name="primaryContactEmail" type="email" label="Contact Email *" placeholder="johndoe@company.com" errors={errors} touched={touched} />
                  <FormField name="primaryContactMobile" label="Contact Mobile" placeholder="Mobile Number" errors={errors} touched={touched} />
                  <FormField name="primaryContactPhone" label="Contact Phone" placeholder="Direct Line" errors={errors} touched={touched} />
                  <FormField name="primaryContactLinkedin" label="Contact LinkedIn" placeholder="LinkedIn URL" errors={errors} touched={touched} />
                </div>
              </div>

              {/* Step 6: Technology Landscape */}
              <div id="sec-tech" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Technology Landscape
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="cloudProvider" label="Cloud Provider" placeholder="e.g. AWS" errors={errors} touched={touched} />
                  <FormField name="dataCentreProvider" label="Data Centre Provider" placeholder="e.g. Equinix" errors={errors} touched={touched} />
                  <FormField name="systemIntegrator" label="System Integrator" placeholder="e.g. Accenture" errors={errors} touched={touched} />
                  <FormField name="securityPartner" label="Security Partner" placeholder="e.g. Palo Alto" errors={errors} touched={touched} />
                  <FormField name="techPlatforms" label="Core Tech Platforms" placeholder="e.g. SAP ERP, Salesforce" errors={errors} touched={touched} />
                  <FormField name="digitalInitiatives" label="Digital Initiatives" placeholder="e.g. Migration to microservices" errors={errors} touched={touched} />
                  <FormField name="existingContracts" label="Existing Contracts Details" placeholder="e.g. Enterprise License" errors={errors} touched={touched} />
                  <FormField name="renewalDates" label="Renewal Date Details" placeholder="e.g. Q4 2026" errors={errors} touched={touched} />
                </div>
              </div>

              {/* Step 7: Sales Qualification */}
              <div id="sec-sales" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Sales Qualification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    name="leadSource" label="Lead Source"
                    options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
                    errors={errors} touched={touched}
                  />
                  <FormField name="accountSource" label="Account Source" placeholder="e.g. Inbound Website" errors={errors} touched={touched} />
                  <FormField name="referralPartner" label="Referral Partner" placeholder="Partner Name" errors={errors} touched={touched} />
                  <SelectField
                    name="accountPriority" label="Account Priority"
                    options={PRIORITIES.map((p) => ({ value: p, label: p }))}
                    errors={errors} touched={touched}
                  />
                  <SelectField
                    name="accountTier" label="Account Tier *"
                    options={TIERS.map((t) => ({ value: t, label: t }))}
                    errors={errors} touched={touched}
                  />
                  <SelectField
                    name="strategicAccount" label="Strategic Account"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" }
                    ]}
                    errors={errors} touched={touched}
                    onChange={(e: any) => setFieldValue("strategicAccount", e.target.value === "true")}
                  />
                  <FormField name="estimatedRevenue" type="number" label="Estimated Account Revenue ($)" placeholder="e.g. 500000" errors={errors} touched={touched} />
                  <FormField name="currentSpend" type="number" label="Current IT/SaaS Spend ($)" placeholder="e.g. 120000" errors={errors} touched={touched} />
                  <div className="md:col-span-2">
                    <FormField name="competitorInfo" label="Competitor Landscape Info" placeholder="Competitors being used..." errors={errors} touched={touched} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField name="keyChallenges" label="Key Business Challenges" placeholder="What are they struggling with?" errors={errors} touched={touched} />
                  </div>
                  <FormField name="nextAction" label="Next Action Item" placeholder="e.g. Schedule discovery call" errors={errors} touched={touched} />
                  <FormField name="nextFollowUpDate" type="date" label="Next Follow Up Date" errors={errors} touched={touched} />
                </div>
              </div>

              {/* Step 8: Relationship Info */}
              <div id="sec-relationship" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                  Relationship & Opportunity Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    name="existingCustomer" label="Existing Customer"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" }
                    ]}
                    errors={errors} touched={touched}
                    onChange={(e: any) => setFieldValue("existingCustomer", e.target.value === "true")}
                  />
                  <FormField name="lastPurchaseDate" type="date" label="Last Purchase Date" errors={errors} touched={touched} />
                  <FormField name="activeOpportunities" type="number" label="Active Opportunities Count" placeholder="e.g. 2" errors={errors} touched={touched} />
                  <FormField name="expectedDealSize" type="number" label="Expected Deal Size ($)" placeholder="e.g. 45000" errors={errors} touched={touched} />
                  <FormField name="expectedClosureDate" type="date" label="Expected Closure Date" errors={errors} touched={touched} />
                  <FormField name="probabilityClosure" type="number" label="Probability of Closure (%)" placeholder="e.g. 75" errors={errors} touched={touched} />
                  <div className="md:col-span-2">
                    <label htmlFor="currentProducts" className={labelClass}>Current Products / Services</label>
                    <Field
                      as="textarea" id="currentProducts" name="currentProducts" rows={2}
                      placeholder="Products or services currently owned..."
                      className={`${inputClass(false)} resize-none`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="previousOrders" className={labelClass}>Previous Orders</label>
                    <Field
                      as="textarea" id="previousOrders" name="previousOrders" rows={2}
                      placeholder="Summary of previous sales or orders..."
                      className={`${inputClass(false)} resize-none`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className={labelClass}>Description / Notes</label>
                    <Field
                      as="textarea" id="description" name="description" rows={3}
                      placeholder="General description or notes about the account..."
                      className={`${inputClass(false)} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 pb-12">
                <button
                  type="button"
                  onClick={() => navigate(`/accounts/${id}`)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 bg-white transition-all shadow-sm"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                  style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSubmitting ? "Saving…" : "Save Changes"}
                </motion.button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
