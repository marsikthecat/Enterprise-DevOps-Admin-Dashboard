import { useEffect, useRef, useState } from "react";
import { Flame, Power, Thermometer, Sun, Palette } from "lucide-react";

const FW = 220;
const FH = 80;

type ColorPreset = "classic" | "arctic" | "toxic" | "plasma" | "solar";

const PRESETS: { id: ColorPreset; label: string; accent: string }[] = [
  { id: "classic", label: "Classic",  accent: "#FF6B00" },
  { id: "arctic",  label: "Arctic",   accent: "#38BDF8" },
  { id: "toxic",   label: "Toxic",    accent: "#22C55E" },
  { id: "plasma",  label: "Plasma",   accent: "#A855F7" },
  { id: "solar",   label: "Solar",    accent: "#FDE047" },
];

function buildPalette(preset: ColorPreset, temperature: number, brightness: number): Uint8ClampedArray {
  const pal = new Uint8ClampedArray(256 * 3);
  const br = brightness / 100;
  const hot = temperature / 100;

  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r = 0, g = 0, b = 0;
    switch (preset) {
      case "classic":
        r = Math.min(1, t * 2.2);
        g = Math.min(1, Math.max(0, t * 2.8 - 1.1));
        b = Math.min(1, Math.max(0, t * 3.5 - 2.5));
        break;
      case "arctic":
        r = Math.min(1, Math.max(0, t * 3.5 - 2.5));
        g = Math.min(1, Math.max(0, t * 2.6 - 0.8));
        b = Math.min(1, t * 2.2);
        break;
      case "toxic":
        r = Math.min(1, Math.max(0, t * 3.5 - 2.2));
        g = Math.min(1, t * 2.2);
        b = Math.min(1, Math.max(0, t * 3.0 - 2.0));
        break;
      case "plasma":
        r = Math.min(1, t * 2.2);
        g = Math.min(1, Math.max(0, t * 3.5 - 2.5));
        b = Math.min(1, t * 2.2);
        break;
      case "solar":
        r = Math.min(1, t * 1.6);
        g = Math.min(1, t * 2.1);
        b = Math.min(1, Math.max(0, t * 3.5 - 2.8));
        break;
    }

    const wb = hot * 0.55 * Math.pow(t, 1.4);
    r = Math.min(1, r + wb);
    g = Math.min(1, g + wb);
    b = Math.min(1, b + wb);

    pal[i * 3]     = Math.round(r * 255 * br);
    pal[i * 3 + 1] = Math.round(g * 255 * br);
    pal[i * 3 + 2] = Math.round(b * 255 * br);
  }
  return pal;
}

const SLIDER_CSS = `
.fire-range { -webkit-appearance: none; appearance: none; height: 3px; border-radius: 2px; outline: none; cursor: pointer; background: transparent; }
.fire-range::-webkit-slider-thumb { -webkit-appearance: none; width: 15px; height: 15px; border-radius: 50%; border: 2px solid #0B0F17; cursor: pointer; transition: transform 0.15s; }
.fire-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
.fire-range::-moz-range-thumb { width: 15px; height: 15px; border-radius: 50%; border: 2px solid #0B0F17; cursor: pointer; }
`;

