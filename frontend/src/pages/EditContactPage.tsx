import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Link as LinkIcon,
  Pencil,
} from "lucide-react";
import { useUser, useUpdateUser } from "@/hooks/useUsers";

// ── Validation ────────────────────────────────────────────────────────────────
const EditUserSchema = Yup.object({
  fullName: Yup.string().required("Full name is required").max(255),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .max(255),
  phone: Yup.string().optional().max(50),
  employeeId: Yup.string().optional().max(50),
  designation: Yup.string().optional().max(255),
  department: Yup.string().optional().max(255),
  timezone: Yup.string().optional().max(100),
  language: Yup.string().optional().max(50),
  location: Yup.string().optional().max(255),
  linkedinUrl: Yup.string()
    .optional()
    .test("valid-url", "Must be a valid URL (include https://)", (v) => {
      if (!v) return true;
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }),
  bio: Yup.string().optional(),
});

// ── Styling helpers ───────────────────────────────────────────────────────────
const inputClass = (hasErr: boolean) =>
  `w-full px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-white border outline-none transition-all ${
    hasErr
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-50"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
  }`;

const labelClass =
  "block text-[0.72rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5";
const reqDot = <span className="text-red-500 ml-0.5">*</span>;

const DEPARTMENTS = [
  "Sales",
  "Pre-Sales",
  "Marketing",
  "Engineering",
  "Finance",
  "HR",
  "Operations",
  "Customer Success",
  "Management",
];

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Dubai",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
];

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Icon size={15} className="text-indigo-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="h-4 w-40 bg-slate-200 rounded mb-6" />
          <div className="grid grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EditContactPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser(id!);
  const updateMutation = useUpdateUser(id!);

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <User size={28} className="text-red-400" />
        </div>
        <p className="text-slate-700 font-semibold text-lg">
          Contact not found
        </p>
        <button
          onClick={() => navigate("/contacts")}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 bg-white"
        >
          Back to Contacts
        </button>
      </div>
    );
  }

  const initialValues = {
    fullName: user.fullName ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    employeeId: user.employeeId ?? "",
    designation: user.designation ?? "",
    department: user.department ?? "",
    timezone: user.timezone ?? "",
    language: user.language ?? "",
    location: user.location ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    bio: user.bio ?? "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (b: boolean) => void },
  ) => {
    try {
      const payload: Record<string, unknown> = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || null,
        employeeId: values.employeeId || null,
        designation: values.designation || null,
        department: values.department || null,
        timezone: values.timezone || null,
        language: values.language || null,
        location: values.location || null,
        linkedinUrl: values.linkedinUrl || null,
        bio: values.bio || null,
      };
      await updateMutation.mutateAsync(payload as any);
      navigate("/contacts");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/contacts")}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all bg-white shadow-sm"
          aria-label="Back"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{
              background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)",
            }}
          >
            <Pencil size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Edit Contact
            </h1>
            <p className="text-xs text-slate-400">
              {user.fullName} &middot; {user.email}
            </p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={EditUserSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, dirty }) => (
          <Form className="flex flex-col gap-5">
            {/* ── Section 1: Personal Information ── */}
            <Section title="Personal Information" icon={User}>
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name {reqDot}
                </label>
                <Field
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className={inputClass(
                    !!errors.fullName && !!touched.fullName,
                  )}
                />
                <ErrorMessage name="fullName">
                  {(msg) => (
                    <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  <Mail size={11} className="inline-block mr-1 -mt-0.5" />
                  Email Address {reqDot}
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane.doe@company.com"
                  className={inputClass(!!errors.email && !!touched.email)}
                />
                <ErrorMessage name="email">
                  {(msg) => (
                    <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              <div>
                <label htmlFor="designation" className={labelClass}>
                  Designation / Title
                </label>
                <Field
                  id="designation"
                  name="designation"
                  placeholder="e.g. Senior Sales Executive"
                  className={inputClass(false)}
                />
              </div>
              <div>
                <label htmlFor="department" className={labelClass}>
                  Department
                </label>
                <Field
                  as="select"
                  id="department"
                  name="department"
                  className={`${inputClass(false)} cursor-pointer`}
                >
                  <option value="">— Select Department —</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Field
                    id="phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    className={`${inputClass(false)} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="employeeId" className={labelClass}>
                  Employee ID
                </label>
                <Field
                  id="employeeId"
                  name="employeeId"
                  placeholder="e.g. EMP-0042"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Location / Office
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Field
                    id="location"
                    name="location"
                    placeholder="e.g. Bangalore, India"
                    className={`${inputClass(false)} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="linkedinUrl" className={labelClass}>
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <LinkIcon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Field
                    id="linkedinUrl"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/janedoe"
                    className={`${inputClass(!!errors.linkedinUrl && !!touched.linkedinUrl)} pl-9`}
                  />
                </div>
                <ErrorMessage name="linkedinUrl">
                  {(msg) => (
                    <p className="mt-1 text-[0.72rem] text-red-500">{msg}</p>
                  )}
                </ErrorMessage>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className={labelClass}>
                  Short Bio
                </label>
                <Field
                  as="textarea"
                  id="bio"
                  name="bio"
                  rows={2}
                  placeholder="Brief description about this contact's role and expertise…"
                  className={`${inputClass(false)} resize-none`}
                />
              </div>
            </Section>

            {/* ── Section 3: Regional Preferences ── */}
            <Section title="Regional Preferences" icon={Globe}>
              <div>
                <label htmlFor="timezone" className={labelClass}>
                  Timezone
                </label>
                <Field
                  as="select"
                  id="timezone"
                  name="timezone"
                  className={`${inputClass(false)} cursor-pointer`}
                >
                  <option value="">— Select Timezone —</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="language" className={labelClass}>
                  Language
                </label>
                <Field
                  id="language"
                  name="language"
                  type="text"
                  list="language-options"
                  placeholder="e.g. English, Spanish"
                  className={inputClass(false)}
                />
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
            </Section>

            {/* Submit bar */}
            <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
              <p className="text-xs text-slate-400">
                {dirty ? (
                  <span className="text-amber-500 font-semibold">
                    ● Unsaved changes
                  </span>
                ) : (
                  "No changes"
                )}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/contacts")}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all bg-white"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !dirty}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)",
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {isSubmitting ? "Saving…" : "Update Contact"}
                </motion.button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
