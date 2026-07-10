import { useState } from "react";
import { X, UserPlus, Mail } from "lucide-react";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const roles = ["Admin", "DevOps Engineer", "Developer", "Security", "Viewer"];

export function AddUserDialog({ isOpen, onClose, onSuccess }: AddUserDialogProps) {
  const [userConfig, setUserConfig] = useState({
    name: "",
    email: "",
    role: "Developer",
  });

  if (!isOpen) return null;

  const handleAdd = () => {
    console.log("Adding user:", userConfig);
    onSuccess(userConfig.email);
    setUserConfig({ name: "", email: "", role: "Developer" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#38BDF8]/30 rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add New User</h2>
              <p className="text-sm text-[#9CA3AF]">Invite a user to your organization</p>
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
            <input
              type="text"
              value={userConfig.name}
              onChange={(e) => setUserConfig({ ...userConfig, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
            <input
              type="email"
              value={userConfig.email}
              onChange={(e) => setUserConfig({ ...userConfig, email: e.target.value })}
              placeholder="john@ops.dev"
              className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Role</label>
            <select
              value={userConfig.role}
              onChange={(e) => setUserConfig({ ...userConfig, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0B0F17] border border-[#1f2937] rounded-lg text-white focus:border-[#38BDF8] focus:outline-none transition-colors"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-[#38BDF8]/5 border border-[#38BDF8]/30 rounded-lg flex gap-3">
            <Mail className="w-5 h-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#9CA3AF]">
              An invitation email will be sent to{" "}
              <span className="text-[#38BDF8]">{userConfig.email || "the user"}</span> with
              instructions to set up their account.
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
            onClick={handleAdd}
            disabled={!userConfig.name || !userConfig.email}
            className={`px-4 py-2 rounded-lg transition-colors ${
              userConfig.name && userConfig.email
                ? "bg-[#38BDF8] hover:bg-[#0EA5E9] text-white"
                : "bg-[#1f2937] text-[#9CA3AF] cursor-not-allowed"
            }`}
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}