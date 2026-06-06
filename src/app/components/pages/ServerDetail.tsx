import { useParams, Link } from "react-router";
import { ArrowLeft, Server, Play, Square, RefreshCw, Terminal, Package, Power, XCircle } from "lucide-react";
import { ConfirmDialog } from "../dialogs/ConfirmDialog";
import { ErrorDialog } from "../dialogs/ErrorDialog";
import { useEffect, useState } from "react";
import { DeployContainerDialog } from "../dialogs/DeployContainerDialog";
import { Process } from "./Processes";

const pipelines = [
  {
    id: 1,
    name: "Production Deploy",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=200&fit=crop",
    status: "success",
    lastRun: "2h ago",
  },
  {
    id: 2,
    name: "Database Backup",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
    status: "running",
    lastRun: "Running now",
  },
  {
    id: 3,
    name: "Security Scan",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=200&fit=crop",
    status: "success",
    lastRun: "5h ago",
  },
];

interface ContainerInfo {
  id: string;
  name: string;
  status: string;
  ports: string;
  cpu: number;
  mem: number;
}

export function ServerDetail() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [isDeployContainerDialogOpen, setIsDeployContainerDialogOpen] = useState(false);
  const [containerList, setContainerList] = useState<ContainerInfo[]>([]);
  const [processList, setProcessList] = useState<Process[]>([]);

  const [containerAction, setContainerAction] = useState<{
    action: "stop" | "restart" | "kill";
    containerName: string;
  } | null>(null);

  const handleContainerAction = (action: "stop" | "restart" | "kill", containerName: string) => {
    setContainerAction({ action, containerName });
  };

  const handleConfirmAction = () => {
    console.log(`${containerAction?.action} container:`, containerAction?.containerName);
    setContainerAction(null);
  };

  const getActionConfig = () => {
    if (!containerAction) return { title: "", message: "", variant: "warning" as const };
    const configs = {
      stop: {
        title: "Stop Container",
        message: `Are you sure you want to stop ${containerAction.containerName}? The container will be gracefully stopped and can be restarted later.`,
        variant: "warning" as const,
      },
      restart: {
        title: "Restart Container",
        message: `Are you sure you want to restart ${containerAction.containerName}? This will cause a brief interruption of service.`,
        variant: "warning" as const,
      },
      kill: {
        title: "Kill Container",
        message: `Are you sure you want to forcefully kill ${containerAction.containerName}? This is a destructive action that immediately terminates the container without cleanup. Use this only if the container is unresponsive.`,
        variant: "danger" as const,
      },
    };

    return configs[containerAction.action];
  };

  const fetchContainer = async () => {
    try {
      const response = await fetch(`http://localhost:3000/servers/${id}/containers`);
      const containers = await response.json();
      setContainerList(containers); 
    } catch (error) {
      console.error("Failed to fetch containers", error);
    }
  }
  const fetchProcesses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/servers/${id}/processes`);
      const processes = await response.json();
      setProcessList(processes);
    } catch (error) {
      console.error("Failed to fetch processes", error);
    }
  }

  useEffect(() => {
    fetchContainer();
    fetchProcesses();
  }, [])

  const deployContainer = async (containerData: Partial<ContainerInfo>) => {
    try {
      const response = await fetch(`http://localhost:3000/servers/${id}/containers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(containerData),
      });
      if (response.ok) {
        const newContainer = await response.json();
        setContainerList((prev) => [...prev, newContainer]); 
      } else {
        console.error("Failed to deploy container");
      }
    } catch (error) {
      console.error("Error deploying container:", error);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/servers"
          className="inline-flex items-center gap-2 text-[#38BDF8] hover:text-[#0EA5E9] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Servers
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1f2937] to-[#111827] border-2 border-[#38BDF8]/30 flex items-center justify-center">
              <Server className="w-8 h-8 text-[#38BDF8]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white mb-1 mono">{id}</h1>
              <p className="text-[#9CA3AF]">Database Server • 10.0.2.10 • US-EAST-1A</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              SSH Console
            </button>
            <button className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Restart
            </button>
            <button onClick={() => setOpen(true)} className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors flex items-center gap-2">
              <Power className="w-4 h-4"  />
              Shutdown
            </button>
          </div>
        </div>
      </div>

      {/* Containers */}
      <div className="glass-panel rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#38BDF8]" />
            Docker Containers
          </h3>
          <button
            onClick={() => setIsDeployContainerDialogOpen(true)}
            className="text-sm text-[#38BDF8] hover:text-[#0EA5E9] transition-colors"
          >
            + Deploy Container
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {containerList.map((container) => (
            <div
              key={container.id}
              className="bg-[#0B0F17] border border-[#1f2937] rounded-lg p-4 hover:border-[#38BDF8]/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="mono text-sm font-semibold text-white mb-1">{container.id}</div>
                  <div className="text-xs text-[#9CA3AF]">{container.name}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  <span className="text-xs text-[#10B981]">{container.status}</span>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Ports</span>
                  <span className="mono text-white">{container.ports}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">CPU</span>
                  <span className="mono text-[#38BDF8]">{container.cpu}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Memory</span>
                  <span className="mono text-[#38BDF8]">{container.mem} MB</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => handleContainerAction("stop", container.id)}
                  className="py-1.5 bg-[#1f2937] hover:bg-[#1a2332] rounded text-xs text-white transition-colors flex items-center justify-center gap-1"
                >
                  <Square className="w-3 h-3" />
                  Stop
                </button>
                <button
                  onClick={() => handleContainerAction("restart", container.id)}
                  className="py-1.5 bg-[#1f2937] hover:bg-[#1a2332] rounded text-xs text-white transition-colors flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Restart
                </button>
                <button
                  onClick={() => handleContainerAction("kill", container.id)}
                  className="py-1.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 rounded text-xs text-[#EF4444] transition-colors flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3 h-3" />
                  Kill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipelines */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Infrastructure Pipelines</h3>
        <div className="grid grid-cols-3 gap-4">
          {pipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="bg-[#0B0F17] border border-[#1f2937] rounded-lg overflow-hidden hover:border-[#38BDF8]/30 transition-all group"
            >
              <div className="h-32 overflow-hidden relative">
                <img
                  src={pipeline.image}
                  alt={pipeline.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] to-transparent"></div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-2">{pipeline.name}</h4>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      pipeline.status === "success"
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "bg-[#38BDF8]/10 text-[#38BDF8]"
                    }`}
                  >
                    {pipeline.status}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{pipeline.lastRun}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process List */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Active Processes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">PID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">NAME</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">USER</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">CPU %</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">MEM (MB)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">THREADS</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">STATE</th>
              </tr>
            </thead>
            <tbody>
              {processList.map((process) => (
                <tr key={process.pid} className="border-b border-[#1f2937]/50 hover:bg-[#1a2332] transition-colors">
                  <td className="py-3 px-4 mono text-sm text-[#38BDF8]">{process.pid}</td>
                  <td className="py-3 px-4 mono text-sm text-white">{process.name}</td>
                  <td className="py-3 px-4 text-sm text-[#9CA3AF]">{process.user}</td>
                  <td className="py-3 px-4 mono text-sm text-white">{process.cpu}</td>
                  <td className="py-3 px-4 mono text-sm text-[#9CA3AF]">{process.memory}</td>
                  <td className="py-3 px-4 mono text-sm text-[#9CA3AF]">{process.threads}</td>
                  <td className="py-3 px-4 mono text-sm text-[#10B981]">{process.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    <ConfirmDialog
      isOpen={open}
      title="Are you sure that you want to shut down this server?"
      message="All associated data will be removed permanently."
      onConfirm={() => setErrorOpen(true)}    
      onClose={() => setOpen(false)}
    />

    <ErrorDialog
      isOpen={errorOpen}
      onClose={() => setErrorOpen(false)}
      title="Unsupported Operation"
      message="Unable to shutdown the server. Please try to plug out the cable instead."
    />

    <DeployContainerDialog
      isOpen={isDeployContainerDialogOpen}
      onClose={() => setIsDeployContainerDialogOpen(false)}
      onDeploy={deployContainer}
    />

    <ConfirmDialog
      isOpen={containerAction !== null}
      onClose={() => setContainerAction(null)}
      onConfirm={handleConfirmAction}
      {...getActionConfig()}
      confirmText={containerAction?.action === "kill" ? "Force Kill" : "Confirm"}
    />
    </div>
  );
}
