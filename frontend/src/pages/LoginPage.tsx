import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn, Loader2, Building2 } from "lucide-react";
import { authApi } from "@/features/auth/authApi";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/hooks/useAppStore";

const LoginSchema = Yup.object().shape({
  email:    Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function LoginPage() {
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    try {
      const res = await authApi.login(values);
      const { user, tokens } = res.data.data;
      dispatch(setCredentials({ user, token: tokens.accessToken }));
      toast.success(`Welcome back, ${user.fullName}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden px-4">
      {/* Subtle decorative blobs */}
      <div
        className="blob-animate pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #3b5bdb 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-32 w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #845ef7 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "blobFloat 10s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] rounded-2xl p-10 border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
      >
        {/* Logo row */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)",
              boxShadow:  "0 4px 14px rgba(59,91,219,0.35)",
            }}
          >
            <Building2 size={22} color="#fff" />
          </div>
          <div>
            <h1 className="text-[1.1rem] font-bold text-slate-800 tracking-tight leading-tight m-0">
              TechGlora CRM
            </h1>
            <p className="text-[0.7rem] text-slate-400 m-0 tracking-wide">
              Enterprise Relationship Management
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100 mb-6" />

        <h2 className="text-[1.4rem] font-bold text-slate-800 tracking-tight mb-1">
          Sign in to your account
        </h2>
        <p className="text-sm text-slate-400 mb-7">
          Enter your credentials to access the CRM platform
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-4" noValidate>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <Field
                  id="email" name="email" type="email"
                  placeholder="you@example.com" autoComplete="email"
                  className={`w-full px-4 py-[0.65rem] rounded-xl text-[0.9rem] text-slate-700 placeholder-slate-400 bg-white border outline-none transition-all ${
                    errors.email && touched.email
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
                <ErrorMessage name="email">
                  {(msg) => <span className="text-[0.76rem] text-red-500">{msg}</span>}
                </ErrorMessage>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Field
                    id="password" name="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••" autoComplete="current-password"
                    className={`w-full pl-4 pr-10 py-[0.65rem] rounded-xl text-[0.9rem] text-slate-700 placeholder-slate-400 bg-white border outline-none transition-all ${
                      errors.password && touched.password
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <ErrorMessage name="password">
                  {(msg) => <span className="text-[0.76rem] text-red-500">{msg}</span>}
                </ErrorMessage>
              </div>

              {/* Demo hint */}
              <div className="flex items-center flex-wrap gap-1.5 text-[0.76rem] text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span>Demo:</span>
                <code className="bg-slate-200 rounded px-1.5 text-slate-600 font-mono">jaisilan@gmail.com</code>
                <span>/</span>
                <code className="bg-slate-200 rounded px-1.5 text-slate-600 font-mono">jayking46</code>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-1 w-full flex items-center justify-center gap-2 py-[0.8rem] rounded-xl font-semibold text-[0.95rem] text-white border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                style={{
                  background:  "linear-gradient(135deg,#3b5bdb 0%,#845ef7 100%)",
                  boxShadow:   "0 4px 16px rgba(59,91,219,0.3)",
                }}
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="spinner" /> Signing in…</>
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </motion.button>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-6 text-[0.72rem] text-slate-400">
          &copy; {new Date().getFullYear()} TechGlora. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
