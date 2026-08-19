import { useRef, useState } from "react";
import { X, Upload, FileArchive, CheckCircle } from "lucide-react";

interface UploadBackupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function UploadBackupDialog({ isOpen, onClose, onSubmit }: UploadBackupDialogProps) {
  const [uploadConfig, setUploadConfig] = useState({
    appName: "",
    version: "",
    region: "us-east",
    compression: "gzip",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const [file] = Array.from(e.dataTransfer.files);
    if (file) setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(e.target.files ?? []);
    if (file) setSelectedFile(file);
    e.target.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#38BDF8]/30 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Upload Application Backup</h2>
              <p className="text-sm text-[#9CA3AF]">Upload and store your application backup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-[#9CA3AF] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 transition-all ${
              isDragging
                ? "border-[#38BDF8] bg-[#38BDF8]/5"
                : selectedFile
                ? "border-[#10B981] bg-[#10B981]/5"
                : "border-[#1f2937] hover:border-[#38BDF8]/50"
            }`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              {selectedFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <div className="mono text-sm text-white mb-2">{selectedFile.name}</div>
                  <div className="text-xs text-[#9CA3AF] mb-4">
                    {(selectedFile.size / (1024 ** 3)).toFixed(2)} GB • Ready to upload
                  </div>
                  <button
                    onClick={openFilePicker}
                    className="text-sm text-[#38BDF8] hover:text-[#0EA5E9]"
                  >
                    Change File
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#38BDF8]/10 flex items-center justify-center mb-4">
                    <FileArchive className="w-8 h-8 text-[#38BDF8]" />
                  </div>
                  <div className="text-white mb-2">Drop your backup file here</div>
                  <div className="text-sm text-[#9CA3AF] mb-4">or click to browse</div>
                  <button
                    onClick={openFilePicker}
                    className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors text-sm"
                  >
                    Select File
                  </button>
                  <div className="text-xs text-[#9CA3AF] mt-3">
                    Supported: .tar.gz, .zip, .tar, .7z (Max 10GB)
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Application Name</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".tar.gz,.zip,.tar,.7z,application/gzip,application/zip,application/x-7z-compressed"
                onChange={handleFileChange}
                className="sr-only"
              />
              <input
                type="text"
                value={uploadConfig.appName}
                onChange={(e) => setUploadConfig({ ...uploadConfig, appName: e.target.value })}
                placeholder="my-app"
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Version</label>
              <input
                type="text"
                value={uploadConfig.version}
                onChange={(e) => setUploadConfig({ ...uploadConfig, version: e.target.value })}
                placeholder="v2.4.1"
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Storage Region</label>
              <select
                value={uploadConfig.region}
                onChange={(e) => setUploadConfig({ ...uploadConfig, region: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors"
              >
                <option value="us-east">US-EAST (Virginia)</option>
                <option value="us-west">US-WEST (California)</option>
                <option value="eu-central">EU-CENTRAL (Frankfurt)</option>
                <option value="asia-pacific">ASIA-PACIFIC (Singapore)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Compression</label>
              <select
                value={uploadConfig.compression}
                onChange={(e) => setUploadConfig({ ...uploadConfig, compression: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors"
              >
                <option value="gzip">GZIP</option>
                <option value="bzip2">BZIP2</option>
                <option value="lz4">LZ4</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[#1f2937] bg-[#0B0F17] text-[#38BDF8] focus:ring-[#38BDF8]"
              />
              <span className="text-sm text-white">Encrypt backup with AES-256</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-[#1f2937] bg-[#0B0F17] text-[#38BDF8] focus:ring-[#38BDF8]"
              />
              <span className="text-sm text-white">Verify integrity after upload</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[#1f2937] bg-[#0B0F17] text-[#38BDF8] focus:ring-[#38BDF8]"
              />
              <span className="text-sm text-white">Replicate to all regions</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1f2937]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFile
                ? "bg-[#38BDF8] hover:bg-[#0EA5E9] text-white"
                : "bg-[#1f2937] text-[#9CA3AF] cursor-not-allowed"
            }`}
          >
            Upload Backup
          </button>
        </div>
      </div>
    </div>
  );
}
