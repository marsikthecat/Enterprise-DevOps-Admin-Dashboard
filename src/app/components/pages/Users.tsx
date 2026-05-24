import { Users as UsersIcon, UserPlus, Shield, Key, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { RotateAPIKeysDialog } from "../dialogs/RotateApiKeysDialog";

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@ops.dev",
    role: "Admin",
    status: "active",
    lastLogin: "2 min ago",
    sessions: 2,
    avatar: "AJ",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@ops.dev",
    role: "DevOps Engineer",
    status: "active",
    lastLogin: "1 hour ago",
    sessions: 1,
    avatar: "BS",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@ops.dev",
    role: "Developer",
    status: "active",
    lastLogin: "3 hours ago",
    sessions: 3,
    avatar: "CW",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@ops.dev",
    role: "Security",
    status: "active",
    lastLogin: "5 min ago",
    sessions: 1,
    avatar: "DL",
  },
  {
    id: 5,
    name: "Emma Davis",
    email: "emma@ops.dev",
    role: "Developer",
    status: "inactive",
    lastLogin: "2 days ago",
    sessions: 0,
    avatar: "ED",
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank@ops.dev",
    role: "DevOps Engineer",
    status: "active",
    lastLogin: "30 min ago",
    sessions: 1,
    avatar: "FM",
  },
];

const roleColors = {
  Admin: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
  "DevOps Engineer": "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30",
  Developer: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
  Security: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
};

export function Users() {
  
  const [isRotateKeysDialogOpen, setIsRotateKeysDialogOpen] = useState(false);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">User Management</h1>
          <p className="text-[#9CA3AF]">Manage users, roles, and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <UsersIcon className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">24</div>
          <div className="text-sm text-[#9CA3AF]">Total Users</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
            <UsersIcon className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">18</div>
          <div className="text-sm text-[#9CA3AF]">Active Now</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">4</div>
          <div className="text-sm text-[#9CA3AF]">Admin Roles</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Key className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">42</div>
          <div className="text-sm text-[#9CA3AF]">Active Sessions</div>
        </div>
      </div>

      {/* User Table */}
      <div className="glass-panel rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">USER</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">ROLE</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">STATUS</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">LAST LOGIN</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">SESSIONS</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-[#9CA3AF]">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#1f2937]/50 hover:bg-[#1a2332] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-sm font-semibold text-white">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-[#9CA3AF] mono">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs border ${
                        roleColors[user.role as keyof typeof roleColors]
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : "bg-[#9CA3AF]/10 text-[#9CA3AF]"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "active" ? "bg-[#10B981]" : "bg-[#9CA3AF]"
                        }`}
                      ></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-[#9CA3AF]">{user.lastLogin}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-white">{user.sessions}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-[#1f2937] rounded transition-colors text-[#9CA3AF] hover:text-[#38BDF8]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[#1f2937] rounded transition-colors text-[#9CA3AF] hover:text-[#EF4444]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions & Security */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#38BDF8]" />
            Role Permissions
          </h3>
          <div className="space-y-3">
            {Object.entries(roleColors).map(([role, colorClass]) => (
              <div key={role} className="p-3 bg-[#0B0F17] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm px-2 py-1 rounded-full border ${colorClass}`}>{role}</span>
                  <button className="text-xs text-[#38BDF8] hover:text-[#0EA5E9]">Edit</button>
                </div>
                <div className="text-xs text-[#9CA3AF] space-y-1">
                  <div>• Read/Write access to servers</div>
                  <div>• Deploy permissions</div>
                  {role === "Admin" && <div>• User management access</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-[#F59E0B]" />
            Security Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-[#0B0F17] hover:bg-[#1a2332] rounded-lg text-left transition-colors"
             onClick={() => setIsRotateKeysDialogOpen(true)}>
              <div className="text-sm text-white mb-1">Rotate API Keys</div>
              <div className="text-xs text-[#9CA3AF]">Last rotated 30 days ago</div>
            </button>
            <button className="w-full p-3 bg-[#0B0F17] hover:bg-[#1a2332] rounded-lg text-left transition-colors">
              <div className="text-sm text-white mb-1">Revoke All Sessions</div>
              <div className="text-xs text-[#9CA3AF]">Force re-authentication for all users</div>
            </button>
            <button className="w-full p-3 bg-[#0B0F17] hover:bg-[#1a2332] rounded-lg text-left transition-colors">
              <div className="text-sm text-white mb-1">Export Audit Logs</div>
              <div className="text-xs text-[#9CA3AF]">Download security event history</div>
            </button>
            <button className="w-full p-3 bg-[#0B0F17] hover:bg-[#1a2332] rounded-lg text-left transition-colors">
              <div className="text-sm text-white mb-1">2FA Enforcement</div>
              <div className="text-xs text-[#9CA3AF]">Require for all admin accounts</div>
            </button>
          </div>
        </div>
      </div>

      <RotateAPIKeysDialog
        isOpen={isRotateKeysDialogOpen}
        onClose={() => setIsRotateKeysDialogOpen(false)}
      />
    </div>
  );
}
