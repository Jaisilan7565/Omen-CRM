import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, Save, Loader2, ChevronRight, ChevronLeft,
  Check, User, Globe, FileText, MapPin, PhoneCall,
  Laptop, ShieldAlert, HeartHandshake, Search
} from "lucide-react";
import { useCreateAccount, useAccounts } from "@/hooks/useAccounts";
import { useUsers } from "@/hooks/useUsers";
import { useAppSelector } from "@/hooks/useAppStore";
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
  dataQualityScore:   Yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional().integer().min(0).max(100),
});

// ── Form styling classes ──────────────────────────────────────────────────────
const inputClass = (hasErr: boolean) =>
  `w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-white border outline-none transition-all ${
    hasErr
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-50"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
  }`;

const labelClass = "block text-[0.72rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

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

const stepFields: Record<number, string[]> = {
  0: ["name", "ownerId", "accountType", "status", "category", "organizationProfile", "industry", "subIndustry", "website", "linkedinPage"],
  1: ["yearEstablished", "employeeSize", "annualRevenueRange", "marketSegment", "employees", "officesCount", "globalPresence", "countriesOperation", "parentCompanyId"],
  2: ["gstNumber", "panNumber", "cinNumber", "paymentTerms", "creditLimit", "taxExemptionStatus"],
  3: ["billingStreet", "billingStreet2", "billingCity", "billingState", "billingCountry", "billingZip", "shippingLocation", "shippingStreet", "shippingCity", "shippingCountry", "shippingPhone"],
  4: ["primaryContactName", "primaryContactDesignation", "primaryContactDepartment", "primaryContactEmail", "primaryContactMobile", "primaryContactPhone", "primaryContactLinkedin"],
  5: ["cloudProvider", "dataCentreProvider", "systemIntegrator", "securityPartner", "techPlatforms", "digitalInitiatives", "existingContracts", "renewalDates"],
  6: ["leadSource", "accountSource", "referralPartner", "accountPriority", "accountTier", "strategicAccount", "estimatedRevenue", "currentSpend", "competitorInfo", "keyChallenges", "nextAction", "nextFollowUpDate"],
  7: ["existingCustomer", "currentProducts", "previousOrders", "lastPurchaseDate", "activeOpportunities", "expectedDealSize", "expectedClosureDate", "probabilityClosure", "territory", "region", "businessUnit", "dataQualityScore"]
};

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

