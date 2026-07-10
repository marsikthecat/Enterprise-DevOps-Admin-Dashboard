import { X, Key, AlertTriangle } from "lucide-react";

interface RotateAPIKeysDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RotateAPIKeysDialog({ isOpen, onClose }: RotateAPIKeysDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    console.log("Rotating API keys...");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#F59E0B]/30 rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Rotate API Keys</h2>
              <p className="text-sm text-[#9CA3AF]">Confirm security action</p>
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
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/30 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-white mb-1">Important Security Action</div>
              <div className="text-sm text-[#9CA3AF]">
                This action will immediately invalidate all existing API keys and generate new ones.
              </div>
            </div>
          </div>

          {/* Impact Info */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">What will happen:</div>
            <ul className="space-y-2 text-sm text-[#9CA3AF]">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 flex-shrink-0"></div>
                <span>All current API keys will be immediately revoked</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 flex-shrink-0"></div>
                <span>New API keys will be generated and displayed once</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 flex-shrink-0"></div>
                <span>Active API integrations will stop working until updated</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 flex-shrink-0"></div>
                <span>An audit log entry will be created</span>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#0B0F17] rounded-lg">
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1">Active Keys</div>
              <div className="mono text-xl font-semibold text-white">128</div>
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1">Last Rotated</div>
              <div className="text-sm text-white">30 days ago</div>
            </div>
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
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors"
          >
            Proceed with Rotation
          </button>
        </div>
      </div>
    </div>
  );
}