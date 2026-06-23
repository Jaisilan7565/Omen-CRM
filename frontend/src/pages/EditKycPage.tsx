import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Save, Loader2, Search } from "lucide-react";
import { useContact, useUpdateContact, useContacts } from "@/hooks/useContacts";
import { useAccounts } from "@/hooks/useAccounts";

// ── Shared style helpers ──────────────────────────────────────────────────────
const inputClass = (hasErr: boolean) =>
  `w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white border outline-none transition-all ${
    hasErr
      ? "border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
  }`;

const labelClass = "block text-[0.72rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5";
const reqDot     = <span className="text-red-500 ml-0.5">*</span>;

// ── Reusable field components ─────────────────────────────────────────────────
function FF({
  name, label, type = "text", placeholder, req, errors, touched, as: Comp, rows, children, ...rest
}: {
  name: string; label: string; type?: string; placeholder?: string; req?: boolean;
  errors: Record<string, string>; touched: Record<string, boolean>;
  as?: string; rows?: number; children?: React.ReactNode; [k: string]: unknown;
}) {
  const hasErr = !!errors[name] && !!touched[name];
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}{req && reqDot}
      </label>
      {Comp === "select" ? (
        <Field as="select" id={name} name={name} className={`${inputClass(hasErr)} cursor-pointer`} {...rest}>
          {children}
        </Field>
      ) : Comp === "textarea" ? (
        <Field
          as="textarea" id={name} name={name} rows={rows ?? 3}
          placeholder={placeholder} className={`${inputClass(hasErr)} resize-none`} {...rest}
        />
      ) : (
        <Field
          id={name} name={name} type={type} placeholder={placeholder}
          className={inputClass(hasErr)} {...rest}
        />
      )}
      <ErrorMessage name={name}>
        {(msg) => <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

function CheckField({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <Field
        type="checkbox" name={name}
        className="w-4 h-4 rounded border-slate-300 text-indigo-600 accent-indigo-500 cursor-pointer"
      />
      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
    </label>
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
      <label htmlFor={name} className={labelClass}>{label} {reqDot}</label>
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClass(!!errors[name] && !!touched[name])} cursor-pointer flex items-center justify-between min-h-[42px] pr-3`}
      >
        {selectedAccount ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
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
            <span className="text-slate-400 text-sm">Select Account</span>
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
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
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

function MultiSelectField({
  name, label, options, errors, touched, setFieldValue, values
}: {
  name: string; label: string; options: string[]; errors: any; touched: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedValues: string[] = Array.isArray(values[name]) ? values[name] : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (opt: string) => {
    let next: string[];
    if (selectedValues.includes(opt)) {
      next = selectedValues.filter((v) => v !== opt);
    } else {
      next = [...selectedValues, opt];
    }
    setFieldValue(name, next);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={labelClass}>{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClass(!!errors[name] && !!touched[name])} cursor-pointer flex items-center justify-between min-h-[42px] pr-3 bg-white`}
      >
        <div className="flex flex-wrap gap-1 items-center">
          {selectedValues.length === 0 ? (
            <span className="text-slate-400 text-sm">Select roles...</span>
          ) : (
            selectedValues.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-indigo-100"
              >
                {v}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleOption(v);
                  }}
                  className="hover:text-indigo-900 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 max-h-60 overflow-y-auto flex flex-col gap-1.5">
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => handleToggleOption(opt)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                  isSelected ? "bg-indigo-50/50 text-indigo-700 font-semibold" : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 accent-indigo-500 cursor-pointer"
                />
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
      )}
      <ErrorMessage name={name}>
        {(msg) => <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

// ── Reports-To lookup ─────────────────────────────────────────────────────────
function ReportsToLookupField({ errors, touched, setFieldValue, values }: { errors: any; touched: any; setFieldValue: (f: string, v: any) => void; values: any }) {
  const [isOpen, setIsOpen]       = useState(false);
  const [inputText, setInputText] = useState(values.reportingToText ?? "");
  const [selectedId, setSelectedId] = useState<string>(values.reportingTo ?? "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setInputText(values.reportingToText ?? ""); setSelectedId(values.reportingTo ?? ""); }, []); // eslint-disable-line
  const { data, isLoading } = useContacts({ search: inputText.trim().length >= 1 ? inputText.trim() : undefined, limit: 50 });
  const contacts = data?.data ?? [];
  useEffect(() => { const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const fill = (c: any) => { const n = [c.firstName, c.lastName].filter(Boolean).join(" "); setSelectedId(c.id); setInputText(n); setIsOpen(false); setFieldValue("reportingTo", c.id); setFieldValue("reportingToText", n); setFieldValue("reportingFunction", c.jobFunction ?? ""); setFieldValue("managerDesignation", c.designation ?? ""); setFieldValue("managerName", n); setFieldValue("managerEmail", c.email ?? ""); setFieldValue("managerMobile", c.mobileNumber1 ?? ""); setFieldValue("managerLocation", ""); setFieldValue("managerFunction", c.jobFunction ?? ""); };
  const clear = () => { setSelectedId(""); setInputText(""); setIsOpen(false); ["reportingTo","reportingToText","reportingFunction","managerDesignation","managerName","managerEmail","managerMobile","managerLocation","managerFunction"].forEach((f) => setFieldValue(f, "")); };
  return (
    <div className="relative col-span-2" ref={dropdownRef}>
      <label className={labelClass}>Reports To (Name)</label>
      <div className="relative">
        <input type="text" value={inputText} onChange={(e) => { const v = e.target.value; setInputText(v); if (selectedId) { setSelectedId(""); setFieldValue("reportingTo", ""); } setFieldValue("reportingToText", v); setIsOpen(true); }} onFocus={() => setIsOpen(true)} placeholder="Search contacts or type a name…" className={`${inputClass(!!errors.reportingToText && !!touched.reportingToText)} pr-16`} />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {!!selectedId && <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full">linked</span>}
          {inputText && <button type="button" onClick={clear} className="p-0.5 hover:bg-slate-100 rounded-full"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
          <Search size={13} className="text-slate-400" />
        </div>
      </div>
      {isOpen && inputText.trim().length >= 1 && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
          {isLoading ? <div className="text-xs text-slate-400 py-3 text-center">Searching…</div> : contacts.length === 0 ? <div className="flex flex-col items-center gap-1.5 py-3"><p className="text-xs text-slate-400">No contacts for "{inputText}"</p><p className="text-[10px] text-slate-400">Name will be saved as free text.</p></div> : contacts.map((c) => { const n = [c.firstName, c.lastName].filter(Boolean).join(" "); return (<div key={c.id} onClick={() => fill(c)} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer ${selectedId === c.id ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold shrink-0">{(c.firstName||"C").charAt(0).toUpperCase()}</div><div className="flex flex-col min-w-0"><span className="font-medium truncate">{n}</span><span className="text-[10px] text-slate-400 truncate">{c.designation} · {c.email}</span></div></div>); })}
        </div>
      )}
    </div>
  );
}

// ── Single-contact lookup ─────────────────────────────────────────────────────
function SingleContactLookupField({ name, label, errors, touched, setFieldValue, values }: { name: string; label: string; errors: any; touched: any; setFieldValue: (f: string, v: any) => void; values: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedId: string = values[name] ?? "";
  const { data, isLoading } = useContacts({ search: search.trim().length >= 1 ? search.trim() : undefined, limit: 50 });
  const contacts = data?.data ?? [];
  const sel = contacts.find((c) => c.id === selectedId);
  useEffect(() => { const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <label className={labelClass}>{label}</label>
      <div onClick={() => setIsOpen(!isOpen)} className={`${inputClass(!!errors[name] && !!touched[name])} cursor-pointer flex items-center justify-between min-h-[42px] pr-3`}>
        {selectedId && sel ? (<div className="flex items-center justify-between w-full"><div className="flex items-center gap-2 min-w-0"><div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">{(sel.firstName||"C").charAt(0).toUpperCase()}</div><span className="text-slate-700 text-sm font-medium truncate">{[sel.firstName,sel.lastName].filter(Boolean).join(" ")}<span className="text-slate-400 font-normal ml-1 text-xs">· {sel.designation}</span></span></div><button type="button" onClick={(e) => { e.stopPropagation(); setFieldValue(name, ""); setSearch(""); }} className="p-1 hover:bg-slate-100 rounded-full shrink-0"><svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
        ) : (<div className="flex items-center justify-between w-full"><span className="text-slate-400 text-sm">Search contacts…</span><Search size={14} className="text-slate-400" /></div>)}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
          <div className="relative mb-1"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} onClick={(e) => e.stopPropagation()} className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400" /></div>
          {isLoading ? <div className="text-xs text-slate-400 py-3 text-center">Searching…</div> : contacts.length === 0 ? <div className="text-xs text-slate-400 py-3 text-center">No contacts found</div> : contacts.map((c) => { const n = [c.firstName,c.lastName].filter(Boolean).join(" "); return (<div key={c.id} onClick={() => { setFieldValue(name, c.id); setIsOpen(false); setSearch(""); }} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer ${selectedId === c.id ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold shrink-0">{(c.firstName||"C").charAt(0).toUpperCase()}</div><div className="flex flex-col min-w-0"><span className="font-medium truncate">{n}</span><span className="text-[10px] text-slate-400 truncate">{c.designation} · {c.email}</span></div></div>); })}
        </div>
      )}
    </div>
  );
}

// ── Multi-contact lookup ──────────────────────────────────────────────────────
function MultiContactLookupField({ name, label, errors, touched, setFieldValue, values }: { name: string; label: string; errors: any; touched: any; setFieldValue: (f: string, v: any) => void; values: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedIds: string[] = Array.isArray(values[name]) ? values[name] : [];
  const { data, isLoading } = useContacts({ search: search.trim().length >= 1 ? search.trim() : undefined, limit: 50 });
  const contacts = data?.data ?? [];
  const [nameMap, setNameMap] = useState<Record<string,string>>({});
  useEffect(() => { const m = { ...nameMap }; contacts.forEach((c) => { m[c.id] = [c.firstName,c.lastName].filter(Boolean).join(" "); }); setNameMap(m); }, [contacts]); // eslint-disable-line
  useEffect(() => { const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const toggle = (id: string) => setFieldValue(name, selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  return (
    <div className="relative" ref={dropdownRef}>
      <label className={labelClass}>{label}</label>
      <div onClick={() => setIsOpen(!isOpen)} className={`${inputClass(!!errors[name] && !!touched[name])} cursor-pointer flex items-center justify-between min-h-[42px] pr-3 bg-white`}>
        <div className="flex flex-wrap gap-1 items-center">{selectedIds.length === 0 ? <span className="text-slate-400 text-sm">Search and add contacts…</span> : selectedIds.map((id) => (<span key={id} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-indigo-100">{nameMap[id] ?? id.slice(0,8)+"…"}<button type="button" onClick={(e) => { e.stopPropagation(); toggle(id); }} className="hover:text-indigo-900">&times;</button></span>))}</div>
        <Search size={14} className="text-slate-400 shrink-0" />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto p-2 flex flex-col gap-1">
          <div className="relative mb-1"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search contacts…" value={search} onChange={(e) => setSearch(e.target.value)} onClick={(e) => e.stopPropagation()} className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400" /></div>
          {isLoading ? <div className="text-xs text-slate-400 py-3 text-center">Searching…</div> : contacts.length === 0 ? <div className="text-xs text-slate-400 py-3 text-center">No contacts found</div> : contacts.map((c) => { const n=[c.firstName,c.lastName].filter(Boolean).join(" "); const isSel=selectedIds.includes(c.id); return (<div key={c.id} onClick={() => toggle(c.id)} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer ${isSel?"bg-indigo-50/50 text-indigo-700 font-semibold":"text-slate-600 hover:bg-slate-50"}`}><input type="checkbox" checked={isSel} readOnly className="w-3.5 h-3.5 rounded border-slate-300 accent-indigo-500 cursor-pointer shrink-0" /><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold shrink-0">{(c.firstName||"C").charAt(0).toUpperCase()}</div><div className="flex flex-col min-w-0"><span className="font-medium truncate">{n}</span><span className="text-[10px] text-slate-400 truncate">{c.designation} · {c.email}</span></div></div>); })}
        </div>
      )}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
      <h3 className="text-[0.72rem] font-bold text-slate-400 uppercase tracking-widest mb-5 pb-3 border-b border-slate-100">
        {title}
      </h3>
      <div className={`grid grid-cols-1 ${full ? "" : "md:grid-cols-2"} gap-5`}>{children}</div>
    </div>
  );
}

function FullRow({ children }: { children: React.ReactNode }) {
  return <div className="md:col-span-2">{children}</div>;
}

// ── Dropdown option lists ─────────────────────────────────────────────────────
const CONTACT_TYPES = [
  "Primary Contact",
  "Decision Maker",
  "Influencer",
  "Technical Contact",
  "Procurement Contact",
  "Finance Contact",
  "End User",
  "Partner Contact"
];
const KYC_CATEGORIES = ["Individual", "Corporate", "Government", "Non-Profit"];
const JOB_FUNCTIONS  = ["Sales", "Pre-Sales", "Technical", "Finance", "Legal", "HR", "Operations", "Marketing", "IT", "Management", "Other"];
const DEPARTMENTS = [
  "IT",
  "Information Security",
  "Infrastructure",
  "Networking",
  "Procurement",
  "Finance",
  "Operations",
  "Administration",
  "HR",
  "Business Unit"
];
const EMP_LEVELS = [
  "CXO",
  "VP",
  "Director",
  "Head",
  "Manager",
  "Individual Contributor"
];
const ENGAGEMENT_FREQ = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "Quarterly"];
const PRIORITIES     = ["Strategic", "High", "Medium", "Low"];
const INFLUENCE_LVLS = ["Very High", "High", "Medium", "Low", "None"];
const SENTIMENTS     = ["Very Positive", "Positive", "Neutral", "Negative", "Very Negative"];
const DMP            = ["Full Authority", "Recommender", "Veto Power", "No Authority"];
const PERSONAL_INTERESTS = [
  "Golf",
  "Tennis",
  "Reading",
  "Travel",
  "Technology",
  "Cooking",
  "Photography",
  "Music",
  "Sports",
  "Fitness"
];
const BUYING_ROLES = [
  "Economic Buyer",
  "Technical Buyer",
  "Decision Maker",
  "Champion",
  "Influencer",
  "End User",
  "Gatekeeper"
];
const COMM_MODES = ["Email", "Mobile", "WhatsApp", "Phone Call", "Video Meeting"];
const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Dubai",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
];

// ── Validation ────────────────────────────────────────────────────────────────
const optStr = () =>
  Yup.string().transform((v) => (v === "" ? null : v)).nullable().optional();

const ContactSchema = Yup.object({
  accountId:    Yup.string().uuid().required("Account is required"),
  contactType:  Yup.string().required("Contact type is required"),
  kycCategory:  Yup.string().required("KYC category is required"),
  firstName:    Yup.string().required("First name is required").max(100),
  email:        Yup.string().email("Invalid email").required("Email is required"),
  mobileNumber1: Yup.string().required("Mobile number is required").max(50),
  jobFunction:  Yup.string().required("Job function is required"),
  designation:  Yup.string().required("Designation is required"),
  lastName:         optStr(),
  mobileNumber2:    optStr(),
  landlineNumber:   optStr(),
  department:       optStr(),
  employeeLevel:    optStr(),
  employeeId:       optStr(),
  joiningDate:      Yup.date().nullable().optional(),
  decisionAuthority: optStr(),
  preferredContactTime: optStr(),
  timeZone:         optStr(),
  languagePreference: optStr(),
  linkedinProfile:  optStr().test("url", "Must be a valid URL", (v) => {
    if (!v) return true;
    try { new URL(v); return true; } catch { return false; }
  }),
  assistantName:    optStr(),
  assistantContact: optStr(),
  notes:            optStr(),
  reportingTo:      Yup.string().uuid().nullable().optional(),
  reportingFunction: optStr(),
  reportingToText:  optStr(),
  managerLocation:  optStr(),
  managerFunction:  optStr(),
  managerDesignation: optStr(),
  managerName:      optStr(),
  managerEmail:     optStr().email("Invalid email"),
  managerMobile:    optStr(),
  engagementFrequency: optStr(),
  lastMeetingDate:  Yup.date().nullable().optional(),
  nextFollowUpDate: Yup.date().nullable().optional(),
  contactPriority:  optStr(),
  lastInteractionDate: Yup.date().nullable().optional(),
  lastInteractionNotes: optStr(),
  influenceLevel:   optStr(),
  decisionMakingPower: optStr(),
  customerSentiment: optStr(),
  associationStatus: optStr(),
  influencerScore:    Yup.number().integer().min(0).max(100).nullable().optional(),
  relationshipStrength: Yup.number().integer().min(0).max(100).nullable().optional(),
  relationshipScore: Yup.number().integer().min(0).max(100).nullable().optional(),
  dataQualityScore:  Yup.number().integer().min(0).max(100).nullable().optional(),
  buyingRole:        Yup.array().of(Yup.string()).optional(),
  preferredCommMode: Yup.array().of(Yup.string()).optional(),
  budgetOwnership:   Yup.boolean().optional(),
  technicalEvaluator: Yup.boolean().optional(),
  marketingConsent:  Yup.boolean().optional(),
  doNotContact:      Yup.boolean().optional(),
  dob:               Yup.date().nullable().optional(),
  anniversaryDate:   Yup.date().nullable().optional(),
  personalInterests: Yup.array().of(Yup.string()).optional(),
  accountManager:         Yup.string().uuid().nullable().optional(),
  customerSuccessManager: Yup.string().uuid().nullable().optional(),
  preSalesOwner:          Yup.string().uuid().nullable().optional(),
  relationshipOwner:      Yup.string().uuid().nullable().optional(),
  accountTeam:            Yup.array().of(Yup.string().uuid()).optional(),
});

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EditKycPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contact, isLoading: isContactLoading, isError } = useContact(id!);
  const updateMutation = useUpdateContact(id!);

  if (isContactLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Loading KYC details...</p>
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-slate-500 font-semibold">KYC record not found</p>
        <button
          onClick={() => navigate("/kyc")}
          className="px-4 py-2 border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
        >
          Back to KYC List
        </button>
      </div>
    );
  }

  const initialValues: Record<string, unknown> = {
    accountId: contact.accountId ?? "",
    contactType: contact.contactType ?? "",
    kycCategory: contact.kycCategory ?? "",
    firstName: contact.firstName ?? "",
    lastName: contact.lastName ?? "",
    email: contact.email ?? "",
    mobileNumber1: contact.mobileNumber1 ?? "",
    mobileNumber2: contact.mobileNumber2 ?? "",
    landlineNumber: contact.landlineNumber ?? "",
    jobFunction: contact.jobFunction ?? "",
    designation: contact.designation ?? "",
    department: contact.department ?? "",
    employeeLevel: contact.employeeLevel ?? "",
    employeeId: contact.employeeId ?? "",
    joiningDate: contact.joiningDate ? new Date(contact.joiningDate).toISOString().split("T")[0] : "",
    decisionAuthority: contact.decisionAuthority ?? "",
    preferredContactTime: contact.preferredContactTime ?? "",
    timeZone: contact.timeZone ?? "",
    languagePreference: contact.languagePreference ?? "",
    linkedinProfile: contact.linkedinProfile ?? "",
    assistantName: contact.assistantName ?? "",
    assistantContact: contact.assistantContact ?? "",
    notes: contact.notes ?? "",
    reportingTo: contact.reportingTo ?? "",
    reportingFunction: contact.reportingFunction ?? "",
    reportingToText: contact.reportingToText ?? "",
    managerLocation: contact.managerLocation ?? "",
    managerFunction: contact.managerFunction ?? "",
    managerDesignation: contact.managerDesignation ?? "",
    managerName: contact.managerName ?? "",
    managerEmail: contact.managerEmail ?? "",
    managerMobile: contact.managerMobile ?? "",
    engagementFrequency: contact.engagementFrequency ?? "",
    lastMeetingDate: contact.lastMeetingDate ? new Date(contact.lastMeetingDate).toISOString().split("T")[0] : "",
    nextFollowUpDate: contact.nextFollowUpDate ? new Date(contact.nextFollowUpDate).toISOString().split("T")[0] : "",
    contactPriority: contact.contactPriority ?? "",
    lastInteractionDate: contact.lastInteractionDate ? new Date(contact.lastInteractionDate).toISOString().split("T")[0] : "",
    lastInteractionNotes: contact.lastInteractionNotes ?? "",
    influenceLevel: contact.influenceLevel ?? "",
    decisionMakingPower: contact.decisionMakingPower ?? "",
    customerSentiment: contact.customerSentiment ?? "",
    associationStatus: contact.associationStatus ?? "",
    influencerScore: contact.influencerScore ?? "",
    relationshipStrength: contact.relationshipStrength ?? "",
    relationshipScore: contact.relationshipScore ?? "",
    dataQualityScore: contact.dataQualityScore ?? "",
    buyingRole: contact.buyingRole ?? [],
    preferredCommMode: contact.preferredCommMode ?? [],
    budgetOwnership: contact.budgetOwnership ?? false,
    technicalEvaluator: contact.technicalEvaluator ?? false,
    marketingConsent: contact.marketingConsent ?? false,
    doNotContact: contact.doNotContact ?? false,
    dob: contact.dob ? new Date(contact.dob).toISOString().split("T")[0] : "",
    anniversaryDate: contact.anniversaryDate ? new Date(contact.anniversaryDate).toISOString().split("T")[0] : "",
    personalInterests: contact.personalInterests ?? [],
    accountManager: contact.accountManager ?? "",
    customerSuccessManager: contact.customerSuccessManager ?? "",
    preSalesOwner: contact.preSalesOwner ?? "",
    relationshipOwner: contact.relationshipOwner ?? "",
    accountTeam: contact.accountTeam ?? [],
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    try {
      const nullify = (v: unknown) => (v === "" || v === undefined ? null : v);
      const numOpt  = (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v));
      const payload = {
        accountId:    values.accountId,
        contactType:  values.contactType,
        kycCategory:  values.kycCategory,
        firstName:    values.firstName,
        lastName:     nullify(values.lastName),
        email:        values.email,
        mobileNumber1: values.mobileNumber1,
        mobileNumber2: nullify(values.mobileNumber2),
        landlineNumber: nullify(values.landlineNumber),
        jobFunction:  values.jobFunction,
        designation:  values.designation,
        department:   nullify(values.department),
        employeeLevel: nullify(values.employeeLevel),
        employeeId:   nullify(values.employeeId),
        joiningDate:  nullify(values.joiningDate),
        decisionAuthority: nullify(values.decisionAuthority),
        preferredContactTime: nullify(values.preferredContactTime),
        timeZone:     nullify(values.timeZone),
        languagePreference: nullify(values.languagePreference),
        linkedinProfile: nullify(values.linkedinProfile),
        assistantName: nullify(values.assistantName),
        assistantContact: nullify(values.assistantContact),
        notes: nullify(values.notes),
        reportingTo: nullify(values.reportingTo) as string | null,
        reportingFunction: nullify(values.reportingFunction),
        reportingToText: nullify(values.reportingToText),
        managerLocation: nullify(values.managerLocation),
        managerFunction: nullify(values.managerFunction),
        managerDesignation: nullify(values.managerDesignation),
        managerName: nullify(values.managerName),
        managerEmail: nullify(values.managerEmail),
        managerMobile: nullify(values.managerMobile),
        engagementFrequency: nullify(values.engagementFrequency),
        lastMeetingDate: nullify(values.lastMeetingDate),
        nextFollowUpDate: nullify(values.nextFollowUpDate),
        contactPriority: nullify(values.contactPriority),
        lastInteractionDate: nullify(values.lastInteractionDate),
        lastInteractionNotes: nullify(values.lastInteractionNotes),
        influenceLevel: nullify(values.influenceLevel),
        decisionMakingPower: nullify(values.decisionMakingPower),
        customerSentiment: nullify(values.customerSentiment),
        associationStatus: nullify(values.associationStatus),
        influencerScore:    numOpt(values.influencerScore),
        relationshipStrength: numOpt(values.relationshipStrength),
        relationshipScore: numOpt(values.relationshipScore),
        dataQualityScore:  numOpt(values.dataQualityScore),
        buyingRole:        values.buyingRole as string[] | null,
        preferredCommMode: values.preferredCommMode as string[] | null,
        budgetOwnership:   values.budgetOwnership as boolean,
        technicalEvaluator: values.technicalEvaluator as boolean,
        marketingConsent:  values.marketingConsent as boolean,
        doNotContact:      values.doNotContact as boolean,
        dob:               nullify(values.dob),
        anniversaryDate:   nullify(values.anniversaryDate),
        personalInterests: values.personalInterests as string[] | null,
        accountManager:         nullify(values.accountManager) as string | null,
        customerSuccessManager: nullify(values.customerSuccessManager) as string | null,
        preSalesOwner:          nullify(values.preSalesOwner) as string | null,
        relationshipOwner:      nullify(values.relationshipOwner) as string | null,
        accountTeam:            (values.accountTeam as string[]).length ? values.accountTeam as string[] : null,
      };
      await updateMutation.mutateAsync(payload as any);
      navigate("/kyc");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/kyc")}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
          >
            <Users size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Edit KYC</h1>
            <p className="text-xs text-slate-400">Update customer KYC and profile information</p>
          </div>
        </div>
      </div>

      <Formik initialValues={initialValues} validationSchema={ContactSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ errors, touched, isSubmitting, setFieldValue, values }) => {
          const E = errors as any;
          const T = touched as any;
          return (
            <Form className="flex flex-col gap-5">
              {/* 1. Basic Contact Information */}
              <Section title="1 — Basic Contact Information">
                <FullRow>
                  <AccountLookupField
                    name="accountId"
                    label="Account Name"
                    errors={E}
                    touched={T}
                    setFieldValue={setFieldValue}
                    initialValue={values.accountId as string}
                  />
                </FullRow>
                <FF name="contactType" label="Contact Type" as="select" req errors={E} touched={T}>
                  <option value="">— Select —</option>
                  {CONTACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </FF>
                <FF name="kycCategory" label="KYC Category" as="select" req errors={E} touched={T}>
                  <option value="">— Select Category —</option>
                  {KYC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </FF>
                <FF name="firstName" label="First Name" req errors={E} touched={T} />
                <FF name="lastName" label="Last Name" errors={E} touched={T} />
                <FF name="email" label="Email ID" type="email" req errors={E} touched={T} />
                <FF name="mobileNumber1" label="Mobile Number 1" req errors={E} touched={T} />
                <FF name="mobileNumber2" label="Mobile Number 2" errors={E} touched={T} />
                <FF name="landlineNumber" label="Landline Number" errors={E} touched={T} />
              </Section>

              {/* 2. Professional Information */}
              <Section title="2 — Professional Information">
                <FF name="jobFunction" label="Job Function" as="select" req errors={E} touched={T}>
                  <option value="">— Select Function —</option>
                  {JOB_FUNCTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </FF>
                <FF name="designation" label="Designation" req errors={E} touched={T} />
                <FF name="department" label="Department" as="select" errors={E} touched={T}>
                  <option value="">— Select Department —</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </FF>
                <FF name="employeeLevel" label="Employee Level" as="select" errors={E} touched={T}>
                  <option value="">— Select Level —</option>
                  {EMP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </FF>
                <FF name="employeeId" label="Employee ID" errors={E} touched={T} />
                <FF name="joiningDate" label="Joining Date" type="date" errors={E} touched={T} />
                <FF name="linkedinProfile" label="LinkedIn Profile" placeholder="https://linkedin.com/..." errors={E} touched={T} />
              </Section>

              {/* 3 · Buying Influence & Role */}
              <Section title="3 — Buying Influence & Role">
                <FF name="decisionAuthority" label="Decision Authority" as="select" errors={E} touched={T}>
                  <option value="">— Select —</option>
                  {DMP.map((d) => <option key={d} value={d}>{d}</option>)}
                </FF>
                <MultiSelectField
                  name="buyingRole"
                  label="Role in Buying Process"
                  options={BUYING_ROLES}
                  errors={E}
                  touched={T}
                  setFieldValue={setFieldValue}
                  values={values}
                />
                <FF name="influencerScore" label="Influencer Score (0-100)" type="number" errors={E} touched={T} />
                <FF name="relationshipStrength" label="Relationship Strength (0-100)" type="number" errors={E} touched={T} />
                <div className="flex flex-col gap-3 pt-1">
                  <CheckField name="budgetOwnership" label="Budget Ownership" />
                  <CheckField name="technicalEvaluator" label="Technical Evaluator" />
                </div>
              </Section>

              {/* 4 · Communication Preferences */}
              <Section title="4 — Communication Preferences">
                <MultiSelectField
                  name="preferredCommMode"
                  label="Preferred Communication Mode"
                  options={COMM_MODES}
                  errors={E}
                  touched={T}
                  setFieldValue={setFieldValue}
                  values={values}
                />
                <FF name="preferredContactTime" label="Preferred Contact Time" placeholder="e.g. Morning, 2 PM - 4 PM" errors={E} touched={T} />
                <FF name="timeZone" label="Time Zone" as="select" errors={E} touched={T}>
                  <option value="">— Select Timezone —</option>
                  {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                </FF>
                <div className="relative">
                  <FF name="languagePreference" label="Language Preference" placeholder="e.g. English, Spanish" list="language-options" errors={E} touched={T} />
                  <datalist id="language-options">
                    <option value="English" />
                    <option value="Hindi" />
                    <option value="Marathi" />
                    <option value="Tamil" />
                    <option value="Arabic" />
                    <option value="German" />
                    <option value="French" />
                    <option value="Spanish" />
                    <option value="Japanese" />
                    <option value="Mandarin" />
                  </datalist>
                </div>
                <div className="flex flex-col gap-3 pt-1">
                  <CheckField name="marketingConsent" label="Marketing Consent" />
                  <CheckField name="doNotContact" label="Do Not Contact" />
                </div>
              </Section>

              {/* 5 · Personal Details */}
              <Section title="5 — Personal Details">
                <FF name="dob" label="Date of Birth" type="date" errors={E} touched={T} />
                <FF name="anniversaryDate" label="Anniversary Date" type="date" errors={E} touched={T} />
                <FF name="assistantName" label="Assistant Name" errors={E} touched={T} />
                <FF name="assistantContact" label="Assistant Contact" errors={E} touched={T} />
                <MultiSelectField
                  name="personalInterests"
                  label="Personal Interests"
                  options={PERSONAL_INTERESTS}
                  errors={E}
                  touched={T}
                  setFieldValue={setFieldValue}
                  values={values}
                />
                <FullRow>
                  <FF name="notes" label="Notes" as="textarea" placeholder="Additional details..." errors={E} touched={T} />
                </FullRow>
              </Section>

              {/* 6 · Reporting Hierarchy */}
              <Section title="6 — Reporting Hierarchy">
                <ReportsToLookupField errors={E} touched={T} setFieldValue={setFieldValue} values={values} />
                {(values.reportingTo as string) && (
                  <div className="col-span-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Manager fields have been auto-populated. You may edit them if needed.
                  </div>
                )}
                <FF name="reportingFunction" label="Reporting Function" placeholder="e.g. Sales" errors={E} touched={T} />
                <FF name="managerDesignation" label="Manager Designation" placeholder="e.g. Director" errors={E} touched={T} />
                <FF name="managerName" label="Manager Name" placeholder="Jane Smith" errors={E} touched={T} />
                <FF name="managerEmail" label="Manager Email" type="email" placeholder="jane@company.com" errors={E} touched={T} />
                <FF name="managerMobile" label="Manager Mobile" placeholder="+91 98000 00003" errors={E} touched={T} />
                <FF name="managerLocation" label="Manager Location" placeholder="e.g. Mumbai" errors={E} touched={T} />
                <FF name="managerFunction" label="Manager Function" placeholder="e.g. Sales" errors={E} touched={T} />
              </Section>

              {/* 7 · Account Ownership & Engagement */}
              <Section title="7 — Account Ownership & Engagement">
                <SingleContactLookupField name="accountManager" label="Account Manager" errors={E} touched={T} setFieldValue={setFieldValue} values={values} />
                <SingleContactLookupField name="customerSuccessManager" label="Customer Success Manager" errors={E} touched={T} setFieldValue={setFieldValue} values={values} />
                <SingleContactLookupField name="preSalesOwner" label="Pre-Sales Owner" errors={E} touched={T} setFieldValue={setFieldValue} values={values} />
                <SingleContactLookupField name="relationshipOwner" label="Relationship Owner" errors={E} touched={T} setFieldValue={setFieldValue} values={values} />
                <FullRow>
                  <MultiContactLookupField name="accountTeam" label="Account Team" errors={E} touched={T} setFieldValue={setFieldValue} values={values} />
                </FullRow>
                <FF name="engagementFrequency" label="Engagement Frequency" as="select" errors={E} touched={T}>
                  <option value="">— Select Frequency —</option>
                  {ENGAGEMENT_FREQ.map((f) => <option key={f} value={f}>{f}</option>)}
                </FF>
                <FF name="contactPriority" label="Contact Priority" as="select" errors={E} touched={T}>
                  <option value="">— Select Priority —</option>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </FF>
                <FF name="lastMeetingDate" label="Last Meeting Date" type="date" errors={E} touched={T} />
                <FF name="nextFollowUpDate" label="Next Follow Up Date" type="date" errors={E} touched={T} />
                <FF name="lastInteractionDate" label="Last Interaction Date" type="date" errors={E} touched={T} />
                <FullRow>
                  <FF name="lastInteractionNotes" label="Last Interaction Notes" as="textarea" placeholder="Interaction details..." errors={E} touched={T} />
                </FullRow>
              </Section>

              {/* 8 · Scoring & Analytics */}
              <Section title="8 — Scoring & Analytics">
                <FF name="relationshipScore" label="Relationship Score (0-100)" type="number" errors={E} touched={T} />
                <FF name="dataQualityScore" label="Data Quality Score (0-100)" type="number" errors={E} touched={T} />
                <FF name="influenceLevel" label="Influence Level" as="select" errors={E} touched={T}>
                  <option value="">— Select Level —</option>
                  {INFLUENCE_LVLS.map((l) => <option key={l} value={l}>{l}</option>)}
                </FF>
                <FF name="decisionMakingPower" label="Decision Making Power" as="select" errors={E} touched={T}>
                  <option value="">— Select Power —</option>
                  {DMP.map((d) => <option key={d} value={d}>{d}</option>)}
                </FF>
                <FF name="customerSentiment" label="Customer Sentiment" as="select" errors={E} touched={T}>
                  <option value="">— Select —</option>
                  {SENTIMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </FF>
                <div className="col-span-2 flex items-start gap-2.5 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                  <svg className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span><strong>Duplicate Contact Check</strong> and <strong>Account Association Status</strong> are automatically identified by the system and shown in the KYC detail view.</span>
                </div>
              </Section>

              {/* Action bar */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/kyc")}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all bg-white shadow-sm"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed shadow-sm transition-all"
                  style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)" }}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSubmitting ? "Saving…" : "Update KYC"}
                </motion.button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
