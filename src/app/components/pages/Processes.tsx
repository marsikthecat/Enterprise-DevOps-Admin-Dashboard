import { Activity, Search, Filter } from "lucide-react";

const processes = [
  { pid: 1247, name: "nginx", server: "srv-web-01", user: "www-data", cpu: 8.2, mem: 124, threads: 4, status: "S", uptime: "142d" },
  { pid: 1892, name: "node", server: "srv-web-01", user: "nodeapp", cpu: 22.1, mem: 512, threads: 8, status: "R", uptime: "89d" },
  { pid: 2103, name: "postgres", server: "srv-db-01", user: "postgres", cpu: 45.8, mem: 4200, threads: 16, status: "S", uptime: "342d" },
  { pid: 2456, name: "redis-server", server: "srv-cache-01", user: "redis", cpu: 3.2, mem: 180, threads: 2, status: "S", uptime: "201d" },
  { pid: 3012, name: "python3", server: "srv-web-02", user: "worker", cpu: 15.4, mem: 256, threads: 6, status: "S", uptime: "45d" },
  { pid: 3421, name: "postgres", server: "srv-db-02", user: "postgres", cpu: 42.3, mem: 4100, threads: 16, status: "S", uptime: "342d" },
  { pid: 4102, name: "nginx", server: "srv-web-02", user: "www-data", cpu: 6.8, mem: 118, threads: 4, status: "S", uptime: "142d" },
  { pid: 4567, name: "prometheus", server: "srv-web-01", user: "monitoring", cpu: 12.5, mem: 890, threads: 12, status: "R", uptime: "120d" },
  { pid: 5234, name: "postgres", server: "srv-db-03", user: "postgres", cpu: 78.9, mem: 4800, threads: 18, status: "R", uptime: "89d" },
  { pid: 6012, name: "grafana", server: "srv-web-02", user: "grafana", cpu: 9.2, mem: 340, threads: 8, status: "S", uptime: "120d" },
  { pid: 6789, name: "docker", server: "srv-web-01", user: "root", cpu: 5.1, mem: 220, threads: 10, status: "S", uptime: "142d" },
  { pid: 7234, name: "elasticsearch", server: "srv-db-01", user: "elastic", cpu: 34.2, mem: 3200, threads: 24, status: "S", uptime: "201d" },
];

export function Processes() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">Process Management</h1>
          <p className="text-[#9CA3AF]">Monitor all running processes across infrastructure</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span className="text-[#9CA3AF]">Live • {processes.length} processes</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">1,247</div>
          <div className="text-sm text-[#9CA3AF]">Total Processes</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">1,189</div>
          <div className="text-sm text-[#9CA3AF]">Sleeping</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">58</div>
          <div className="text-sm text-[#9CA3AF]">Running</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">0</div>
          <div className="text-sm text-[#9CA3AF]">Zombie</div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search processes by name, PID, or server..."
              className="w-full pl-10 pr-4 py-2 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Process Table */}
      <div className="glass-panel rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">PID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">PROCESS</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">SERVER</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">USER</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">CPU %</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">MEM (MB)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">THREADS</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">STATE</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">UPTIME</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.pid} className="border-b border-[#1f2937]/50 hover:bg-[#1a2332] transition-colors">
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#38BDF8]">{process.pid}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-white font-semibold">{process.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#9CA3AF]">{process.server}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-[#9CA3AF]">{process.user}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`mono text-sm ${
                        process.cpu > 70
                          ? "text-[#EF4444] font-semibold"
                          : process.cpu > 40
                          ? "text-[#F59E0B]"
                          : "text-white"
                      }`}
                    >
                      {process.cpu}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#9CA3AF]">{process.mem.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#9CA3AF]">{process.threads}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`mono text-sm ${
                        process.status === "R" ? "text-[#10B981]" : "text-[#9CA3AF]"
                      }`}
                    >
                      {process.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#9CA3AF]">{process.uptime}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
