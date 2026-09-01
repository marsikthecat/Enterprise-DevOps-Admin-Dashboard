import { useState, useRef, useEffect, useCallback } from "react";
import { X, CheckCircle2, Skull } from "lucide-react";
import { useAuditLog } from "../../../hooks/useAuditLog";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

const MAX_STABS = 5;
const KNIFE_W = 124;
const KNIFE_H = 36;

const CSS = `
@keyframes kcd-in {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes kcd-shake {
  0%,100% { transform: translate(0,0) rotate(0deg); }
  10% { transform: translate(-6px,-2px) rotate(-1deg); }
  25% { transform: translate(6px, 3px) rotate(1deg); }
  40% { transform: translate(-7px, 1px) rotate(-0.8deg); }
  55% { transform: translate(7px,-3px) rotate(1.1deg); }
  70% { transform: translate(-5px, 3px) rotate(-0.9deg); }
  85% { transform: translate(5px,-2px) rotate(0.8deg); }
}
@keyframes kcd-flash {
  0%,100% { opacity: 0; }
  20% { opacity: 0.6; }
  50% { opacity: 0.3; }
  80% { opacity: 0.5; }
}
@keyframes kcd-knife-in {
  from { opacity: 0; transform: translateX(-50px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes kcd-stab {
  0%   { transform: translateX(0); }
  35%  { transform: translateX(22px); }
  65%  { transform: translateX(14px); }
  100% { transform: translateX(0); }
}
@keyframes kcd-stab-indicator {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); }
  100% { transform: scale(1); }
}
@keyframes kcd-success-in {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes kcd-scanlines {
  0%   { background-position: 0 0; }
  100% { background-position: 0 8px; }
}
@keyframes kcd-fire {
  0%,100% { transform: scaleY(1) scaleX(1); opacity: 0.7; }
  33%  { transform: scaleY(1.15) scaleX(0.95); opacity: 0.9; }
  66%  { transform: scaleY(0.9) scaleX(1.05); opacity: 0.75; }
}
@keyframes kcd-explosion {
  0%   { transform: scale(0.5); opacity: 1; }
  60%  { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0; }
}
@keyframes kcd-smoke {
  0%   { transform: translateY(0) scaleX(1); opacity: 0.5; }
  100% { transform: translateY(-30px) scaleX(1.4); opacity: 0; }
}
`;

