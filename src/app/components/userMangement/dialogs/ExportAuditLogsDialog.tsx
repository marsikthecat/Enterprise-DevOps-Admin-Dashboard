import { useEffect, useState } from "react";
import { Download, FileText, X, Copy, Check } from "lucide-react";
import { useAuditLog } from "../../../hooks/useAuditLog";

interface ExportAuditLogsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportAuditLogsDialog({ isOpen, onClose }: ExportAuditLogsDialogProps) {
  const { auditLogs, loading, fetchAuditLogs, exportAuditLogs } = useAuditLog();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      void fetchAuditLogs();
    }
  }, [fetchAuditLogs, isOpen]);

  if (!isOpen) return null;

  const previewLogs = auditLogs.slice(0, 8);

  const handleCopy = async () => {
    const payload = auditLogs
      .map((entry) => `${entry.timeStamp} | ${entry.action} | ${entry.author}`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 backdrop-blur-sm">
      <div className="w-[760px] max-w-[calc(100vw-32px)] rounded-2xl border border-[#1f2937] bg-[#0B0F17] shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1f2937] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30">
              <FileText className="h-5 w-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Audit Logs</h2>
              <p className="text-sm text-[#9CA3AF]">Security event preview and export</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#9CA3AF] transition-colors hover:bg-[#1f2937] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-xl border border-[#1f2937] bg-[#0F172A]/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-white">Preview</div>
              <div className="text-xs text-[#9CA3AF]">{auditLogs.length} entries</div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-11 animate-pulse rounded-lg bg-[#1f2937]" />
                ))}
              </div>
            ) : previewLogs.length > 0 ? (
              <div className="space-y-2">
                {previewLogs.map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-[#1f2937] bg-[#0B0F17] px-3 py-2">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-white">{entry.action}</span>
                      <span className="text-[11px] text-[#9CA3AF]">{new Date(entry.timeStamp).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-[#9CA3AF]">{entry.author}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#1f2937] bg-[#0B0F17] p-6 text-center text-sm text-[#9CA3AF]">
                No audit log entries yet.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[#1f2937] bg-[#0F172A]/80 p-4">
              <div className="mb-3 text-sm font-medium text-white">Quick stats</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-[#0B0F17] px-3 py-2">
                  <span className="text-xs text-[#9CA3AF]">Total</span>
                  <span className="mono text-sm text-white">{auditLogs.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#0B0F17] px-3 py-2">
                  <span className="text-xs text-[#9CA3AF]">Latest</span>
                  <span className="mono text-xs text-[#38BDF8]">
                    {auditLogs[0] ? new Date(auditLogs[0].timeStamp).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#1f2937] bg-[#0F172A]/80 p-4">
              <div className="mb-3 text-sm font-medium text-white">Export options</div>
              <div className="space-y-2">
                <button
                  onClick={() => exportAuditLogs("csv")}
                  className="flex w-full items-center justify-between rounded-lg border border-[#1f2937] bg-[#0B0F17] px-3 py-2.5 text-sm text-white transition-colors hover:border-[#38BDF8]/40 hover:bg-[#1a2332]"
                >
                  <span className="flex items-center gap-2"><Download className="h-4 w-4 text-[#38BDF8]" />CSV</span>
                  <span className="text-xs text-[#9CA3AF]">.csv</span>
                </button>
                <button
                  onClick={() => exportAuditLogs("json")}
                  className="flex w-full items-center justify-between rounded-lg border border-[#1f2937] bg-[#0B0F17] px-3 py-2.5 text-sm text-white transition-colors hover:border-[#38BDF8]/40 hover:bg-[#1a2332]"
                >
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#38BDF8]" />JSON</span>
                  <span className="text-xs text-[#9CA3AF]">.json</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex w-full items-center justify-between rounded-lg border border-[#1f2937] bg-[#0B0F17] px-3 py-2.5 text-sm text-white transition-colors hover:border-[#10B981]/40 hover:bg-[#1a2332]"
                >
                  <span className="flex items-center gap-2">{copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4 text-[#10B981]" />}Copy to clipboard</span>
                  <span className="text-xs text-[#9CA3AF]">text</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-[#1f2937] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a2332]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
