import { Cloud as CloudIcon, Upload, Download, HardDrive, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { UploadBackupDialog } from "./DeployToCloudDialog";

export interface StorageRegion {
  id: string,
  region: string,
  totalMemory: number,
  usedMemory: number,
  files: number,
  lat: number,
  lng: number
}

export interface Upload {
  id: string,
  fileName: string,
  fileSize: number,
  uploadedAt: string,
  status: string,
}

export function Cloud() {
  const [isUploadBackupDialogOpen, setIsUploadBackupDialogOpen] = useState(false);

  const [storageRegions, setStorageRegion] = useState<StorageRegion[]>([]);
  const [recentUploads, setRecentUploads] = useState<Upload[]>([]);

  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        const [regionsResponse, uploadsResponse] = await Promise.all([
          fetch("http://localhost:3000/regions"),
          fetch("http://localhost:3000/uploads"),
        ]);

        if (regionsResponse.ok) {
          const regions = await regionsResponse.json();
          setStorageRegion(regions);
        }

        if (uploadsResponse.ok) {
          const uploads = await uploadsResponse.json();
          setRecentUploads(uploads);
        }
      } catch (error) {
        console.error("Failed to fetch cloud data:", error);
      }
    };

    fetchCloudData();
  }, []);

  const totalUsedMemory = storageRegions.reduce((sum, region) => sum + region.usedMemory, 0);
  const totalCapacity = storageRegions.reduce((sum, region) => sum + region.totalMemory, 0);
  const totalFiles = storageRegions.reduce((sum, region) => sum + region.files, 0);
  const totalUploadSize = recentUploads.reduce((sum, upload) => sum + (upload.fileSize || 0), 0);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">Cloud Storage</h1>
          <p className="text-[#9CA3AF]">Manage distributed storage and backups</p>
        </div>
        <button
          onClick={() => setIsUploadBackupDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Backup
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <HardDrive className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{totalUsedMemory.toFixed(1)} TB</div>
          <div className="text-sm text-[#9CA3AF]">Total Used</div>
          <div className="mt-2">
            <div className="bg-[#1f2937] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[#38BDF8] rounded-full"
                style={{ width: `${totalCapacity > 0 ? (totalUsedMemory / totalCapacity) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
            <CloudIcon className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{totalFiles.toLocaleString()}</div>
          <div className="text-sm text-[#9CA3AF]">Total Files</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{recentUploads.length}</div>
          <div className="text-sm text-[#9CA3AF]">Uploads Today</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Download className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{totalUploadSize.toFixed(1)} GB</div>
          <div className="text-sm text-[#9CA3AF]">Bandwidth Used</div>
        </div>
      </div>

      {/* World Map Visualization */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Global Storage Distribution</h3>
        <div className="bg-[#0B0F17] rounded-lg p-8 relative h-[400px]">
          {/* Simple world map visualization */}
          <svg className="w-full h-full opacity-20">
            <rect x="10%" y="20%" width="80%" height="60%" fill="none" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="35%" cy="35%" r="3" fill="#38BDF8" opacity="0.5" />
            <circle cx="25%" cy="40%" r="3" fill="#38BDF8" opacity="0.5" />
            <circle cx="55%" cy="30%" r="3" fill="#38BDF8" opacity="0.5" />
            <circle cx="75%" cy="35%" r="3" fill="#38BDF8" opacity="0.5" />
          </svg>

          {/* Region markers */}
          {storageRegions.map((region, i) => (
            <div
              key={region.region}
              className="absolute"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + (i % 2) * 20}%`,
              }}
            >
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-[#38BDF8]/20 border-2 border-[#38BDF8] flex items-center justify-center animate-pulse cursor-pointer hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-[#38BDF8]" />
                </div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-48 bg-[#111827] border border-[#38BDF8]/30 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="text-sm font-semibold text-white mb-2">{region.region}</div>
                  <div className="space-y-1 text-xs text-[#9CA3AF]">
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span className="mono text-[#38BDF8]">{region.usedMemory} TB / {region.totalMemory} TB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Files:</span>
                      <span className="mono text-white">{region.files.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage by Region */}
      <div className="grid grid-cols-4 gap-4">
        {storageRegions.map((region) => (
          <div key={region.region} className="glass-panel rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-[#38BDF8]" />
              <h4 className="text-sm font-semibold text-white">{region.region}</h4>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-1">
                <span className="mono text-2xl font-semibold text-white">{region.usedMemory}</span>
                <span className="text-sm text-[#9CA3AF]">/ {region.totalMemory} TB</span>
              </div>
              <div className="bg-[#1f2937] rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] rounded-full"
                  style={{ width: `${(region.usedMemory / region.totalMemory) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-[#9CA3AF]">
              {region.files.toLocaleString()} files stored
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {recentUploads.map((upload, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-[#0B0F17] rounded-lg hover:bg-[#1a2332] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mono text-sm text-white truncate">{upload.fileName}</div>
                  <div className="text-xs text-[#9CA3AF]">{upload.uploadedAt}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="mono text-sm text-[#9CA3AF]">{upload.fileSize}</span>
                {upload.status === "complete" ? (
                  <span className="text-xs text-[#10B981] px-2 py-1 bg-[#10B981]/10 rounded-full">
                    Complete
                  </span>
                ) : (
                  <span className="text-xs text-[#38BDF8] px-2 py-1 bg-[#38BDF8]/10 rounded-full flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse"></div>
                    Syncing
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <UploadBackupDialog
        isOpen={isUploadBackupDialogOpen}
        onClose={() => setIsUploadBackupDialogOpen(false)}
      />
    </div>
  );
}
