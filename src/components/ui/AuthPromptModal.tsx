"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, LogIn, UserPlus, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";
import { setAuthToken, setAuthUser } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
  onLoginSuccess?: () => void;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  redirectPath,
  onLoginSuccess,
}: AuthPromptModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await authApi.login(form.email, form.password);
        setAuthToken(res.token);
        setAuthUser(res.user);

        // If a callback was provided (e.g. to retry add-to-cart), call it
        if (onLoginSuccess) {
          onLoginSuccess();
        } else if (redirectPath) {
          router.push(redirectPath);
        } else {
          // Reload to refresh auth state
          window.location.reload();
        }
        onClose();
      } else {
        await authApi.register(form.name, form.email, form.password);
        setSuccess("Account created! Please sign in now.");
        setTab("login");
        setForm({ ...form, name: "" });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-charcoal-light border border-parchment/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-parchment/30 hover:text-parchment hover:bg-parchment/5 rounded-lg transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header with icon */}
        <div className="relative px-6 pt-8 pb-5 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rose/5 to-transparent" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-rose/10 border border-rose/20 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={22} className="text-rose" />
            </div>
            <h2 className="font-display text-xl font-bold text-parchment">
              Sign in to continue
            </h2>
            <p className="text-sm text-parchment/45 mt-1.5 max-w-xs mx-auto">
              You need an account to add items to your bag and rent designer
              pieces.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6">
          <div className="flex bg-parchment/5 rounded-lg p-1 mb-5">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2 text-sm rounded transition-colors flex items-center justify-center gap-1.5 ${
                  tab === t
                    ? "bg-parchment text-charcoal font-semibold"
                    : "text-parchment/50 hover:text-parchment"
                }`}
              >
                {t === "login" ? (
                  <>
                    <LogIn size={13} />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus size={13} />
                    Create Account
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 flex flex-col gap-3.5">
          {tab === "register" && (
            <div>
              <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-charcoal border border-parchment/10 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-charcoal border border-parchment/10 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-parchment/50 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full bg-charcoal border border-parchment/10 focus:border-rose/60 text-parchment placeholder-parchment/25 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment/30 hover:text-parchment/60 transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-sage bg-sage/10 border border-sage/20 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <Button
            variant="primary"
            size="md"
            className="w-full mt-1 bg-rose text-charcoal hover:bg-rose-dark font-bold py-3 rounded-xl"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : tab === "login"
              ? "Sign In & Continue"
              : "Create Account"}
          </Button>

          <p className="text-[11px] text-parchment/25 text-center mt-1">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>

      {/* Slide up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
