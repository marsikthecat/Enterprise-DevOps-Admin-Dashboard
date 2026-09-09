import { Network as NetworkIcon, Activity, Globe, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useNetworkStore } from "../../states/networkTrafficState";

const VBW = 1060, VBH = 420;
const NW = 84, NH = 34;

const NODES = {
  internet: { cx: 70,  cy: 210, label: "Internet",     type: "external"  },
  firewall: { cx: 210, cy: 210, label: "Firewall",      type: "security"  },
  lb:       { cx: 370, cy: 210, label: "Load Balancer", type: "infra"     },
  web1:     { cx: 570, cy: 90,  label: "srv-web-01",    type: "server"    },
  web2:     { cx: 570, cy: 210, label: "srv-web-02",    type: "server"    },
  web3:     { cx: 570, cy: 330, label: "srv-web-03",    type: "server"    },
  db1:      { cx: 840, cy: 90,  label: "srv-db-01",     type: "database"  },
  db2:      { cx: 840, cy: 230, label: "srv-db-02",     type: "database"  },
  cache:    { cx: 840, cy: 350, label: "srv-cache",     type: "cache"     },
} as const;

type NodeId = keyof typeof NODES;

const TYPE_COLOR = {
  external: { stroke: "#6B7280", fill: "#131920", label: "#D1D5DB", badge: "#9CA3AF" },
  security: { stroke: "#EF4444", fill: "#1a0a0a", label: "#FCA5A5", badge: "#EF4444" },
  infra:    { stroke: "#F59E0B", fill: "#1a1200", label: "#FCD34D", badge: "#F59E0B" },
  server:   { stroke: "#38BDF8", fill: "#051520", label: "#7DD3FC", badge: "#38BDF8" },
  database: { stroke: "#10B981", fill: "#051510", label: "#6EE7B7", badge: "#10B981" },
  cache:    { stroke: "#A78BFA", fill: "#0e0a1a", label: "#C4B5FD", badge: "#A78BFA" },
};

const TYPE_BADGE: Record<string, string> = {
  external: "NET", security: "FW", infra: "LB",
  server:   "WEB", database: "DB", cache: "MEM",
};

const rx = (id: NodeId) => NODES[id].cx + NW / 2;
const lx = (id: NodeId) => NODES[id].cx - NW / 2;
const cy = (id: NodeId) => NODES[id].cy;

const LB_CONNS = [
  { id: "lb-web1", to: "web1" as NodeId, label: "srv-web-01", pct: 34, rps: 2840, latency: 12, p99: 28, health: "healthy" },
  { id: "lb-web2", to: "web2" as NodeId, label: "srv-web-02", pct: 38, rps: 3190, latency: 14, p99: 31, health: "healthy" },
  { id: "lb-web3", to: "web3" as NodeId, label: "srv-web-03", pct: 28, rps: 2350, latency: 11, p99: 25, health: "healthy" },
];

type LbConn = typeof LB_CONNS[0];

interface TooltipState {
  x: number;
  y: number;
  conn: LbConn;
}

const PLAIN_CONNS: { from: NodeId; to: NodeId; color: string; opacity?: number }[] = [
  { from: "internet", to: "firewall", color: "#38BDF8" },
  { from: "firewall",  to: "lb",       color: "#38BDF8" },
  { from: "web1", to: "db1",   color: "#10B981" },
  { from: "web2", to: "db1",   color: "#10B981" },
  { from: "web2", to: "db2",   color: "#10B981" },
  { from: "web3", to: "db2",   color: "#10B981" },
  { from: "web1", to: "cache", color: "#A78BFA", opacity: 0.4 },
  { from: "web2", to: "cache", color: "#A78BFA", opacity: 0.4 },
  { from: "web3", to: "cache", color: "#A78BFA", opacity: 0.4 },
];

