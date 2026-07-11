import { 
  Cloud as CloudIcon, 
  Upload, 
  Download, 
  HardDrive, 
  Globe, } from "lucide-react";
import { useEffect, useState } from "react";
import { UploadBackupDialog } from "./DeployToCloudDialog";
import { WorldMap } from "./parts/WorldMap";

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

      {/* Real World Map */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Global Storage Distribution</h3>
        {WorldMap(storageRegions)}
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