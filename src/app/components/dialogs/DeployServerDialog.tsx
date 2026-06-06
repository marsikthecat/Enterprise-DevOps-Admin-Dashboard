import { useState } from "react";
import { X, Server, Cpu, HardDrive, MapPin } from "lucide-react";
import { ServerInfo } from "../pages/Servers";

interface DeployServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (serverData: Partial<ServerInfo>) => void;
}

export function DeployServerDialog({ isOpen, onClose, onDeploy }: DeployServerDialogProps) {
  const [serverConfig, setServerConfig] = useState({
    id: "",
    type: "web",
    cpu: 4,
    memory: 8,
    storage: 100,
    region: "us-east-1a",
  });

  if (!isOpen) return null;

  const handleDeploy = () => {
    onDeploy(serverConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#38BDF8]/30 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Deploy New Server</h2>
              <p className="text-sm text-[#9CA3AF]">Configure your new infrastructure instance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-[#9CA3AF] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Server Name + Region*/}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Server Name</label>
              <input
                type="text"
                value={serverConfig.id}
                onChange={(e) => setServerConfig({ ...serverConfig, id: e.target.value })}
              placeholder="srv-web-01"
              className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors mono"
            />
            </div>
            <div>
            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#38BDF8]" />
              Region
            </label>
            <select
              value={serverConfig.region}
              onChange={(e) => setServerConfig({ ...serverConfig, region: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors"
            >
              <option value="us-east-1a">US-EAST-1A (Virginia)</option>
              <option value="us-east-1b">US-EAST-1B (Virginia)</option>
              <option value="us-west-1a">US-WEST-1A (California)</option>
              <option value="eu-central-1a">EU-CENTRAL-1A (Frankfurt)</option>
              <option value="ap-southeast-1a">AP-SOUTHEAST-1A (Singapore)</option>
            </select>
            </div>
          </div>

          {/* Server Type */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Server Type</label>
            <div className="grid grid-cols-4 gap-3">
              {["web", "database", "cache", "worker"].map((type) => (
                <button
                  key={type}
                  onClick={() => setServerConfig({ ...serverConfig, type })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    serverConfig.type === type
                      ? "border-[#38BDF8] bg-[#38BDF8]/10"
                      : "border-[#1f2937] bg-[#0B0F17] hover:border-[#38BDF8]/50"
                  }`}
                >
                  <Server className={`w-5 h-5 mx-auto mb-2 ${
                    serverConfig.type === type ? "text-[#38BDF8]" : "text-[#9CA3AF]"
                  }`} />
                  <div className={`text-sm capitalize ${
                    serverConfig.type === type ? "text-[#38BDF8]" : "text-[#9CA3AF]"
                  }`}>
                    {type}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#38BDF8]" />
                CPU Cores
              </label>
              <select
                value={serverConfig.cpu}
                onChange={(e) => setServerConfig({ ...serverConfig, cpu: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors mono"
              >
                <option value="2">2 Cores</option>
                <option value="4">4 Cores</option>
                <option value="8">8 Cores</option>
                <option value="16">16 Cores</option>
                <option value="32">32 Cores</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#10B981]" />
                Memory (GB)
              </label>
              <select
                value={serverConfig.memory}
                onChange={(e) => setServerConfig({ ...serverConfig, memory: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors mono"
              >
                <option value="4">4 GB</option>
                <option value="8">8 GB</option>
                <option value="16">16 GB</option>
                <option value="32">32 GB</option>
                <option value="64">64 GB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#F59E0B]" />
                Storage (GB)
              </label>
              <select
                value={serverConfig.storage}
                onChange={(e) => setServerConfig({ ...serverConfig, storage: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors mono"
              >
                <option value="50">50 GB</option>
                <option value="100">100 GB</option>
                <option value="250">250 GB</option>
                <option value="500">500 GB</option>
                <option value="1000">1 TB</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#1f2937]">
          <div className="text-sm text-[#9CA3AF]">
            Estimated cost: <span className="text-[#38BDF8] mono">$0.42/hour</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeploy}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors"
            >
              Deploy Server
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
