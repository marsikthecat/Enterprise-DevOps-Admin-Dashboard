import { Users as UsersIcon, UserPlus, Shield, Key, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { RotateAPIKeysDialog } from "./dialogs/RotateApiKeysDialog";
import { AddUserDialog } from "./dialogs/AddUserDialog";
import { ConfirmDialog } from "../../common/dialogs/ConfirmDialog";
import { EditUserDialog } from "./dialogs/EditUserDialog";
import { SuccessDialog } from "../../common/dialogs/SuccessDialog";
import { RoleManagementDialog } from "./dialogs/RoleManagementDialog";


const roleColors = {
  Admin: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
  "DevOps Engineer": "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30",
  Developer: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
  Security: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  lastLogin: string;
  sessions: number;
  avatar: string;
}

export interface Role {
  id: string | number;
  name: string;
  category?: string;
  permissions: Permission[];
  editable: boolean;
}

export interface Permission {
  id: string;
  name: string;
  category: string;
}

interface RoleDialogProps {
  isOpen: boolean;
  selectedRole: Role | null;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRotateKeysDialogOpen, setIsRotateKeysDialogOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<typeof users[0] | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [roleManagementOpen, setRoleManagementOpen] = useState<RoleDialogProps>({ isOpen: false, selectedRole: null });

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting user:", userToDelete);
    setUserToDelete(null);
  };

  const handleEditClick = (user: typeof users[0]) => {
    setUserToEdit(user);
    setEditUserDialogOpen(true);
  };

  const handleAddUserSuccess = (email: string) => {
    setInvitedEmail(email);
    setSuccessDialogOpen(true);
  };

  const handleEditUserSave = (userData: any) => {
    console.log("Saving user:", userData);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          fetch("http://localhost:3000/users"),
          fetch("http://localhost:3000/roles"),
        ]);

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        if (rolesResponse.ok) {
          setRoles(await rolesResponse.json());
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1">User Management</h1>
          <p className="text-[#9CA3AF]">Manage users, roles, and permissions</p>
        </div>
        <button 
          onClick={() => setAddUserDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors">
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
          <div className="mono text-3xl font-semibold text-white mb-1">{users.length}</div>
          <div className="text-sm text-[#9CA3AF]">Total Users</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
            <UsersIcon className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{users.filter(u => u.status === 'active').length}</div>
          <div className="text-sm text-[#9CA3AF]">Active Now</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{users.filter((u) => u.role?.name === 'Admin').length}</div>
          <div className="text-sm text-[#9CA3AF]">Admin Roles</div>
        </div>

        <div className="stat-card rounded-lg p-5">
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center mb-3">
            <Key className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="mono text-3xl font-semibold text-white mb-1">{users.reduce((sum, u) => sum + u.sessions, 0)}</div>
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#9CA3AF]">
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
                          roleColors[(user.role?.name ?? "Developer") as keyof typeof roleColors] || "bg-[#9CA3AF]/10 text-[#9CA3AF]"
                        }`}
                      >
                        {user.role?.name ?? "Developer"}
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
                      <span className="text-sm text-[#9CA3AF]">{formatDate(user.lastLogin)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="mono text-sm text-white">{user.sessions}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="p-2 hover:bg-[#1f2937] rounded transition-colors text-[#9CA3AF] hover:text-[#38BDF8]">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-[#1f2937] rounded transition-colors text-[#9CA3AF] hover:text-[#EF4444]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
            {roles.length > 0 ? roles.map((role) => {
              const colorClass = roleColors[role.name as keyof typeof roleColors] || "bg-[#9CA3AF]/10 text-[#9CA3AF] border-[#9CA3AF]/30";
              return (
                <div key={role.id} className="p-3 bg-[#0B0F17] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm px-2 py-1 rounded-full border ${colorClass}`}>{role.name}</span>
                    <button
                      onClick={() => setRoleManagementOpen({ isOpen: true, selectedRole: role })}
                      className="text-xs text-[#38BDF8] hover:text-[#0EA5E9]">Edit</button>
                  </div>
                  <div className="text-xs text-[#9CA3AF] space-y-1">
                    <div>• {role.permissions?.length ?? 0} permissions configured</div>
                    <div>• {users.filter((user) => user.role?.id === role.id).length} assigned users</div>
                  </div>
                </div>
              );
            }) : Object.entries(roleColors).map(([role, colorClass]) => (
              <div key={role} className="p-3 bg-[#0B0F17] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm px-2 py-1 rounded-full border ${colorClass}`}>{role}</span>
                  <button 
                    onClick={() => setRoleManagementOpen({ isOpen: true, selectedRole: null })}
                    className="text-xs text-[#38BDF8] hover:text-[#0EA5E9]">Edit</button>
                </div>
                <div className="text-xs text-[#9CA3AF] space-y-1">
                  <div>• Read/Write access to servers</div>
                  <div>• Deploy permissions</div>
                  {role === "Admin" && <div>• User management access</div>}
                </div>
              </div>
            ))}            <button
              onClick={() => setRoleManagementOpen({ isOpen: true, selectedRole: null })}
              className="w-full p-3 bg-[#0B0F17] hover:bg-[#1a2332] rounded-lg text-left transition-colors border-2 border-dashed border-[#1f2937] hover:border-[#38BDF8]/50"
            >
              <div className="text-sm text-[#38BDF8] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Manage All Roles
              </div>
            </button>
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

      <AddUserDialog
        isOpen={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        onSuccess={handleAddUserSuccess}
      />

      <EditUserDialog
        isOpen={editUserDialogOpen}
        onClose={() => setEditUserDialogOpen(false)}
        onSave={handleEditUserSave}
        user={userToEdit}
      />

      <RotateAPIKeysDialog
        isOpen={isRotateKeysDialogOpen}
        onClose={() => setIsRotateKeysDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This will revoke all access permissions and remove the user from all projects. This action cannot be undone."
        confirmText="Delete User"
        cancelText="Keep User"
        variant="danger"
        icon="warning"
      />

      <SuccessDialog
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="Invitation Sent"
        message={`An invitation link has been sent to ${invitedEmail}. The user will receive an email with instructions to set up their account and join your organization.`}
        details="The invitation link will expire in 7 days."
      />

      <RoleManagementDialog
        isOpen={roleManagementOpen.isOpen}
        onClose={() => setRoleManagementOpen({ isOpen: false, selectedRole: null })}
        roles={roles}
        selectedRole={roleManagementOpen.selectedRole}
      />
    </div>
  );
}