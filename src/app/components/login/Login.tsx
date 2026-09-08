import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Server, Eye, EyeOff, Terminal, Shield, Zap, Lock, X } from "lucide-react";
import { api } from "../../hooks/useApi";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function ForgotPasswordDialog({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.querySelector('script[src*="tenor.com/embed.js"]');
    if (existing) {
      (window as any).TNCR?.reset?.();
      const div = containerRef.current?.querySelector(".tenor-gif-embed");
      if (div && !(div as HTMLElement).querySelector("iframe")) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://tenor.com/embed/24774728";
        iframe.style.cssText = "width:100%;height:100%;border:0;border-radius:8px;";
        iframe.allowFullscreen = true;
        div.innerHTML = "";
        div.appendChild(iframe);
      }
      return;
    }
    const script = document.createElement("script");
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "#111827",
          border: "1px solid rgba(56,189,248,0.2)",
          boxShadow: "0 0 0 1px rgba(56,189,248,0.1), 0 24px 64px rgba(0,0,0,0.9), 0 0 40px rgba(56,189,248,0.08)",
          width: "min(480px, 94vw)",
          animation: "fp-pop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes fp-pop {
            from { opacity: 0; transform: scale(0.88); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937]">
          <div>
            <div className="text-sm font-semibold text-white">Password Recovery</div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GIF */}
        <div className="p-4" style={{ background: "#060a10" }}>
          <div
            className="tenor-gif-embed rounded-lg overflow-hidden"
            data-postid="24774728"
            data-share-method="host"
            data-aspect-ratio="1.77778"
            data-width="100%"
            style={{ minHeight: 240 }}
          >
            <iframe
              src="https://tenor.com/embed/24774728"
              style={{ width: "100%", height: 240, border: 0, borderRadius: 8 }}
              allowFullScreen
              title="Ha Ha"
            />
          </div>
        </div>
        <div className="px-5 py-4 text-center border-t border-[#1f2937]">
          <p className="text-sm text-[#9CA3AF]">
            Forgot your password? <span className="text-[#38BDF8] font-medium">Ha Ha!</span>
          </p>
          <p className="text-xs text-[#6B7280] mt-3 mono">
            Contact your system administrator if you need any support. Or just guess the password.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }

    setError("");
    setLoading(true);

    try {
      const user = await api.login({ email, password });
      localStorage.setItem("auth", "true");
      setCurrentUser({
        name: user.name || "User",
        email: user.email || email,
        role: user.role?.name,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0B0F17] flex"
      style={{ fontFamily: "inherit" }}
    >
      {showForgot && <ForgotPasswordDialog onClose={() => setShowForgot(false)} />}
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col w-[480px] bg-[#111827] border-r border-[#1f2937] p-12 relative overflow-hidden">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Cyan glow */}
        <div
          className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-16 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-xl flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white text-lg">DevOps Central</div>
            <div className="text-[10px] text-[#9CA3AF] mono">INFRASTRUCTURE PLATFORM</div>
          </div>
        </div>

        {/* Feature list */}
        <div className="flex-1 flex flex-col justify-center relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Full-stack infrastructure<br />
              <span className="text-[#38BDF8]">under control.</span>
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Monitor, deploy, and secure your entire infrastructure from a single pane of glass.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Terminal, label: "Real-time system metrics", sub: "CPU, memory, network — live" },
              { icon: Shield,   label: "Security & access control", sub: "Role-based permissions & audit logs" },
              { icon: Zap,      label: "One-click deployments",     sub: "Containers, servers, cloud storage" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{label}</div>
                  <div className="text-xs text-[#9CA3AF] mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version badge */}
        <div className="relative z-10">
          <span className="mono text-xs text-[#9CA3AF]/50 border border-[#1f2937] px-3 py-1 rounded-full">
            v2.8.4 · Build 20260901
          </span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-lg flex items-center justify-center">
              <Server className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">DevOps Central</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-[#9CA3AF] text-sm">Sign in to your infrastructure dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5 mono tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ops.dev"
                className="w-full bg-[#111827] border border-[#1f2937] rounded-lg px-4 py-3 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#38BDF8]/60 focus:ring-1 focus:ring-[#38BDF8]/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#9CA3AF] mono tracking-wider uppercase">
                  Password
                </label>
                <a onClick={() => setShowForgot(true)} className="text-xs text-[#38BDF8] hover:text-[#0EA5E9] transition-colors cursor-pointer">
                  Forgot password?
                </a>
              </div>
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
            </div>

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
              className="w-full flex items-center justify-center gap-2 bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-3">
            {"Don't have an account? "}
            <Link to="/signup" className="text-[#38BDF8] hover:text-[#0EA5E9] font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}