/* ─── Knife SVG ─── */
function KnifeSVG({ stabbing }: { stabbing: boolean }) {
  return (
    <svg
      width={KNIFE_W} height={KNIFE_H}
      viewBox={`0 0 ${KNIFE_W} ${KNIFE_H}`}
      style={{ display: "block", filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.8))" }}
    >
      {/* Handle wrap */}
      <rect x="0" y="12" width="36" height="12" rx="4" fill="#2a1a10" />
      {[4, 11, 18, 25].map(x => (
        <rect key={x} x={x} y="12" width="3" height="12" rx="1" fill="rgba(0,0,0,0.45)" />
      ))}
      {/* Rivets */}
      {[8, 20, 30].map(cx => (
        <circle key={cx} cx={cx} cy="18" r="2.2" fill="#6b4530" />
      ))}
      {/* Guard */}
      <rect x="35" y="5" width="7" height="26" rx="2.5" fill="#7a8090" />
      <rect x="36" y="6" width="2" height="24" rx="1" fill="rgba(255,255,255,0.18)" />
      {/* Blade */}
      <polygon points={`41,13 ${KNIFE_W - 2},18 41,22`} fill="url(#kg-blade)" />
      {/* Top bevel */}
      <polygon points={`41,13 ${KNIFE_W - 2},18 ${KNIFE_W - 2},16.5 41,12`} fill="rgba(255,255,255,0.55)" />
      {/* Serrations */}
      {[44, 49, 54, 59].map(x => (
        <line key={x} x1={x} y1="22" x2={x + 2} y2="24.5" stroke="#909aa8" strokeWidth="0.9" />
      ))}
      {/* Blood if stabbing */}
      {stabbing && (
        <>
          <ellipse cx={KNIFE_W - 8} cy={21} rx="2.5" ry="3.5" fill="#c0152a" opacity="0.9" />
          <ellipse cx={KNIFE_W - 14} cy={23} rx="1.5" ry="2" fill="#c0152a" opacity="0.6" />
        </>
      )}
      <defs>
        <linearGradient id="kg-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#a8adb8" />
          <stop offset="55%"  stopColor="#d4d8e0" />
          <stop offset="100%" stopColor="#b8bcc8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Shipping Container SVG ─── */
function ShippingContainer({
  stabs, shaking, dead,
}: { stabs: number; shaking: boolean; dead: boolean }) {
  const W = 260;
  const H = 150;

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        animation: shaking ? "kcd-shake 0.12s linear infinite" : "none",
        filter: dead ? "brightness(0.5) saturate(0.3)" : undefined,
        transition: "filter 0.5s",
        display: "block",
        overflow: "visible",
      }}
    >
      <defs>
        {/* Corrugation pattern */}
        <pattern id="corr" x="0" y="0" width="18" height="1" patternUnits="userSpaceOnUse">
          <rect width="18" height="9999" fill="#1a3f6a" />
          <rect width="3"  height="9999" fill="rgba(0,0,0,0.32)" />
          <rect x="15" width="3" height="9999" fill="rgba(255,255,255,0.07)" />
        </pattern>
        {/* Rust gradient */}
        <linearGradient id="rust-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#8b2000" />
          <stop offset="100%" stopColor="#cc3800" />
        </linearGradient>
        {/* Fire gradient */}
        <linearGradient id="fire-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"  stopColor="#ff4500" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ff8c00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </linearGradient>
        {/* Explosion radial */}
        <radialGradient id="expl-g">
          <stop offset="0%"  stopColor="#fff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ff8c00" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
        </radialGradient>
        <clipPath id="container-clip">
          <rect x="0" y="0" width={W} height={H} rx="4" />
        </clipPath>
      </defs>

      <g clipPath="url(#container-clip)">
        {/* ── Base body ── */}
        <rect width={W} height={H} rx="4" fill="#0e1d30" />

        {/* Top/bottom longitudinal rails */}
        <rect x="0"  y="0"  width={W} height="16" fill="#091525" />
        <rect x="0"  y={H - 16} width={W} height="16" fill="#091525" />
        {/* Left/right end posts */}
        <rect x="0"  y="0" width="16" height={H} fill="#091525" />
        <rect x={W - 16} y="0" width="16" height={H} fill="#091525" />

        {/* Corrugated side panel */}
        <rect x="16" y="16" width={W - 32} height={H - 32} fill="url(#corr)" />

        {/* Horizontal stiffeners */}
        <rect x="16" y="34"      width={W - 32} height="5" fill="rgba(0,0,0,0.25)" />
        <rect x="16" y={H - 39} width={W - 32} height="5" fill="rgba(0,0,0,0.25)" />

        {/* Corner castings */}
        {([
          [0, 0], [W - 20, 0], [0, H - 20], [W - 20, H - 20],
        ] as [number, number][]).map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="20" height="20" rx="2" fill="#081018" />
            <ellipse cx={x + 10} cy={y + 10} rx="5" ry="4"
              fill="none" stroke="#0f1e2e" strokeWidth="1.5" />
          </g>
        ))}

        {/* ── Markings ── */}
        <text x="24" y="30" fontFamily="monospace" fontSize="8" fontWeight="bold"
          fill="rgba(255,255,255,0.4)" letterSpacing="1.5">MSCU 247 891-3</text>

        {/* Owner logo block */}
        <rect x="24" y="44" width="52" height="20" rx="2" fill="rgba(255,255,255,0.06)" />
        <text x="29" y="57" fontFamily="sans-serif" fontSize="11" fontWeight="900"
          fill="rgba(255,255,255,0.45)" letterSpacing="3">MSCU</text>

        {/* ISO / size type */}
        <text x={W - 20} y="30" fontFamily="monospace" fontSize="7"
          fill="rgba(255,255,255,0.28)" textAnchor="end">22G1 / 20' DRY</text>

        {/* Weight markings at bottom */}
        <text x="24" y={H - 20} fontFamily="monospace" fontSize="6.5"
          fill="rgba(255,255,255,0.2)">MAX GROSS 30,480 KG   TARE 2,230 KG   MAX CARGO 28,250 KG</text>

        {/* ── DAMAGE LAYERS ── */}

        {/* Stab 1 — small puncture left side */}
        {stabs >= 1 && (
          <g>
            <ellipse cx="28" cy="72" rx="6" ry="4" fill="#050d18" />
            <path d="M22,68 L28,66 L34,70 L30,78 L22,75Z"
              fill="rgba(0,0,0,0.5)" stroke="rgba(180,60,20,0.7)" strokeWidth="0.8" />
            <path d="M22,70 L35,65" stroke="rgba(220,80,30,0.6)" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        )}

        {/* Stab 2 — crack spreading, rust bleeding */}
        {stabs >= 2 && (
          <g>
            <path d="M24,68 L42,58 L50,74 L38,86 L48,96"
              stroke="rgba(200,70,20,0.85)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M42,58 L46,44 L56,50"
              stroke="rgba(200,70,20,0.55)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <ellipse cx="38" cy="74" rx="16" ry="10" fill="rgba(0,0,0,0.38)" />
            <ellipse cx="38" cy="74" rx="12" ry="7" fill="url(#rust-g)" opacity="0.2" />
          </g>
        )}

        {/* Stab 3 — major gash, panel buckling */}
        {stabs >= 3 && (
          <g>
            <path d="M16,42 L62,52 L58,98 L16,105Z" fill="rgba(0,0,0,0.55)" />
            <path d="M16,42 L62,52 L58,98 L16,105"
              stroke="rgba(200,60,15,0.9)" strokeWidth="1.8" fill="none" />
            <path d="M24,48 L46,60 L40,85"
              stroke="#8B2000" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M36,54 L58,66 L52,88 L38,92"
              stroke="#CC3800" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <ellipse cx="40" cy="72" rx="22" ry="28" fill="url(#rust-g)" opacity="0.3" />
            {/* torn edge */}
            <path d="M16,42 L22,46 L18,55 L25,60 L16,65"
              fill="#0a1520" stroke="rgba(180,60,20,0.8)" strokeWidth="1" />
          </g>
        )}

        {/* Stab 4 — left third torn open, fire starts */}
        {stabs >= 4 && (
          <g>
            <path d="M16,20 L85,30 L80,120 L16,130Z" fill="rgba(4,8,14,0.85)" />
            <path d="M16,20 L85,30" stroke="rgba(255,100,30,0.9)" strokeWidth="2.5" />
            <path d="M85,30 L80,120" stroke="rgba(255,80,20,0.85)" strokeWidth="2.5" />
            {/* Shredded metal shards */}
            <path d="M16,20 L30,25 L26,45 L16,40Z" fill="#12202e" stroke="rgba(255,90,20,0.5)" strokeWidth="0.8" />
            <path d="M65,32 L85,30 L83,50 L62,46Z" fill="#0e1825" stroke="rgba(255,90,20,0.5)" strokeWidth="0.8" />
            <path d="M16,95 L30,98 L28,118 L16,115Z" fill="#10202e" />
            {/* Fire flame */}
            <ellipse cx="50" cy="25" rx="10" ry="18"
              fill="url(#fire-g)"
              style={{ animation: "kcd-fire 0.4s ease-in-out infinite" }}
            />
            <ellipse cx="68" cy="28" rx="7" ry="14"
              fill="url(#fire-g)"
              style={{ animation: "kcd-fire 0.35s ease-in-out 0.1s infinite" }}
            />
          </g>
        )}

        {/* ── DEAD STATE ── */}
        {dead && (
          <g>
            {/* Full dark overlay */}
            <rect width={W} height={H} fill="rgba(0,0,0,0.72)" />
            {/* Scanlines */}
            <rect width={W} height={H}
              style={{
                backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.4) 0px,rgba(0,0,0,0.4) 1px,transparent 1px,transparent 4px)",
                animation: "kcd-scanlines 0.35s linear infinite",
              }}
            />
            {/* Explosion burst */}
            <ellipse cx={W / 2} cy={H / 2} rx="80" ry="55"
              fill="url(#expl-g)"
              style={{ animation: "kcd-explosion 0.6s ease-out forwards" }}
            />
            {/* Fire */}
            <rect x="20" y={H - 50} width={W - 40} height="60" fill="url(#fire-g)"
              style={{ animation: "kcd-fire 0.3s ease-in-out infinite" }}
            />
            {/* KILLED text */}
            <text x={W / 2} y={H / 2 + 7}
              fontFamily="monospace" fontSize="24" fontWeight="bold"
              fill="rgba(239,68,68,0.92)" textAnchor="middle" letterSpacing="6"
              style={{ animation: "kcd-in 0.3s ease-out 0.35s both", opacity: 0 }}
            >
              KILLED
            </text>
            {/* Exit code */}
            <text x={W / 2} y={H / 2 + 24}
              fontFamily="monospace" fontSize="9"
              fill="rgba(239,68,68,0.5)" textAnchor="middle"
              style={{ animation: "kcd-in 0.3s ease-out 0.5s both", opacity: 0 }}
            >
              EXIT 137 · SIGKILL
            </text>
          </g>
        )}

        {/* Stab flash */}
        {shaking && !dead && (
          <rect width={W} height={H} fill="rgba(239,68,68,0.22)"
            style={{ animation: "kcd-flash 0.12s linear infinite" }} />
        )}
      </g>
    </svg>
  );
}