function TopologyMap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const onEnter = (e: React.MouseEvent, conn: LbConn) => {
    setTooltip({ x: e.clientX, y: e.clientY, conn });
    setHovered(conn.id);
  };
  const onMove  = (e: React.MouseEvent) =>
    setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null);
  const onLeave = () => { setTooltip(null); setHovered(null); };

  return (
    <div className="relative select-none">
      <style>{`
        @keyframes topo-dash {
          from { stroke-dashoffset: 20; }
          to   { stroke-dashoffset: 0; }
        }
        .tflow { stroke-dasharray: 6 4; animation: topo-dash 0.9s linear infinite; }
        .tflow-slow { stroke-dasharray: 8 5; animation: topo-dash 1.4s linear infinite; }
      `}</style>

      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        width="100%"
        style={{ display: "block", minHeight: 260 }}
      >
        {/* Subtle dot grid */}
        <defs>
          <pattern id="tgrid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="rgba(56,189,248,0.07)" />
          </pattern>
          {/* Glow filter for hovered connections */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={VBW} height={VBH} fill="url(#tgrid)" />

        {/* ── Plain connections ── */}
        {PLAIN_CONNS.map(({ from, to, color, opacity = 0.45 }) => (
          <line
            key={`${from}-${to}`}
            x1={rx(from)} y1={cy(from)}
            x2={lx(to)}   y2={cy(to)}
            stroke={color}
            strokeWidth={1.4}
            opacity={opacity}
            className="tflow-slow"
          />
        ))}

        {/* ── LB → Web connections (hoverable) ── */}
        {LB_CONNS.map(conn => {
          const isHov = hovered === conn.id;
          const x1 = rx("lb"), y1 = cy("lb");
          const x2 = lx(conn.to), y2 = cy(conn.to);
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

          return (
            <g key={conn.id}>
              {isHov && (
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#38BDF8" strokeWidth={10} opacity={0.15} filter="url(#glow)" />
              )}
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#38BDF8"
                strokeWidth={isHov ? 2.4 : 1.6}
                opacity={isHov ? 1 : 0.6}
                className="tflow"
              />
              <g>
                <rect
                  x={mx - 15} y={my - 9} width={30} height={17} rx={8}
                  fill="#0B0F17"
                  stroke={isHov ? "#38BDF8" : "rgba(56,189,248,0.35)"}
                  strokeWidth={isHov ? 1.2 : 0.8}
                />
                <text
                  x={mx} y={my + 4}
                  textAnchor="middle"
                  fontSize={8}
                  fontFamily="ui-monospace,monospace"
                  fontWeight="bold"
                  fill={isHov ? "#7DD3FC" : "#38BDF8"}
                >
                  {conn.pct}%
                </text>
              </g>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="transparent"
                strokeWidth={22}
                style={{ cursor: "crosshair" }}
                onMouseEnter={e => onEnter(e, conn)}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
              />
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {(Object.entries(NODES) as [NodeId, typeof NODES[NodeId]][]).map(([id, node]) => {
          const c = TYPE_COLOR[node.type as keyof typeof TYPE_COLOR];
          const nx = node.cx - NW / 2;
          const ny = node.cy - NH / 2;
          return (
            <g key={id}>
              {/* Subtle outer glow */}
              <rect
                x={nx - 2} y={ny - 2}
                width={NW + 4} height={NH + 4}
                rx={7}
                fill="none"
                stroke={c.stroke}
                strokeWidth={0.6}
                opacity={0.2}
              />
              {/* Main rect */}
              <rect
                x={nx} y={ny}
                width={NW} height={NH}
                rx={5}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={1.2}
              />
              {/* Type badge pill */}
              <rect x={nx + 5} y={ny + 4} width={24} height={9} rx={4}
                fill={c.stroke} opacity={0.18} />
              <text
                x={nx + 17} y={ny + 11.5}
                textAnchor="middle"
                fontSize={5.8}
                fontFamily="ui-monospace,monospace"
                fontWeight="700"
                fill={c.badge}
              >
                {TYPE_BADGE[node.type]}
              </text>
              {/* Main label */}
              <text
                x={node.cx} y={ny + NH - 8}
                textAnchor="middle"
                fontSize={8.5}
                fontFamily="ui-monospace,monospace"
                fill={c.label}
              >
                {node.label}
              </text>
              {/* Status dot */}
              <circle
                cx={nx + NW - 8} cy={ny + 8} r={3}
                fill={id === "firewall" ? "#EF4444" : "#10B981"}
                opacity={0.9}
              />
            </g>
          );
        })}

        {/* ── Column labels ── */}
        {[
          { x: 70,  label: "EDGE" },
          { x: 370, label: "LOAD BALANCING" },
          { x: 570, label: "APPLICATION" },
          { x: 840, label: "DATA / CACHE" },
        ].map(({ x, label }) => (
          <text key={label} x={x} y={VBH - 8}
            textAnchor="middle"
            fontSize={10}
            fontFamily="ui-monospace,monospace"
            fill="rgba(156,163,175,0.4)"
            letterSpacing="0.08em"
          >
            {label}
          </text>
        ))}

        {[
          { x: 24, color: "#38BDF8", label: "LB traffic" },
          { x: 24, color: "#10B981", label: "DB",         dy: 14 },
          { x: 24, color: "#A78BFA", label: "Cache",      dy: 28 },
        ].map(({ x, color, label, dy = 0 }) => (
          <g key={label} transform={`translate(${x}, ${VBH - 76 + dy})`}>
            <line x1={0} y1={0} x2={16} y2={0} stroke={color} strokeWidth={1.5}
              strokeDasharray="5 3" opacity={0.8} />
            <text x={20} y={4} fontSize={12} fontFamily="ui-monospace,monospace"
              fill="rgba(156,163,175,0.6)">{label}</text>
          </g>
        ))}
      </svg>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 18,
            top:  tooltip.y - 80,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(56,189,248,0.4)",
              borderRadius: 10,
              padding: "10px 14px",
              minWidth: 210,
              boxShadow:
                "0 0 0 1px rgba(56,189,248,0.08), 0 20px 48px rgba(0,0,0,0.85), 0 0 28px rgba(56,189,248,0.12)",
              animation: "fp-pop 0.15s ease-out",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 12, color: "#38BDF8", fontWeight: 700 }}>
                {tooltip.conn.label}
              </span>
              <span style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.35)",
                borderRadius: 20,
                padding: "2px 8px",
                fontSize: 9,
                fontFamily: "ui-monospace,monospace",
                color: "#10B981",
              }}>
                ● {tooltip.conn.health}
              </span>
            </div>
            <div style={{ marginBottom: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: "#6B7280", fontFamily: "ui-monospace,monospace" }}>TRAFFIC SHARE</span>
                <span style={{ fontSize: 9, color: "#38BDF8", fontFamily: "ui-monospace,monospace", fontWeight: 700 }}>
                  {tooltip.conn.pct}%
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{
                  height: "100%",
                  width: `${tooltip.conn.pct}%`,
                  background: "linear-gradient(90deg, #0EA5E9, #38BDF8)",
                  borderRadius: 2,
                }} />
              </div>
            </div>
            {[
              { label: "Requests / sec",  value: tooltip.conn.rps.toLocaleString(), color: "#7DD3FC" },
              { label: "Avg latency",     value: `${tooltip.conn.latency} ms`,       color: "#FCD34D" },
              { label: "P99 latency",     value: `${tooltip.conn.p99} ms`,           color: "#F97316" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>{label}</span>
                <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 10, fontWeight: 700, color }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Network() {

  const [Throughput, setThroughput] = useState<number>(280);
  const [latency, setLatency] = useState<number>(42);

  useEffect(() => {
    const interval = setInterval(() => {
      const newThroughput = Math.floor(Math.random() * 10) - 5;
      const temp = Throughput;
      setThroughput(temp + newThroughput);
    }, 500);
    return () => clearInterval(interval);
    }, []);
    const networkData = useNetworkStore(s => s.networkData);
    const throughtPut = useNetworkStore(s => s.networkThroughput);

  useEffect(() => {
    const latencyInterval = setInterval(() => {
      let change = 0;
      if (latency % 2 == 0) {
        change += 1
      } else if (latency > 60) {
        change -= latency * 0.2;
      } else if (latency < 15) {
        change += latency * 0.1;
      } else {
        change += Math.floor(Math.random() * 4) - 5;
      }
      setLatency(latency + change);
    }, 2000);
    return () => clearInterval(latencyInterval);
    }, []);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-1">Network Overview</h1>
        <p className="text-[#9CA3AF]">Monitor network traffic and topology</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1" >{throughtPut.toFixed(1)} Mb/s</div>
          <div className="text-sm text-[#9CA3AF]">Current Throughput</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
            <Globe className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">2.8 TB</div>
          <div className="text-sm text-[#9CA3AF]">24h Total</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
            <NetworkIcon className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">24</div>
          <div className="text-sm text-[#9CA3AF]">Active Connections</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Wifi className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{latency}ms</div>
          <div className="text-sm text-[#9CA3AF]">Avg Latency</div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-1">Network Traffic</h3>
          <p className="text-sm text-[#9CA3AF] mb-4">Inbound (GB/h)</p>
          <ResponsiveContainer height={300}>
            <LineChart data={networkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #38BDF8",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="in" stroke="#38BDF8" strokeWidth={2} dot={false} name="Inbound" />
          </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-1">Network Traffic</h3>
          <p className="text-sm text-[#9CA3AF] mb-4">Outbound (GB/h)</p> 
          <ResponsiveContainer height={300}>
          <LineChart data={networkData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #38BDF8",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="out" stroke="#10B981" strokeWidth={2} dot={false} name="Outbound" />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-panel rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Network Topology</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Hover connections between Load Balancer and web servers for traffic details
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/25 rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" style={{ boxShadow: "0 0 6px #10B981" }} />
            <span className="mono text-xs text-[#10B981]">All nodes online</span>
          </div>
        </div>
        <div className="bg-[#080c12] rounded-lg overflow-hidden" style={{ border: "1px solid rgba(56,189,248,0.06)" }}>
          <TopologyMap />
        </div>
      </div>
    </div>
  );
}
