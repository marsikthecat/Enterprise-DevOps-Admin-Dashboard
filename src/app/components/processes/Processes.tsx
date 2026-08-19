import { Activity, Search, Filter } from "lucide-react";
import { useState } from "react";
import { X } from "lucide-react";
import { useProcessStore } from "../../states/processCpuState";
import type { Process } from "../../types";

export function Processes() {

  const processes = useProcessStore(s => s.processes);

  const countSleeping = (processes: Process[]) => {
    let count = 0;
    for (let i = 0; i < processes.length; i++) {
      const element = processes[i];
      if (element.status == "S") {
        count++;
      }
    }
    return count;
  };

  const countRunning = (processes: Process[]) => {
    let count = 0;
    for (let i = 0; i < processes.length; i++) {
      const element = processes[i];
      if (element.status == "R") {
        count++;
      }
    }
    return count;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterServer, setFilterServer] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProcesses = processes.filter((process) => {
    const matchesSearch =
      searchTerm === "" ||
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.pid.toString().includes(searchTerm) ||
      process.serverId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "running" && process.status === "R") ||
      (filterStatus === "sleeping" && process.status === "S");

    const matchesServer = filterServer === "all" || process.serverId === filterServer;

    return matchesSearch && matchesStatus && matchesServer;
  });

  const uniqueServers = Array.from(new Set(processes.map((p) => p.serverId)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">Process Management</h1>
          <p className="text-[#9CA3AF]">Monitor all running processes across infrastructure</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span className="text-[#9CA3AF]">Live </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{processes.length} </div>
          <div className="text-sm text-[#9CA3AF]">Total Processes</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{countSleeping(processes)}</div>
          <div className="text-sm text-[#9CA3AF]">Sleeping</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{countRunning(processes)}</div>
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
      <div className="glass-panel rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search processes by name, PID, or server..."
              className="w-full pl-10 pr-4 py-2 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? "bg-[#38BDF8] text-white" : "bg-[#1f2937] hover:bg-[#1a2332] text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Active Filters */}
        {(searchTerm || filterStatus !== "all" || filterServer !== "all") && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#9CA3AF]">Active filters:</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex items-center gap-1 px-2 py-1 bg-[#38BDF8]/10 text-[#38BDF8] rounded text-xs"
              >
                Search: {searchTerm}
                <X className="w-3 h-3" />
              </button>
            )}
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="flex items-center gap-1 px-2 py-1 bg-[#38BDF8]/10 text-[#38BDF8] rounded text-xs"
              >
                Status: {filterStatus}
                <X className="w-3 h-3" />
              </button>
            )}
            {filterServer !== "all" && (
              <button
                onClick={() => setFilterServer("all")}
                className="flex items-center gap-1 px-2 py-1 bg-[#38BDF8]/10 text-[#38BDF8] rounded text-xs"
              >
                Server: {filterServer}
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#0B0F17] border border-[#1f2937] rounded-lg">
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#111827] border border-[#1f2937] rounded-lg text-white text-sm focus:border-[#38BDF8] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="running">Running</option>
                <option value="sleeping">Sleeping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#9CA3AF] mb-2">Server</label>
              <select
                value={filterServer}
                onChange={(e) => setFilterServer(e.target.value)}
                className="w-full px-3 py-2 bg-[#111827] border border-[#1f2937] rounded-lg text-white text-sm focus:border-[#38BDF8] focus:outline-none"
              >
                <option value="all">All Servers</option>
                {uniqueServers.map((server) => (
                  <option key={server} value={server}>
                    {server}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
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
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="border-b border-[#1f2937]/50 hover:bg-[#1a2332] transition-colors">
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#38BDF8]">{process.pid}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-white font-semibold">{process.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#9CA3AF]">{process.serverId}</span>
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
                    <span className="mono text-sm text-[#9CA3AF]">{process.memory}</span>
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