// ── Helper Form Components ────────────────────────────────────────────────────
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

  // Fetch users from backend (using a higher limit to get organization members)
  const { data: usersData, isLoading } = useUsers({ limit: 100 });
  const users = usersData?.data ?? [];

  // Close dropdown on click outside
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

  // Fetch accounts from backend
  const { data: accountsData, isLoading } = useAccounts({ limit: 100 });
  const accounts = accountsData?.data ?? [];

  // Close dropdown on click outside
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CreateAccountPage() {
  const navigate = useNavigate();
  const createMutation = useCreateAccount();
  const loggedInUser = useAppSelector((state) => state.auth.user);



  const [currentStep, setCurrentStep] = useState(0);

  const initialValues = {
    name: "",
    ownerId: loggedInUser?.id || "",
    accountType: "",
    status: "active",
    category: "",
    organizationProfile: "",
    industry: "",
    subIndustry: "",
    website: "",
    linkedinPage: "",

    // Company & Business Profile
    yearEstablished: "",
    employeeSize: "",
    annualRevenueRange: "",
    marketSegment: "",
    employees: "",
    officesCount: "",
    globalPresence: false,
    countriesOperation: [] as string[],
    parentCompanyId: "",

    // Financial & Compliance
    gstNumber: "",
    panNumber: "",
    cinNumber: "",
    paymentTerms: "",
    creditLimit: "",
    taxExemptionStatus: false,

    // Address Details
    billingStreet: "",
    billingStreet2: "",
    billingCity: "",
    billingState: "",
    billingCountry: "",
    billingZip: "",

    shippingLocation: "",
    shippingStreet: "",
    shippingCity: "",
    shippingCountry: "",
    shippingPhone: "",

    // Primary Contact
    primaryContactName: "",
    primaryContactDesignation: "",
    primaryContactDepartment: "",
    primaryContactEmail: "",
    primaryContactMobile: "",
    primaryContactPhone: "",
    primaryContactLinkedin: "",

    // Technology Landscape
    cloudProvider: "",
    dataCentreProvider: "",
    systemIntegrator: "",
    securityPartner: "",
    techPlatforms: "",
    digitalInitiatives: "",
    existingContracts: "",
    renewalDates: "",

    // Sales Qualification
    leadSource: "",
    accountSource: "",
    referralPartner: "",
    accountPriority: "",
    accountTier: "",
    strategicAccount: false,
    estimatedRevenue: "",
    currentSpend: "",
    competitorInfo: "",
    keyChallenges: "",
    nextAction: "",
    nextFollowUpDate: "",

    // Relationship Info
    existingCustomer: false,
    currentProducts: "",
    previousOrders: "",
    lastPurchaseDate: "",
    activeOpportunities: "",
    expectedDealSize: "",
    expectedClosureDate: "",
    probabilityClosure: "",

    // Internal CRM Controls
    territory: "",
    region: "",
    businessUnit: "",
    dataQualityScore: "",
  };

  const steps = [
    { id: "basic", label: "Basic Details", icon: User },
    { id: "company", label: "Company Profile", icon: Globe },
    { id: "financial", label: "Compliance & Financials", icon: FileText },
    { id: "address", label: "Address Information", icon: MapPin },
    { id: "contact", label: "Primary Contact", icon: PhoneCall },
    { id: "tech", label: "Technology Landscape", icon: Laptop },
    { id: "sales", label: "Sales Qualification", icon: ShieldAlert },
    { id: "relationship", label: "Relationship Info", icon: HeartHandshake }
  ];

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
        dataQualityScore:values.dataQualityScore? Number(values.dataQualityScore): null,
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
        existingContracts:   values.existingContracts  || null,
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

        // CRM Controls
        territory:    values.territory    || null,
        region:       values.region       || null,
        businessUnit: values.businessUnit || null,
      };

      await createMutation.mutateAsync(payload as any);
      navigate("/accounts");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/accounts")}
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
            <h1 className="text-xl font-bold text-slate-800 tracking-tight font-sans">Create Zoho CRM Account</h1>
            <p className="text-xs text-slate-400">Step-by-step account onboarding wizard</p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={AccountSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting, validateForm, setTouched }) => {
          const handleNextStep = async () => {
            const stepErrs = await validateForm();
            const currentFields = stepFields[currentStep];
            const hasError = currentFields.some((f) => !!stepErrs[f as keyof typeof stepErrs]);

            if (hasError) {
              const touchedFields = currentFields.reduce((acc, f) => {
                acc[f] = true;
                return acc;
              }, {} as Record<string, boolean>);
              setTouched({ ...touched, ...touchedFields });
              toast.error("Please resolve validation errors in the current step.");
            } else {
              setCurrentStep((s) => s + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
            }
          };

          const handleStepSelect = async (stepIdx: number) => {
            if (stepIdx > currentStep) {
              // Validate intermediate steps first
              const stepErrs = await validateForm();
              let canProceed = true;
              for (let i = currentStep; i < stepIdx; i++) {
                const currentFields = stepFields[i];
                const hasError = currentFields.some((f) => !!stepErrs[f as keyof typeof stepErrs]);
                if (hasError) {
                  const touchedFields = currentFields.reduce((acc, f) => {
                    acc[f] = true;
                    return acc;
                  }, {} as Record<string, boolean>);
                  setTouched({ ...touched, ...touchedFields });
                  canProceed = false;
                  break;
                }
              }
              if (!canProceed) {
                toast.error("Please fill in required fields correctly before changing steps.");
                return;
              }
            }
            setCurrentStep(stepIdx);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          };

          return (
            <Form className="flex flex-col gap-6">
              {/* Stepper Navigation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto scrollbar-none">
                <div className="flex items-center justify-between min-w-[800px] gap-2 px-1">
                  {steps.map((st, idx) => {
                    const StepIcon = st.icon;
                    const isActive = currentStep === idx;
                    const isCompleted = currentStep > idx;

                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStepSelect(idx)}
                        className="flex flex-col items-center gap-1.5 flex-1 relative group cursor-pointer focus:outline-none"
                      >
                        {/* Connecting Line */}
                        {idx > 0 && (
                          <div
                            className={`absolute right-[50%] left-[-50%] top-4 h-[2px] -translate-y-1/2 z-0 transition-colors duration-300 ${
                              isCompleted ? "bg-emerald-400" : "bg-slate-100"
                            }`}
                          />
                        )}

                        {/* Step Pill */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all relative z-10 duration-300 ${
                            isActive
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md ring-4 ring-indigo-50"
                              : isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
                          }`}
                        >
                          {isCompleted ? <Check size={14} strokeWidth={3} /> : <StepIcon size={14} />}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-[0.68rem] font-bold tracking-tight whitespace-nowrap transition-colors duration-200 ${
                            isActive ? "text-indigo-600 font-semibold" : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        >
                          {st.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form step area */}
              <div className="min-h-[380px] transition-all">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                      <h2 className="text-base font-bold text-slate-800">
                        {steps[currentStep].label}
                      </h2>
                      <span className="text-xs text-slate-400 font-semibold">
                        Step {currentStep + 1} of 8
                      </span>
                    </div>

                    {/* Step 0: Basic Details */}
                    {currentStep === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <FormField
                            name="name" label="Account Name *" placeholder="Enterprise Acme Ltd"
                            errors={errors} touched={touched}
                          />
                        </div>
                        <UserLookupField
                          name="ownerId"
                          label="Account Owner *"
                          errors={errors}
                          touched={touched}
                          setFieldValue={setFieldValue}
                          initialValue={values.ownerId}
                        />
                        <SelectField
                          name="accountType" label="Account Type *"
                          options={ACCOUNT_TYPES.map((t) => ({ value: t, label: t }))}
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="status" label="Account Status *"
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" }
                          ]}
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="category" label="Category"
                          options={[
                            { value: "Tier A Partner", label: "Tier A Partner" },
                            { value: "Tier B Partner", label: "Tier B Partner" },
                            { value: "Key Client", label: "Key Client" },
                            { value: "General", label: "General" }
                          ]}
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="organizationProfile" label="Organization Profile"
                          options={[
                            { value: "Public", label: "Public" },
                            { value: "Private", label: "Private" },
                            { value: "Government", label: "Government" },
                            { value: "Joint Venture", label: "Joint Venture" },
                            { value: "Sole Proprietorship", label: "Sole Proprietorship" }
                          ]}
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="industry" label="Industry *"
                          options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="subIndustry" label="Sub Industry" placeholder="e.g. Cybersecurity Software"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="website" label="Website" placeholder="https://example.com"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="linkedinPage" label="LinkedIn Company Page" placeholder="https://linkedin.com/company/example"
                          errors={errors} touched={touched}
                        />
                      </div>
                    )}

                    {/* Step 1: Company Profile */}
                    {currentStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          name="yearEstablished" type="number" label="Year Established" placeholder="e.g. 2008"
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="employeeSize" label="Employee Size"
                          options={EMP_SIZES.map((sz) => ({ value: sz, label: sz }))}
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="annualRevenueRange" label="Annual Revenue Range"
                          options={REVENUE_RANGES.map((rev) => ({ value: rev, label: rev }))}
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="marketSegment" label="Market Segment"
                          options={SEGMENTS.map((seg) => ({ value: seg, label: seg }))}
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="employees" type="number" label="Number of Employees" placeholder="e.g. 450"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="officesCount" type="number" label="Number of Offices" placeholder="e.g. 5"
                          errors={errors} touched={touched}
                        />
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
                          
                          {/* Selected countries as tags */}
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

                          {/* Quick Select Grid */}
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

                          {/* Type to Add input */}
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
                    )}

                    {/* Step 2: Compliance & Financial Details */}
                    {currentStep === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          name="gstNumber" label="GST Number" placeholder="e.g. 22AAAAA0000A1Z5"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="panNumber" label="PAN Number" placeholder="e.g. ABCDE1234F"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="cinNumber" label="CIN Number" placeholder="e.g. L01234MH2008PLC123456"
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="paymentTerms" label="Payment Terms"
                          options={PAYMENT_TERMS.map((pt) => ({ value: pt, label: pt }))}
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="creditLimit" type="number" label="Credit Limit ($)" placeholder="e.g. 50000"
                          errors={errors} touched={touched}
                        />
                        <div className="flex items-center gap-3 pt-6">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              name="taxExemptionStatus"
                              checked={values.taxExemptionStatus}
                              onChange={(e) => setFieldValue("taxExemptionStatus", e.target.checked)}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            Tax Exemption Status
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Address Details */}
                    {currentStep === 3 && (
                      <div className="flex flex-col gap-6">
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
                            Head Office Address
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <FormField
                                name="billingStreet" label="Address Line 1" placeholder="Floor 4, Block B"
                                errors={errors} touched={touched}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <FormField
                                name="billingStreet2" label="Address Line 2" placeholder="Tech Park, 100 Main Road"
                                errors={errors} touched={touched}
                              />
                            </div>
                            <FormField
                              name="billingCity" label="City" placeholder="Bangalore"
                              errors={errors} touched={touched}
                            />
                            <FormField
                              name="billingState" label="State / Province" placeholder="Karnataka"
                              errors={errors} touched={touched}
                            />
                            <FormField
                              name="billingCountry" label="Country *" placeholder="India"
                              errors={errors} touched={touched}
                            />
                            <FormField
                              name="billingZip" label="ZIP / PIN Code" placeholder="560001"
                              errors={errors} touched={touched}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4 mt-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Global / Additional Office Address
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                setFieldValue("shippingLocation", "US Branch");
                                setFieldValue("shippingStreet", values.billingStreet);
                                setFieldValue("shippingCity", values.billingCity);
                                setFieldValue("shippingCountry", values.billingCountry);
                              }}
                              className="text-[0.68rem] text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider"
                            >
                              Copy Head Office
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              name="shippingLocation" label="Office Location Name" placeholder="e.g. UK Branch"
                              errors={errors} touched={touched}
                            />
                            <FormField
                              name="shippingPhone" label="Contact Number" placeholder="+1 555 123 4567"
                              errors={errors} touched={touched}
                            />
                            <div className="md:col-span-2">
                              <FormField
                                name="shippingStreet" label="Address" placeholder="22 Baker Street"
                                errors={errors} touched={touched}
                              />
                            </div>
                            <FormField
                              name="shippingCity" label="City" placeholder="London"
                              errors={errors} touched={touched}
                            />
                            <FormField
                              name="shippingCountry" label="Country" placeholder="United Kingdom"
                              errors={errors} touched={touched}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Primary Business Contact */}
                    {currentStep === 4 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          name="primaryContactName" label="Contact Person Name *" placeholder="John Doe"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="primaryContactDesignation" label="Designation *" placeholder="Chief Technology Officer"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="primaryContactDepartment" label="Department" placeholder="e.g. Engineering"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="primaryContactEmail" type="email" label="Email ID *" placeholder="john.doe@example.com"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="primaryContactMobile" label="Mobile Number" placeholder="+1 555 019 2834"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="primaryContactPhone" label="Direct Phone Number" placeholder="+1 555 019 1234"
                          errors={errors} touched={touched}
                        />
                        <div className="md:col-span-2">
                          <FormField
                            name="primaryContactLinkedin" label="LinkedIn Profile URL" placeholder="https://linkedin.com/in/johndoe"
                            errors={errors} touched={touched}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 5: Technology & Digital Profile */}
                    {currentStep === 5 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          name="cloudProvider" label="Existing Cloud Provider" placeholder="AWS / Azure / GCP"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="dataCentreProvider" label="Current Data Centre Provider" placeholder="e.g. Equinix"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="systemIntegrator" label="Existing System Integrator" placeholder="e.g. Accenture"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="securityPartner" label="Current Security Partner" placeholder="e.g. CrowdStrike"
                          errors={errors} touched={touched}
                        />
                        <div className="md:col-span-2">
                          <label htmlFor="techPlatforms" className={labelClass}>Major Technology Platforms</label>
                          <Field
                            as="textarea" id="techPlatforms" name="techPlatforms" rows={2}
                            placeholder="ERP, CRM, Databases, custom software platforms..."
                            className={`${inputClass(false)} resize-none`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="digitalInitiatives" className={labelClass}>Digital Transformation Initiatives</label>
                          <Field
                            as="textarea" id="digitalInitiatives" name="digitalInitiatives" rows={2}
                            placeholder="Migration to cloud, cybersecurity hardening, analytics dashboards..."
                            className={`${inputClass(false)} resize-none`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="existingContracts" className={labelClass}>Existing Contracts</label>
                          <Field
                            as="textarea" id="existingContracts" name="existingContracts" rows={2}
                            placeholder="Details of contracts with other security or IT vendors..."
                            className={`${inputClass(false)} resize-none`}
                          />
                        </div>
                        <FormField
                          name="renewalDates" type="date" label="Renewal Date"
                          errors={errors} touched={touched}
                        />
                      </div>
                    )}

                    {/* Step 6: Sales Intelligence & Qualification */}
                    {currentStep === 6 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField
                          name="leadSource" label="Lead Source"
                          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
                          errors={errors} touched={touched}
                        />
                        <SelectField
                          name="accountSource" label="Account Source"
                          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="referralPartner" label="Referral Partner" placeholder="e.g. Partner Org"
                          errors={errors} touched={touched}
                        />
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
                        <FormField
                          name="estimatedRevenue" type="number" label="Estimated Revenue Potential ($)" placeholder="e.g. 150000"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="currentSpend" type="number" label="Current Spend with Us ($)" placeholder="e.g. 12000"
                          errors={errors} touched={touched}
                        />
                        <div className="md:col-span-2">
                          <label htmlFor="competitorInfo" className={labelClass}>Competitor Information</label>
                          <Field
                            as="textarea" id="competitorInfo" name="competitorInfo" rows={2}
                            placeholder="Competitors currently engaged with this account..."
                            className={`${inputClass(false)} resize-none`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="keyChallenges" className={labelClass}>Key Business Challenges</label>
                          <Field
                            as="textarea" id="keyChallenges" name="keyChallenges" rows={2}
                            placeholder="Major pain points or business constraints..."
                            className={`${inputClass(false)} resize-none`}
                          />
                        </div>
                        <FormField
                          name="nextAction" label="Next Action" placeholder="Schedule security audit demo"
                          errors={errors} touched={touched}
                        />
                        <FormField
                          name="nextFollowUpDate" type="date" label="Next Follow-up Date"
                          errors={errors} touched={touched}
                        />
                      </div>
                    )}

                    {/* Step 7: Relationship & Opportunity Information */}
                    {currentStep === 7 && (
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <SelectField
                            name="existingCustomer" label="Existing Customer"
                            options={[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" }
                            ]}
                            errors={errors} touched={touched}
                            onChange={(e: any) => setFieldValue("existingCustomer", e.target.value === "true")}
                          />
                          <FormField
                            name="lastPurchaseDate" type="date" label="Last Purchase Date"
                            errors={errors} touched={touched}
                          />
                          <FormField
                            name="activeOpportunities" type="number" label="Active Opportunities Count" placeholder="e.g. 2"
                            errors={errors} touched={touched}
                          />
                          <FormField
                            name="expectedDealSize" type="number" label="Expected Deal Size ($)" placeholder="e.g. 45000"
                            errors={errors} touched={touched}
                          />
                          <FormField
                            name="expectedClosureDate" type="date" label="Expected Closure Date"
                            errors={errors} touched={touched}
                          />
                          <FormField
                            name="probabilityClosure" type="number" label="Probability of Closure (%)" placeholder="e.g. 75"
                            errors={errors} touched={touched}
                          />
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
                        </div>


                      </div>
                    )}

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep > 0) {
                            setCurrentStep((s) => s - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 transition-all ${
                          currentStep === 0
                            ? "text-slate-300 bg-slate-50 cursor-not-allowed border-slate-100"
                            : "text-slate-600 hover:text-slate-800 hover:bg-slate-50 bg-white"
                        }`}
                      >
                        <ChevronLeft size={16} />
                        Back
                      </button>

                      {currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md"
                          style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
                        >
                          Next Step
                          <ChevronRight size={16} />
                        </button>
                      ) : (
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-md"
                          style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
                        >
                          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          {isSubmitting ? "Saving…" : "Save Account"}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
