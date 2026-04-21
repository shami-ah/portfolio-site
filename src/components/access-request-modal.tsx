"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REGISTRY_URL = "https://gogaa-registry.wadwarehouse.com";

type FormState = "idle" | "submitting" | "success" | "error";

interface AccessRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium",
  "Bolivia", "Bosnia and Herzegovina", "Brazil", "Brunei", "Bulgaria", "Cambodia",
  "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Georgia",
  "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia",
  "Lebanon", "Libya", "Lithuania", "Luxembourg", "Malaysia", "Maldives", "Malta",
  "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Myanmar",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia",
  "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia",
  "Turkey", "UAE", "Uganda", "Ukraine", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
  "Other",
];

export function AccessRequestModal({ open, onClose }: AccessRequestModalProps): React.ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [organization, setOrganization] = useState("");
  const [reason, setReason] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFormState("idle");
      setErrorMessage("");
      // Focus name field after animation
      setTimeout(() => nameRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isValid =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    country.length > 0 &&
    reason.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!isValid || formState === "submitting") return;

    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`${REGISTRY_URL}/api/access/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          country,
          organization: organization.trim() || undefined,
          reason: reason.trim(),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };

      if (res.ok && data.ok) {
        setFormState("success");
      } else {
        setFormState("error");
        setErrorMessage(data.error ?? data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormState("error");
      setErrorMessage("Could not reach the server. Please check your connection and try again.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-card border border-card-border rounded-2xl shadow-2xl shadow-accent/5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Request Access</h3>
                  <p className="text-xs text-muted mt-1">
                    Gogaa CLI — Private Beta
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-card-hover border border-card-border hover:border-accent/40 transition-all flex items-center justify-center text-muted hover:text-foreground"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="text-base font-semibold mb-2">Request Submitted</h4>
                  <p className="text-sm text-muted leading-relaxed max-w-sm mx-auto">
                    We&apos;ll review your request and send install instructions to your email within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 px-5 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-all"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="ar-name" className="block text-[11px] font-mono text-muted uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      ref={nameRef}
                      id="ar-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      minLength={2}
                      className="w-full px-3 py-2 text-sm bg-background border border-card-border rounded-lg focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all placeholder:text-muted/40"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="ar-email" className="block text-[11px] font-mono text-muted uppercase tracking-wider mb-1.5">
                      Email *
                    </label>
                    <input
                      id="ar-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full px-3 py-2 text-sm bg-background border border-card-border rounded-lg focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all placeholder:text-muted/40"
                    />
                  </div>

                  {/* Country + Organization row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="ar-country" className="block text-[11px] font-mono text-muted uppercase tracking-wider mb-1.5">
                        Country *
                      </label>
                      <select
                        id="ar-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm bg-background border border-card-border rounded-lg focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 10px center",
                        }}
                      >
                        <option value="">Select...</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ar-org" className="block text-[11px] font-mono text-muted uppercase tracking-wider mb-1.5">
                        Company / Org
                        <span className="text-muted/40 normal-case ml-1">(optional)</span>
                      </label>
                      <input
                        id="ar-org"
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Acme Inc."
                        className="w-full px-3 py-2 text-sm bg-background border border-card-border rounded-lg focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all placeholder:text-muted/40"
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label htmlFor="ar-reason" className="block text-[11px] font-mono text-muted uppercase tracking-wider mb-1.5">
                      Why do you want access? *
                    </label>
                    <textarea
                      id="ar-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="I want to try gogaa for... (min 10 characters)"
                      required
                      minLength={10}
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-background border border-card-border rounded-lg focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all placeholder:text-muted/40 resize-none"
                    />
                  </div>

                  {/* Error message */}
                  {formState === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3 py-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!isValid || formState === "submitting"}
                    className="w-full py-2.5 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-accent/20"
                  >
                    {formState === "submitting" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Request Access"
                    )}
                  </button>

                  <p className="text-[10px] text-muted/50 text-center">
                    Your information is only used to process this request.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
