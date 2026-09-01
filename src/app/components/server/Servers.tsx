import { Link } from "react-router";
import { Server, Cpu, HardDrive, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { DeployServerDialog } from "./dialogs/DeployServerDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../common/ui/tooltip";
import { useProcessStore } from "../../states/processCpuState";
import { useApi } from "../../hooks/useApi";

export interface ServerInfo {
  id: string;
  type: string;
  status: string;
  cpu: number;
  memory: number;
  memoryUsage: number;
  disk: number;
  network: string;
  uptime: string;
  location: string;
  ip: string;
}

export function Servers() {

  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [serverList, setServerList] = useState<Partial<ServerInfo>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();

  const processes = useProcessStore((state) => state.processes);

  const fetchServers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getServers();
      setServerList(data);
    } catch (error) {
      console.error("Error fetching servers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, [api]);

  useEffect(() => {
    if (!serverList.length) return;

    const enrichedServers = serverList.map((server) => {
      const processesOfServer = processes.filter((p) => p.serverId === server.id);
      const totalCpu = processesOfServer.reduce((sum, proc) => sum + (Number(proc.cpu) || 0), 0);
      const totalMemory = processesOfServer.reduce((sum, proc) => sum + (Number(proc.memory) || 0), 0);
      const baseMemory = Number(server.memory ?? 0);
      const cpu = processesOfServer.length > 0 ? Math.min(100, Math.round(totalCpu / processesOfServer.length)) : 0;
      const memoryUsage = baseMemory > 0
        ? Math.min(100, Math.max(0, Math.round((totalMemory / baseMemory) * 100)))
        : 0;

      return {
        ...server,
        cpu,
        memoryUsage,
      };
    });

    setServerList(enrichedServers);
  }, [serverList.length, processes]);

  const deployServer = async (serverData: Partial<ServerInfo>) => {
    try {
      const newServer = await api.createServer(serverData as Record<string, unknown>);
      setServerList((prev) => [...prev, newServer]);
    } catch (error) {
      console.error("Error deploying server:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">Server Infrastructure</h1>
          <p className="text-[#9CA3AF]">Manage and monitor all server instances</p>
        </div>
        <button
          onClick={() => setIsDeployDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Deploy New Server
        </button>
      </div>

      {isLoading && serverList.length === 0 ? (
        <div className="text-[#9CA3AF]">Loading servers...</div>
      ) : null}

      <div className="grid grid-cols-3 gap-4">
        {serverList.map((server) => {
          const safeCpu = server.cpu ?? 0;
          const safeMemoryUsage = server.memoryUsage ?? 0;
          const totalMemoryUsed = Number(server.memory ?? 0) * (safeMemoryUsage / 100);
          const totalMemoryCapacity = Number(server.memory ?? 0);

          return (
          <Link
            key={server.id}
            to={`/servers/${server.id}`}
            className="glass-panel rounded-lg p-5 hover:border-[#38BDF8]/50 transition-all group block"
          >
            {/* Server Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1f2937] to-[#111827] border border-[#38BDF8]/20 flex items-center justify-center">
                  <Server className="w-6 h-6 text-[#38BDF8]" />
                </div>
                <div>
                  <div className="mono text-sm font-semibold text-white">{server.id}</div>
                  <div className="text-xs text-[#9CA3AF]">{server.type}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#38BDF8] transition-colors" />
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  server.status === "healthy"
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "bg-[#F59E0B]/10 text-[#F59E0B]"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    server.status === "healthy" ? "bg-[#10B981]" : "bg-[#F59E0B]"
                  }`}
                ></div>
                {server.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#9CA3AF] flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    CPU
                  </span>
                  <span className="mono text-white">{safeCpu}%</span>
                </div>
                <div className="bg-[#1f2937] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      safeCpu > 80 ? "bg-[#EF4444]" : safeCpu > 60 ? "bg-[#F59E0B]" : "bg-[#38BDF8]"
                    }`}
                    style={{ width: `${safeCpu}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#9CA3AF] flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    Memory
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="mono text-white cursor-default">{safeMemoryUsage}%</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#111827] border border-[#38BDF8]/30 text-[#E5E7EB]">
                      <div className="text-xs font-medium">{totalMemoryUsed.toFixed(1)} GB of {totalMemoryCapacity.toFixed(1)} GB used</div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-[#1f2937] rounded-full h-1.5 overflow-hidden cursor-pointer">
                      <div
                        className="h-full rounded-full bg-[#10B981]"
                        style={{ width: `${safeMemoryUsage}%` }}
                      ></div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#111827] border border-[#38BDF8]/30 text-[#E5E7EB]">
                    <div className="text-xs font-medium">{totalMemoryUsed.toFixed(1)} GB of {totalMemoryCapacity.toFixed(1)} GB used</div>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="pt-3 border-t border-[#1f2937] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[#9CA3AF] mb-0.5">Network</div>
                  <div className="mono text-white">{server.network}</div>
                </div>
                <div>
                  <div className="text-[#9CA3AF] mb-0.5">Uptime</div>
                  <div className="mono text-white">{server.uptime}</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF]">{server.location}</span>
                <span className="mono text-[#38BDF8]">{server.ip}</span>
              </div>
            </div>
          </Link>
          );
        })}
      </div>

      <DeployServerDialog
        isOpen={isDeployDialogOpen}
        onClose={() => setIsDeployDialogOpen(false)}
        onDeploy={deployServer}
      />
    </div>
  );
}