function SliderRow({ icon, label, value, min, max, unit, thumbColor, trackColor, onChange}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  thumbColor: string;
  trackColor: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-36 flex-shrink-0">
        <span style={{ color: thumbColor }} className="opacity-70">{icon}</span>
        <span className="text-xs text-[#9CA3AF] font-medium tracking-wide">{label}</span>
      </div>
      <div className="flex-1 relative flex items-center">
        <div className="w-full h-[3px] rounded-full" style={{ background: "#1e293b" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${trackColor}88, ${trackColor})` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="fire-range absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: "20px", margin: "-8px 0" }}
        />
        {/* Visible thumb */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `calc(${pct}% - 7px)`,
            width: 15, height: 15,
            borderRadius: "50%",
            background: thumbColor,
            border: "2px solid #0B0F17",
            boxShadow: `0 0 10px ${thumbColor}80`,
          }}
        />
      </div>
      <div className="w-20 text-right">
        <span className="mono text-sm font-semibold" style={{ color: thumbColor }}>
          {value}{unit}
        </span>
      </div>
    </div>
  );
}

export function FirewallSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufRef    = useRef(new Uint8Array(FW * FH));
  const rafRef    = useRef(0);

  const [enabled,     setEnabled]     = useState(true);
  const [flameHeight, setFlameHeight] = useState(72);
  const [brightness,  setBrightness]  = useState(82);
  const [temperature, setTemperature] = useState(58);
  const [colorPreset, setColorPreset] = useState<ColorPreset>("classic");

  const params = useRef({ enabled, flameHeight, brightness, temperature, colorPreset });
  useEffect(() => { params.current = { enabled, flameHeight, brightness, temperature, colorPreset }; },
    [enabled, flameHeight, brightness, temperature, colorPreset]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!params.current.enabled) return;
      const delta = Math.floor(Math.random() * 18 + 6);
    }, 180);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false })!;
    const buf = bufRef.current;

    const tick = () => {
      const { enabled, flameHeight, brightness, temperature, colorPreset } = params.current;

      if (!enabled) {
        for (let i = 0; i < buf.length; i++) buf[i] = Math.max(0, buf[i] - 4);
        if (buf.every(v => v === 0)) {
          ctx.fillStyle = "#060a10";
          ctx.fillRect(0, 0, FW, FH);
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
      } else {
        const intensity = Math.round((flameHeight / 100) * 255);
        const rows = Math.max(1, Math.ceil(flameHeight / 34));
        for (let r = 0; r < rows; r++) {
          for (let x = 0; x < FW; x++) {
            buf[(FH - 1 - r) * FW + x] = Math.max(0, intensity - Math.floor(Math.random() * 70));
          }
        }
      }
      for (let y = 0; y < FH - 1; y++) {
        for (let x = 0; x < FW; x++) {
          const src = buf[(y + 1) * FW + x];
          if (src === 0) { buf[y * FW + x] = 0; continue; }
          const rand = Math.random() * 3 | 0;
          const nx   = Math.max(0, Math.min(FW - 1, x - rand + 1));
          buf[y * FW + nx] = Math.max(0, src - (rand & 1));
        }
      }
      const pal = buildPalette(colorPreset, temperature, brightness);
      const img = ctx.createImageData(FW, FH);
      const d   = img.data;
      for (let i = 0; i < FW * FH; i++) {
        const h = buf[i];
        d[i * 4]     = pal[h * 3];
        d[i * 4 + 1] = pal[h * 3 + 1];
        d[i * 4 + 2] = pal[h * 3 + 2];
        d[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const currentPreset = PRESETS.find(p => p.id === colorPreset)!;
  const accentColor   = currentPreset.accent;

  const tempK = Math.round(1200 + (temperature / 100) * 5000);
  const tempLabel = `${tempK.toLocaleString()} K`;

  return (
    <>
      <style>{SLIDER_CSS}</style>
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}35` }}
            >
              <Flame className="w-4 h-4" style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Firewall</h3>
              <p className="text-xs text-[#9CA3AF]">Real-time perimeter defence · wall of fire</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: enabled ? "#10B981" : "#EF4444",
                  boxShadow: enabled ? "0 0 8px #10B981" : "0 0 8px #EF4444",
                  animation: enabled ? "pulse 2s infinite" : "none",
                }}
              />
              <span className="mono text-xs" style={{ color: enabled ? "#10B981" : "#EF4444" }}>
                {enabled ? "ACTIVE" : "DISABLED"}
              </span>
            </div>
            <button
              onClick={() => setEnabled(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: enabled ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                border:     enabled ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(16,185,129,0.3)",
                color:      enabled ? "#EF4444" : "#10B981",
              }}
            >
              <Power className="w-3 h-3" />
              {enabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        <div className="relative" style={{ background: "#060a10" }}>
          <canvas
            ref={canvasRef}
            width={FW}
            height={FH}
            style={{
              width: "100%",
              height: 220,
              imageRendering: "pixelated",
              display: "block",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-8 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, #111827 0%, transparent 100%)" }}
          />
          {!enabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="rounded-xl px-6 py-3"
                style={{ background: "rgba(6,10,16,0.8)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <span className="mono text-sm text-[#EF4444]">— FIREWALL DISABLED —</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="p-5 border-t border-[#1f2937] space-y-5">
          <div className="text-xs mono text-[#9CA3AF]/60 tracking-widest uppercase mb-4">
            Firewall Configuration
          </div>

          <SliderRow
            icon={<Flame className="w-3.5 h-3.5" />}
            label="Flame Height"
            value={flameHeight}
            min={0} max={100} unit="%"
            thumbColor={accentColor}
            trackColor={accentColor}
            onChange={setFlameHeight}
          />

          <SliderRow
            icon={<Sun className="w-3.5 h-3.5" />}
            label="Brightness"
            value={brightness}
            min={10} max={100} unit="%"
            thumbColor="#FDE047"
            trackColor="#FDE047"
            onChange={setBrightness}
          />

          <SliderRow
            icon={<Thermometer className="w-3.5 h-3.5" />}
            label="Temperature"
            value={temperature}
            min={0} max={100}
            unit=""
            thumbColor="#F97316"
            trackColor="#F97316"
            onChange={setTemperature}
          />
          <div className="flex items-center gap-4 -mt-3">
            <div className="w-36 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mono text-[#9CA3AF]/40">
                <span>1,200 K</span>
                <span style={{ color: "#F97316", opacity: 0.7 }}>{tempLabel}</span>
                <span>6,200 K</span>
              </div>
            </div>
            <div className="w-20" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 w-36 flex-shrink-0">
              <Palette className="w-3.5 h-3.5 text-[#9CA3AF] opacity-70" />
              <span className="text-xs text-[#9CA3AF] font-medium tracking-wide">Color</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setColorPreset(p.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: colorPreset === p.id ? `${p.accent}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${colorPreset === p.id ? p.accent + "60" : "rgba(255,255,255,0.08)"}`,
                    color:  colorPreset === p.id ? p.accent : "#6B7280",
                    boxShadow: colorPreset === p.id ? `0 0 12px ${p.accent}30` : "none",
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ background: p.accent }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 pt-3 mt-1 border-t border-[#1f2937]" >
            {[
              { label: "Rules Active",    value: "242",                      color: "#10B981" },
              { label: "IPs Blocked",     value: "1,428",                    color: "#EF4444" },
              { label: "Threats Today",   value: "34",                       color: "#F59E0B" },
              { label: "Uptime",          value: "342d 14h",                 color: "#38BDF8" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#0B0F17] rounded-lg px-3 py-2.5 text-center">
                <div className="mono text-base font-bold mb-0.5" style={{ color }}>{value}</div>
                <div className="text-[10px] text-[#9CA3AF]/60 mono">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}