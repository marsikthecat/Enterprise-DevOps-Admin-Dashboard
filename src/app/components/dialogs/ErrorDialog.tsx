import { AlertCircle, X, RefreshCw, Bug } from "lucide-react";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  errorCode?: string;
  details?: string;
  onRetry?: () => void;
  showDetails?: boolean;
}

export function ErrorDialog({
  isOpen,
  onClose,
  title = "Error",
  message,
  errorCode,
  details,
  onRetry,
  showDetails = false,
}: ErrorDialogProps) {
  if (!isOpen) return null;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#EF4444]/30 rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              {errorCode && (
                <p className="text-sm text-[#9CA3AF] mono">Error Code: {errorCode}</p>
              )}
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
          {/* Main Error Message */}
          <div className="p-4 bg-[#EF4444]/5 border border-[#EF4444]/30 rounded-lg">
            <p className="text-white leading-relaxed">{message}</p>
          </div>

          {/* Details */}
          {showDetails && details && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-sm font-semibold text-white">Technical Details</span>
              </div>
              <div className="p-3 bg-[#0B0F17] border border-[#1f2937] rounded-lg">
                <pre className="text-xs text-[#9CA3AF] mono overflow-x-auto whitespace-pre-wrap">
                  {details}
                </pre>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-sm text-[#9CA3AF]">
            If this problem persists, please contact support with the error code above.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1f2937]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors"
          >
            Close
          </button>
          {onRetry && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}