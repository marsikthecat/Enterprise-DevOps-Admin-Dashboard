import { useState, useRef, useEffect } from "react";
import { X, Key, AlertTriangle, Check, ShieldCheck } from "lucide-react";
import { useAuditLog } from "../../../hooks/useAuditLog";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

type Phase = "confirm" | "rotate";

const KEY_LABELS = ["KEY ONE", "KEY TWO", "KEY THREE"];

const KEYFRAME_CSS = `
@keyframes rsm-slide-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes rsm-pop {
  0%   { opacity: 0; transform: scale(0.2) rotate(-20deg); }
  65%  { transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes rsm-success-in {
  0%   { opacity: 0; transform: translateY(18px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}
@keyframes rsm-glow-pulse {
  0%, 100% { box-shadow: 0 0 18px rgba(16,185,129,0.25), 0 4px 24px rgba(0,0,0,0.4); }
  50%       { box-shadow: 0 0 36px rgba(16,185,129,0.55), 0 4px 24px rgba(0,0,0,0.4); }
}
@keyframes rsm-check-draw {
  0%   { stroke-dashoffset: 40; }
  100% { stroke-dashoffset: 0; }
}
`;

function KeySVG({ color }: { color: string }) {
  return (
    <svg width="38" height="66" viewBox="-13 -36 26 68">
      {/* Bow outer */}
      <circle cx="0" cy="-21" r="13" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      {/* Bow hole */}
      <circle cx="0" cy="-21" r="5" fill="none" stroke={color} strokeWidth="2.2" />
      {/* Shoulder */}
      <rect x="-3.8" y="-8" width="7.6" height="8" fill={color} />
      {/* Shaft */}
      <rect x="-3.8" y="0" width="7.6" height="30" rx="2" fill={color} />
      {/* Teeth */}
      <rect x="3.8" y="4"  width="9"   height="5.5" rx="1.5" fill={color} />
      <rect x="3.8" y="14" width="6.5" height="5.5" rx="1.5" fill={color} />
      <rect x="3.8" y="23" width="8"   height="5.5" rx="1.5" fill={color} />
      {/* Tip */}
      <rect x="-3.8" y="29" width="7.6" height="3" rx="1.5" fill={color} opacity="0.5" />
    </svg>
  );
}

function DraggableKey({
  keyIndex,
  completed,
  onComplete,
}: {
  keyIndex: number;
  completed: boolean;
  onComplete: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [progress, setProgress] = useState(0);

  const drag = useRef({ active: false, prevAngle: 0, accumulated: 0, done: false });

  const getAngle = (cx: number, cy: number, x: number, y: number) =>
    (Math.atan2(y - cy, x - cx) * 180) / Math.PI;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current.active || drag.current.done || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const a = getAngle(cx, cy, e.clientX, e.clientY);
      let delta = a - drag.current.prevAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      drag.current.prevAngle = a;
      drag.current.accumulated = Math.min(drag.current.accumulated + Math.abs(delta), 360);
      setRotation((r) => r + delta);
      setProgress(drag.current.accumulated / 360);
      if (drag.current.accumulated >= 360) {
        drag.current.done = true;
        drag.current.active = false;
        onComplete();
      }
    };
    const onUp = () => { drag.current.active = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [onComplete]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (completed) return;
    e.preventDefault();
    const r = containerRef.current!.getBoundingClientRect();
    drag.current.active = true;
    drag.current.prevAngle = getAngle(r.left + r.width / 2, r.top + r.height / 2, e.clientX, e.clientY);
  };

  const R = 44;
  const C = 2 * Math.PI * R;
  const keyColor = completed ? "#10B981" : "#F59E0B";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, userSelect: "none" }}>
      {/* Tick above the key */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: completed ? "#10B981" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: completed ? "scale(1)" : "scale(0.15)",
          opacity: completed ? 1 : 0,
          transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, background 0.3s",
          boxShadow: completed ? "0 0 16px rgba(16,185,129,0.75)" : "none",
          animation: completed ? "rsm-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
        }}
      >
        <Check size={15} color="white" strokeWidth={3} />
      </div>

      {/* Ring + draggable key */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        style={{
          position: "relative",
          width: 108,
          height: 108,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: completed ? "default" : "grab",
        }}
      >
        {/* Progress ring */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          viewBox="0 0 108 108"
        >
          {/* Track */}
          <circle cx="54" cy="54" r={R} fill="none" stroke="#1e293b" strokeWidth="3.5" />
          {/* Arc */}
          <circle
            cx="54" cy="54" r={R}
            fill="none"
            stroke={completed ? "#10B981" : "#38BDF8"}
            strokeWidth="3.5"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "54px 54px",
              transition: "stroke-dashoffset 0.04s linear, stroke 0.45s",
              filter: completed ? "drop-shadow(0 0 5px #10B981)" : undefined,
            }}
          />
        </svg>

        {/* The key itself */}
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            filter: completed
              ? "drop-shadow(0 0 10px #10B981) drop-shadow(0 0 4px rgba(16,185,129,0.4))"
              : "drop-shadow(0 0 6px rgba(245,158,11,0.45))",
            transition: "filter 0.45s",
          }}
        >
          <KeySVG color={keyColor} />
        </div>
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: completed ? "#10B981" : "#6B7280",
          transition: "color 0.4s",
        }}
      >
        {KEY_LABELS[keyIndex]}
      </span>
    </div>
  );
}

