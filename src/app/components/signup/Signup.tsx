import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Server, Eye, EyeOff, UserPlus, X, AlertTriangle,
     CheckCircle, Check } from "lucide-react";
import { api } from "../../hooks/useApi";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function SignupFailedDialog({
  isOpen,
  password,
  existingUser,
  onClose,
}: {
  isOpen: boolean;
  password: string;
  existingUser: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="bg-[#111827] border border-[#EF4444]/35 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: "0 0 48px rgba(239,68,68,0.1), 0 24px 60px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            </div>
            <span className="text-white font-semibold">Signup Failed</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1f2937] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg">
            <p className="text-sm text-[#E5E7EB] leading-relaxed">
              Signup failed. Password{" "}
              <code className="mono text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded text-xs">
                {password || "••••••••"}
              </code>{" "}
              is already used by {" "}
              <span className="text-white font-medium">{existingUser || "unknown"}</span>
              {"."} Please choose a different password.
            </p>
          </div>

          <div className="space-y-2 text-sm text-[#9CA3AF]">
            <p className="text-xs mono text-[#9CA3AF]/60 uppercase tracking-wider mb-2">Suggestions</p>
            {[
              "Append a number or symbol to your password",
              "Use a passphrase instead of a single word",
              "Try a password manager to generate a unique one",
            ].map(s => (
              <div key={s} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 flex-shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1f2937]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#1f2937] hover:bg-[#1a2332] text-white text-sm font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Password strength ── */
function strengthScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-5
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const s = strengthScore(password);
  const label = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"][s];
  const color = ["#EF4444", "#F97316", "#F59E0B", "#84CC16", "#10B981", "#10B981"][s];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < s ? color : "rgba(255,255,255,0.07)" }}
          />
        ))}
      </div>
      <span className="text-xs transition-colors duration-300" style={{ color }}>{label}</span>
    </div>
  );
}

/* ── Signup page ── */
export function Signup() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [failedDialogOpen, setFailedDialogOpen] = useState(false);
  const [existingUserName, setExistingUserName] = useState("unknown");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setError("");
    setLoading(true);

    try {
      const user = await api.signup({ name, email, password });
      setSuccess(true);
      setTimeout(() => {
        localStorage.setItem("auth", "true");
        setCurrentUser({ name, email, role: user.role?.name });
        navigate("/");
      }, 1400);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed.";
      const existingUserMatch = message.match(/Password already used by\s+(.+)/i);

      if (existingUserMatch) {
        const rawName = existingUserMatch[1].trim();
        setExistingUserName(rawName);
        setFailedDialogOpen(true);
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="min-h-screen bg-[#0B0F17] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col w-[420px] bg-[#111827] border-r border-[#1f2937] p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute bottom-[-100px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)" }}
        />

        <div className="flex items-center gap-3 mb-16 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-xl flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white text-lg">DevOps Central</div>
            <div className="text-[10px] text-[#9CA3AF] mono">INFRASTRUCTURE PLATFORM</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Join your team's<br />
            <span className="text-[#38BDF8]">ops hub.</span>
          </h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-10">
            Create your account to start monitoring and managing your infrastructure with your team.
          </p>

          <div className="space-y-3">
            {[
              "Full access to all infrastructure tools",
              "Real-time alerts and incident management",
              "Role-based access control",
              "Audit logs for every action",
              "Security-breach as a Service (SaaS)"
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#10B981]" />
                </div>
                <span className="text-sm text-[#9CA3AF]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <span className="mono text-xs text-[#9CA3AF]/50 border border-[#1f2937] px-3 py-1 rounded-full">
            v2.8.4 · Build 20260901
          </span>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-lg flex items-center justify-center">
              <Server className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">DevOps Central</span>
          </div>

          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
              <p className="text-[#9CA3AF] text-sm">Get access to DevOps Central</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center py-12">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "2px solid #10B981",
                  boxShadow: "0 0 32px rgba(16,185,129,0.25)",
                }}
              >
                <CheckCircle className="w-8 h-8 text-[#10B981]" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Account created!</h2>
              <p className="text-[#9CA3AF] text-sm">Redirecting to dashboard…</p>
              <div className="mt-4 w-8 h-8 border-2 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 mono tracking-wider uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/30 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 mono tracking-wider uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ada@ops.dev"
                  className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/30 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 mono tracking-wider uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 pr-11 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 mono tracking-wider uppercase">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full bg-[#111827] border rounded-lg px-4 py-3 pr-11 text-white text-sm placeholder-[#4B5563] focus:outline-none transition-all ${
                      passwordsMismatch
                        ? "border-[#EF4444]/50 focus:border-[#EF4444]/70 focus:ring-1 focus:ring-[#EF4444]/20"
                        : passwordsMatch
                        ? "border-[#10B981]/50 focus:border-[#10B981]/70 focus:ring-1 focus:ring-[#10B981]/20"
                        : "border-[#1f2937] focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordsMismatch && (
                  <p className="text-xs text-[#EF4444] mt-1">Passwords do not match.</p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-[#10B981] mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              {/* Terms */}
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                By creating an account you agree to our{" "}
                <a href="#" className="text-[#38BDF8] hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-[#38BDF8] hover:underline">Privacy Policy</a>.
              </p>

              {/* Error */}
              {error && (
                <div className="text-xs text-[#EF4444] bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-sm text-[#9CA3AF] mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[#38BDF8] hover:text-[#0EA5E9] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>

      <SignupFailedDialog
        isOpen={failedDialogOpen}
        password={password}
        existingUser={existingUserName}
        onClose={() => setFailedDialogOpen(false)}
      />
    </div>
  );
}