/* ─── Stab Counter ─── */
function StabCounter({ stabs }: { stabs: number }) {
  const integrity = Math.max(0, Math.round((1 - stabs / MAX_STABS) * 100));
  const barColor =
    integrity > 60 ? "#10B981" : integrity > 30 ? "#F59E0B" : "#ef4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Stab pip row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(156,163,175,0.5)", letterSpacing: "0.1em", marginRight: 4 }}>
          STABS
        </span>
        {Array.from({ length: MAX_STABS }).map((_, i) => {
          const done = i < stabs;
          return (
            <div
              key={i}
              style={{
                width: 30,
                height: 22,
                borderRadius: 5,
                background: done ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${done ? "rgba(239,68,68,0.55)" : "rgba(255,255,255,0.08)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                boxShadow: done ? "0 0 8px rgba(239,68,68,0.3)" : "none",
                animation: done && i === stabs - 1 ? "kcd-stab-indicator 0.3s ease-out" : "none",
              }}
            >
              {/* Mini blade shape */}
              <svg width="18" height="10" viewBox="0 0 18 10">
                <polygon
                  points="2,4.5 16,5 2,5.5"
                  fill={done ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.12)"}
                />
                <rect x="0" y="3.5" width="4" height="3" rx="1"
                  fill={done ? "rgba(160,60,20,0.8)" : "rgba(255,255,255,0.07)"} />
              </svg>
            </div>
          );
        })}
        <span style={{ fontFamily: "monospace", fontSize: 11, color: stabs >= MAX_STABS ? "#ef4444" : "rgba(156,163,175,0.6)", marginLeft: 4, transition: "color 0.3s" }}>
          {stabs}/{MAX_STABS}
        </span>
      </div>

      {/* Integrity bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 9, color: "rgba(156,163,175,0.45)", marginBottom: 4, letterSpacing: "0.1em" }}>
          <span>CONTAINER INTEGRITY</span>
          <span style={{ color: barColor, transition: "color 0.3s" }}>{integrity}%</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${integrity}%`,
            background: barColor,
            borderRadius: 99,
            boxShadow: `0 0 8px ${barColor}80`,
            transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s",
          }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dialog ─── */
interface KillContainerDialogProps {
  isOpen: boolean;
  containerName: string;
  onClose: () => void;
}

export function KillContainerDialog({ isOpen, containerName, onClose }: KillContainerDialogProps) {
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });
  const [stabs, setStabs] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [stabbing, setStabbing] = useState(false);
  const [dead, setDead] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addAuditLog } = useAuditLog();
  const { email: currentUserEmail } = useCurrentUser();
  const canStab = useRef(true);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStabs(0);
      setShaking(false);
      setStabbing(false);
      setDead(false);
      setShowSuccess(false);
      canStab.current = true;
      setMousePos({ x: -300, y: -300 });
    }
  }, [isOpen]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleContainerEnter = useCallback(() => {
    if (!canStab.current || dead) return;

    const next = stabs + 1; // captured via closure — see note below
    setStabs((s) => {
      const ns = s + 1;

      // Stab visuals
      setStabbing(true);
      setShaking(true);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
      shakeTimer.current = setTimeout(() => {
        setShaking(false);
        setStabbing(false);
      }, 280);

      if (ns >= MAX_STABS) {
        canStab.current = false;
        setTimeout(() => setDead(true), 380);
        setTimeout(async () => {
          setShowSuccess(true);
          try {
            await addAuditLog({
              action: "killing container",
              author: currentUserEmail || "unknown",
            });
          } catch (error) {
            console.error("Failed to save kill-container audit log:", error);
          }
        }, 950);
      }
      return ns;
    });
  }, [dead, stabs]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStabs(0);
      setShaking(false);
      setStabbing(false);
      setDead(false);
      setShowSuccess(false);
      canStab.current = true;
    }, 300);
  };

  if (!isOpen) return null;

  const knifeLeft = mousePos.x - KNIFE_W;
  const knifeTop  = mousePos.y - KNIFE_H / 2;

  return (
    <>
      <style>{CSS}</style>

      {/* Knife — fixed, follows real cursor */}
      <div style={{
        position: "fixed",
        left: knifeLeft,
        top: knifeTop,
        pointerEvents: "none",
        zIndex: 9999,
        animation: "kcd-knife-in 0.3s cubic-bezier(0.22,1,0.36,1)",
        ...(stabbing ? { animation: "kcd-stab 0.28s cubic-bezier(0.22,1,0.36,1)" } : {}),
      }}>
        <KnifeSVG stabbing={stabbing} />
      </div>

      {/* Backdrop */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(4px)",
          cursor: "none",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Dialog box */}
        <div style={{
          background: "#0c1622",
          border: `1px solid ${showSuccess ? "rgba(16,185,129,0.45)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: 14,
          width: 620,
          maxWidth: "calc(100vw - 32px)",
          overflow: "hidden",
          boxShadow: showSuccess
            ? "0 0 50px rgba(16,185,129,0.18), 0 24px 60px rgba(0,0,0,0.75)"
            : "0 0 40px rgba(239,68,68,0.1), 0 24px 60px rgba(0,0,0,0.75)",
          animation: "kcd-in 0.25s cubic-bezier(0.22,1,0.36,1)",
          transition: "border-color 0.5s, box-shadow 0.5s",
          cursor: "none",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Skull size={18} color="#ef4444" />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>Force Kill Container</div>
                <div style={{ fontFamily: "monospace", color: "rgba(156,163,175,0.6)", fontSize: 11, marginTop: 2 }}>
                  {containerName}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                padding: 8, borderRadius: 8, background: "transparent", border: "none",
                cursor: "none", color: "rgba(156,163,175,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <X size={18} />
            </button>
          </div>

          {/* Stab counter */}
          <div style={{ padding: "16px 22px 0" }}>
            <StabCounter stabs={stabs} />
          </div>

          {/* Arena */}
          <div style={{
            display: "flex", alignItems: "center",
            padding: "24px 28px 26px",
            gap: 0,
            minHeight: 210,
          }}>
            {/* Left — instruction */}
            <div style={{ flex: 1, paddingRight: 20 }}>
              <div style={{
                color: dead ? "#10B981" : stabs > 0 ? `rgba(239,68,68,${0.6 + stabs * 0.08})` : "rgba(156,163,175,0.7)",
                fontWeight: 600, fontSize: 14, marginBottom: 8, transition: "color 0.3s",
              }}>
                {dead
                  ? "Container destroyed."
                  : stabs === 0
                  ? "Stab the container to kill it."
                  : stabs >= MAX_STABS - 1
                  ? "One more..."
                  : `${MAX_STABS - stabs} stab${MAX_STABS - stabs !== 1 ? "s" : ""} remaining.`}
              </div>
              <div style={{ color: "rgba(156,163,175,0.45)", fontSize: 12, lineHeight: 1.7, maxWidth: 190 }}>
                {dead
                  ? "SIGKILL delivered. All processes terminated."
                  : "Move the knife over the container and stab it repeatedly until integrity reaches 0%."}
              </div>
              {stabs === 0 && (
                <div style={{
                  marginTop: 18, display: "flex", alignItems: "center", gap: 8,
                  color: "rgba(156,163,175,0.35)", fontSize: 11, fontFamily: "monospace",
                }}>
                  <div style={{ width: 24, height: 1, background: "rgba(239,68,68,0.25)", borderRadius: 1 }} />
                  hover over container →
                </div>
              )}
            </div>

            {/* Right — shipping container */}
            <div
              onMouseEnter={handleContainerEnter}
              style={{ flexShrink: 0, pointerEvents: dead ? "none" : "all" }}
            >
              <ShippingContainer stabs={stabs} shaking={shaking} dead={dead} />
            </div>
          </div>

          {/* Success notification */}
          {showSuccess && (
            <div style={{
              margin: "0 22px 22px",
              borderRadius: 10,
              background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.05))",
              border: "1px solid rgba(16,185,129,0.4)",
              padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 14,
              animation: "kcd-success-in 0.45s cubic-bezier(0.22,1,0.36,1)",
              boxShadow: "0 0 24px rgba(16,185,129,0.12)",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(16,185,129,0.15)", border: "1.5px solid rgba(16,185,129,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 0 16px rgba(16,185,129,0.35)",
              }}>
                <CheckCircle2 size={20} color="#10B981" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#10B981", fontWeight: 600, fontSize: 13, marginBottom: 3 }}>
                  Container Successfully Killed
                </div>
                <div style={{ fontFamily: "monospace", color: "rgba(156,163,175,0.65)", fontSize: 11 }}>
                  {containerName} · Exit 137 · SIGKILL · {MAX_STABS} stabs delivered · Audit log updated
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  padding: "7px 18px", borderRadius: 7,
                  background: "#10B981", color: "#fff",
                  fontWeight: 600, fontSize: 12, border: "none",
                  cursor: "none", flexShrink: 0, transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#059669")}
                onMouseLeave={e => (e.currentTarget.style.background = "#10B981")}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}