interface RotateAPIKeysDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RotateAPIKeysDialog({ isOpen, onClose }: RotateAPIKeysDialogProps) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [completed, setCompleted] = useState([false, false, false]);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addAuditLog } = useAuditLog();
  const { email: currentUserEmail } = useCurrentUser();

  if (!isOpen) return null;

  const doneCount = completed.filter(Boolean).length;

  const handleConfirm = () => setPhase("rotate");

  const handleKeyComplete = (i: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[i] = true;
      if (next.every(Boolean)) {
        setTimeout(async () => {
          setShowSuccess(true);
          try {
            await addAuditLog({
              action: "successful key rotation",
              author: currentUserEmail || "unknown",
            });
          } catch (error) {
            console.error("Failed to save key rotation audit log:", error);
          }
        }, 550);
      }
      return next;
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPhase("confirm");
      setCompleted([false, false, false]);
      setShowSuccess(false);
    }, 300);
  };

  const borderColor =
    showSuccess ? "rgba(16,185,129,0.45)" : phase === "confirm" ? "rgba(245,158,11,0.3)" : "rgba(56,189,248,0.2)";

  return (
    <>
      {/* Inject keyframe styles once */}
      <style>{KEYFRAME_CSS}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div
          style={{
            background: "#111827",
            border: `1px solid ${borderColor}`,
            borderRadius: 14,
            width: "100%",
            maxWidth: 480,
            overflow: "hidden",
            boxShadow: showSuccess
              ? "0 0 56px rgba(16,185,129,0.18), 0 25px 60px rgba(0,0,0,0.6)"
              : "0 25px 60px rgba(0,0,0,0.6)",
            transition: "border-color 0.6s, box-shadow 0.6s",
          }}
        >
          {/* ── CONFIRM PHASE ── */}
          {phase === "confirm" && (
            <div style={{ animation: "rsm-slide-up 0.22s ease-out" }}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Rotate API Keys</h2>
                    <p className="text-sm text-[#9CA3AF]">Confirm security action</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-[#9CA3AF] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/30 rounded-lg flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Important Security Action</div>
                    <div className="text-sm text-[#9CA3AF]">
                      This action will immediately invalidate all existing API keys and generate new ones.
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-white">What will happen:</div>
                  <ul className="space-y-2 text-sm text-[#9CA3AF]">
                    {[
                      "All current API keys will be immediately revoked",
                      "New API keys will be generated and displayed once",
                      "Active API integrations will stop working until updated",
                      "An audit log entry will be created",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 bg-[#0B0F17] rounded-lg">
                  <div>
                    <div className="text-xs text-[#9CA3AF] mb-1">Active Keys</div>
                    <div className="mono text-xl font-semibold text-white">128</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#9CA3AF] mb-1">Last Rotated</div>
                    <div className="text-sm text-white">30 days ago</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1f2937]">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors"
                >
                  Proceed with Rotation
                </button>
              </div>
            </div>
          )}

          {/* ── ROTATE PHASE ── */}
          {phase === "rotate" && (
            <div style={{ animation: "rsm-slide-up 0.25s ease-out" }}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-[#38BDF8]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Rotate API Keys</h2>
                    <p className="text-sm text-[#9CA3AF]">Drag each key in a full circle to rotate it</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-[#9CA3AF] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Keys area */}
              <div className="px-8 pt-8 pb-6">
                {/* Progress pips */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 5,
                        width: completed[i] ? 36 : 20,
                        borderRadius: 99,
                        background: completed[i] ? "#10B981" : "#1e293b",
                        boxShadow: completed[i] ? "0 0 8px rgba(16,185,129,0.65)" : "none",
                        transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                    />
                  ))}
                  <span
                    style={{ fontFamily: "monospace", fontSize: 11, color: "#6B7280", marginLeft: 6 }}
                  >
                    {doneCount}/3
                  </span>
                </div>

                {/* Three keys */}
                <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
                  {[0, 1, 2].map((i) => (
                    <DraggableKey
                      key={i}
                      keyIndex={i}
                      completed={completed[i]}
                      onComplete={() => handleKeyComplete(i)}
                    />
                  ))}
                </div>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "rgba(156,163,175,0.5)",
                    marginTop: 28,
                    transition: "opacity 0.4s",
                    opacity: showSuccess ? 0 : 1,
                  }}
                >
                  Click and drag in a circle to rotate each key 360°
                </p>
              </div>

              {/* ── SUCCESS NOTIFICATION ── */}
              {showSuccess && (
                <div
                  style={{
                    margin: "0 24px 24px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.06) 100%)",
                    border: "1px solid rgba(16,185,129,0.4)",
                    padding: "18px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    animation: "rsm-success-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards, rsm-glow-pulse 2.5s ease-in-out 0.4s infinite",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "rgba(16,185,129,0.15)",
                      border: "1.5px solid rgba(16,185,129,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      animation: "rsm-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
                    }}
                  >
                    <ShieldCheck size={22} color="#10B981" strokeWidth={2} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#10B981",
                        fontWeight: 600,
                        fontSize: 14,
                        marginBottom: 3,
                        animation: "rsm-slide-up 0.35s ease-out 0.15s both",
                      }}
                    >
                      API Keys Successfully Rotated
                    </div>
                    <div
                      style={{
                        color: "rgba(156,163,175,0.8)",
                        fontSize: 12,
                        animation: "rsm-slide-up 0.35s ease-out 0.25s both",
                      }}
                    >
                      All 3 keys has been successfully rotated. Audit log has also been updated.
                    </div>
                  </div>

                  {/* Done button */}
                  <button
                    onClick={handleClose}
                    style={{
                      padding: "7px 18px",
                      borderRadius: 8,
                      background: "#10B981",
                      color: "white",
                      fontWeight: 600,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      flexShrink: 0,
                      animation: "rsm-slide-up 0.35s ease-out 0.3s both",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#10B981")}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}