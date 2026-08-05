import { Network as NetworkIcon, Activity, Globe, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useNetworkStore } from "../../states/networkTrafficState";

const topologyNodes = [
  { id: "internet", label: "Internet", type: "external", x: 50, y: 10 },
  { id: "firewall", label: "Firewall", type: "security", x: 50, y: 25 },
  { id: "lb", label: "Load Balancer", type: "infrastructure", x: 50, y: 40 },
  { id: "web1", label: "srv-web-01", type: "server", x: 30, y: 60 },
  { id: "web2", label: "srv-web-02", type: "server", x: 50, y: 60 },
  { id: "web3", label: "srv-web-03", type: "server", x: 70, y: 60 },
  { id: "db1", label: "srv-db-01", type: "database", x: 30, y: 85 },
  { id: "db2", label: "srv-db-02", type: "database", x: 50, y: 85 },
  { id: "cache", label: "srv-cache-01", type: "cache", x: 70, y: 85 },
];

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

      {/* Network Topology */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Network Topology</h3>
        <div className="bg-[#0B0F17] rounded-lg p-8 relative h-[500px]">
          <svg className="w-full h-full">
            {/* Connections */}
            <line x1="50%" y1="10%" x2="50%" y2="25%" stroke="#38BDF8" strokeWidth="2" opacity="0.5" />
            <line x1="50%" y1="25%" x2="50%" y2="40%" stroke="#38BDF8" strokeWidth="2" opacity="0.5" />
            <line x1="50%" y1="40%" x2="30%" y2="60%" stroke="#38BDF8" strokeWidth="2" opacity="0.5" />
            <line x1="50%" y1="40%" x2="50%" y2="60%" stroke="#38BDF8" strokeWidth="2" opacity="0.5" />
            <line x1="50%" y1="40%" x2="70%" y2="60%" stroke="#38BDF8" strokeWidth="2" opacity="0.5" />
            <line x1="30%" y1="60%" x2="30%" y2="85%" stroke="#10B981" strokeWidth="2" opacity="0.5" />
            <line x1="50%" y1="60%" x2="50%" y2="85%" stroke="#10B981" strokeWidth="2" opacity="0.5" />
            <line x1="70%" y1="60%" x2="70%" y2="85%" stroke="#F59E0B" strokeWidth="2" opacity="0.5" />
          </svg>

          {/* Nodes */}
          {topologyNodes.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center gap-2 border-2 transition-all hover:scale-110 ${
                  node.type === "external"
                    ? "bg-[#1f2937] border-[#9CA3AF]"
                    : node.type === "security"
                    ? "bg-[#EF4444]/10 border-[#EF4444]"
                    : node.type === "infrastructure"
                    ? "bg-[#F59E0B]/10 border-[#F59E0B]"
                    : node.type === "server"
                    ? "bg-[#38BDF8]/10 border-[#38BDF8]"
                    : node.type === "database"
                    ? "bg-[#10B981]/10 border-[#10B981]"
                    : "bg-[#F59E0B]/10 border-[#F59E0B]"
                }`}
              >
                <NetworkIcon
                  className={`w-6 h-6 ${
                    node.type === "external"
                      ? "text-[#9CA3AF]"
                      : node.type === "security"
                      ? "text-[#EF4444]"
                      : node.type === "infrastructure"
                      ? "text-[#F59E0B]"
                      : node.type === "server"
                      ? "text-[#38BDF8]"
                      : node.type === "database"
                      ? "text-[#10B981]"
                      : "text-[#F59E0B]"
                  }`}
                />
                <span className="text-xs text-white text-center">{node.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
