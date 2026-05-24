import { AlertTriangle, HelpCircle, Info, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "danger" | "info";
  icon?: "warning" | "question" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  icon = "warning",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    warning: {
      border: "border-[#F59E0B]/30",
      iconBg: "bg-[#F59E0B]/10",
      iconColor: "text-[#F59E0B]",
      button: "bg-[#F59E0B] hover:bg-[#D97706]",
    },
    danger: {
      border: "border-[#EF4444]/30",
      iconBg: "bg-[#EF4444]/10",
      iconColor: "text-[#EF4444]",
      button: "bg-[#EF4444] hover:bg-[#DC2626]",
    },
    info: {
      border: "border-[#38BDF8]/30",
      iconBg: "bg-[#38BDF8]/10",
      iconColor: "text-[#38BDF8]",
      button: "bg-[#38BDF8] hover:bg-[#0EA5E9]",
    },
  };

  const style = variantStyles[variant];

  const IconComponent =
    icon === "warning" ? AlertTriangle : icon === "question" ? HelpCircle : Info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`bg-[#111827] border ${style.border} rounded-xl shadow-2xl w-full max-w-md`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center`}>
              <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-[#9CA3AF] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#9CA3AF] leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1f2937]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button onClick={handleConfirm} className={`px-4 py-2 ${style.button} text-white rounded-lg transition-colors`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}