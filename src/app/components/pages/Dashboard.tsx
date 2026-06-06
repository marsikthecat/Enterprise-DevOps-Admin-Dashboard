import { Server, Activity, Network, Database, TrendingUp, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect} from "react";
import { useNetworkStore } from "../../states/networkTrafficState";

export function Dashboard() {
  const [cpuData, setCpuData] = useState(() => {
  const now = Date.now();

  return Array.from({ length: 30 }, (_, i) => ({
    time: new Date(now - (29 - i) * 1000).toLocaleTimeString(),
    value: Math.floor(Math.random() * 50),
  }));
});

useEffect(() => {
  const interval = setInterval(() => {
    setCpuData(prev => {
      const lastValue = prev[prev.length - 1].value;

      const fluctuation = Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1
          : Math.floor(Math.random() * 1) - 10;

      const newValue = Math.max(0, lastValue + fluctuation);
      return [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString(),
          value: newValue,
        },
      ];
    });
  }, 1000);
  return () => clearInterval(interval);
}, []);

const networkData = useNetworkStore(s => s.networkData);
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">Infrastructure Overview</h1>
          <p className="text-[#9CA3AF]">Real-time monitoring across all systems</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span className="text-[#9CA3AF]">Live • Updated 2s ago</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">24</div>
          <div className="text-sm text-[#9CA3AF]">Active Servers</div>
          <div className="mt-2 text-xs text-[#10B981]">+2 this week</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-xs mono text-[#10B981]">+12%</div>
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">1,247</div>
          <div className="text-sm text-[#9CA3AF]">Active Processes</div>
          <div className="mt-2 text-xs text-[#9CA3AF]">Across all nodes</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Network className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-xs mono text-[#38BDF8]">420 Mb/s</div>
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">2.8 TB</div>
          <div className="text-sm text-[#9CA3AF]">Network Traffic</div>
          <div className="mt-2 text-xs text-[#9CA3AF]">Last 24 hours</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></div>
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">3</div>
          <div className="text-sm text-[#9CA3AF]">Active Alerts</div>
          <div className="mt-2 text-xs text-[#F59E0B]">1 critical, 2 warnings</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-1">Global CPU Usage</h3>
          <p className="text-sm text-[#9CA3AF] mb-4">Average across all servers (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cpuData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="value"
                stroke="#38BDF8"
                strokeWidth={2}
                fill="url(#cpuGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-1">Network Traffic</h3>
          <p className="text-sm text-[#9CA3AF] mb-4">Inbound / Outbound (GB/h)</p>
          <ResponsiveContainer width="100%" height={200}>
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
              <Line type="monotone" dataKey="in" stroke="#38BDF8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="out" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
