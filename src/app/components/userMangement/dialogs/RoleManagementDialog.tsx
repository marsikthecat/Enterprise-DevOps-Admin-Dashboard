import { useEffect, useState } from "react";
import { X, Shield, Plus, Trash2, Check } from "lucide-react";
import type { Permission, Role } from "../../../types";

interface RoleManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  selectedRole: Role | null;
  onDeleteRole: (role: Role) => void;
  onCreateRole: (name: string) => Promise<Role>;
  onUpdateRole: (role: Role) => Promise<Role>;
}

type ManagedRole = Role & { userCount?: number };

const allPermissions: Permission[] = [
  { id: "servers.read", name: "View Servers", category: "Servers" },
  { id: "servers.write", name: "Manage Servers", category: "Servers" },
  { id: "servers.deploy", name: "Deploy Servers", category: "Servers" },
  { id: "servers.delete", name: "Delete Servers", category: "Servers" },
  { id: "containers.read", name: "View Containers", category: "Containers" },
  { id: "containers.write", name: "Manage Containers", category: "Containers" },
  { id: "containers.deploy", name: "Deploy Containers", category: "Containers" },
  { id: "network.read", name: "View Network", category: "Network" },
  { id: "network.write", name: "Configure Network", category: "Network" },
  { id: "users.read", name: "View Users", category: "Users" },
  { id: "users.write", name: "Manage Users", category: "Users" },
  { id: "users.delete", name: "Delete Users", category: "Users" },
  { id: "security.read", name: "View Security", category: "Security" },
  { id: "security.write", name: "Manage Security", category: "Security" },
  { id: "cloud.read", name: "View Cloud Storage", category: "Cloud" },
  { id: "cloud.write", name: "Manage Cloud Storage", category: "Cloud" },
];

export function RoleManagementDialog({ isOpen, onClose, roles: initialRoles, selectedRole, onDeleteRole, onCreateRole, onUpdateRole }: RoleManagementDialogProps) {
  const [roles, setRoles] = useState<ManagedRole[]>([]);
  const [editingRole, setEditingRole] = useState<string | number | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const mappedRoles = initialRoles.map((role) => ({
      ...role,
      userCount: 0,
      editable: role.editable ?? true,
      permissions: role.permissions ?? [],
    }));

    setRoles(mappedRoles);
    setEditingRole(selectedRole?.id ?? mappedRoles[0]?.id ?? null);
    setIsAddingRole(false);
    setNewRoleName("");
  }, [isOpen, initialRoles, selectedRole]);

  if (!isOpen) return null;

  const togglePermission = (roleId: string | number, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.some((permission) => (permission.key ?? permission.id) === permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter((permission) => (permission.key ?? permission.id) !== permissionId)
            : [...role.permissions, allPermissions.find(p => p.id === permissionId)!],
        };
      }
      return role;
    }));
  };

  const handleSaveAndClose = async () => {
    const role = roles.find((managedRole) => managedRole.id === editingRole);
    if (!role) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateRole(role);
      onClose();
    } catch (error) {
      console.error("Failed to update role permissions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRole = async () => {
    const name = newRoleName.trim();
    if (!name) return;

    try {
      const newRole = await onCreateRole(name);
      setRoles((currentRoles) => [...currentRoles, { ...newRole, userCount: 0 }]);
      setNewRoleName("");
      setIsAddingRole(false);
      setEditingRole(newRole.id);
    } catch (error) {
      console.error("Failed to create role:", error);
    }
  };

  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const isPermissionInRole = (permission: Permission, managedRole: ManagedRole) => {
    const permissionsOfRole = managedRole.permissions;
    for (let i = 0; i < permissionsOfRole.length; i++) {
      const e = permissionsOfRole[i];
      if ((e.key ?? e.id) === permission.id) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111827] border border-[#38BDF8]/30 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Role Management</h2>
              <p className="text-sm text-[#9CA3AF]">Configure roles and permissions</p>
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
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-3 h-full">
            {/* Roles List */}
            <div className="border-r border-[#1f2937] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Roles</h3>
                <button
                  onClick={() => setIsAddingRole(true)}
                  className="p-1.5 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#38BDF8]" />
                </button>
              </div>

              {/* Add Role Form */}
              {isAddingRole && (
                <div className="mb-3 p-3 bg-[#0B0F17] border border-[#38BDF8]/30 rounded-lg">
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="New role name"
                    className="w-full px-3 py-2 bg-[#111827] border border-[#1f2937] rounded text-white text-sm mb-2 focus:border-[#38BDF8] focus:outline-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddRole}
                      className="flex-1 px-3 py-1.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded text-sm"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingRole(false);
                        setNewRoleName("");
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Roles */}
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      editingRole === role.id
                        ? "border-[#38BDF8] bg-[#38BDF8]/5"
                        : "border-[#1f2937] bg-[#0B0F17] hover:border-[#38BDF8]/50"
                    }`}
                    onClick={() => setEditingRole(role.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-white text-sm">{role.name}</div>
                      {role.editable && editingRole === role.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRole(role);
                          }}
                          className="p-1 hover:bg-[#EF4444]/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-[#EF4444]" />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {role.permissions.length} permissions • {role.userCount} users
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions Grid */}
            <div className="col-span-2 p-6 overflow-auto">
              {editingRole ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Edit Permissions: {roles.find(r => r.id === editingRole)?.name}
                    </h3>
                    <p className="text-sm text-[#9CA3AF]">
                      Select which permissions this role should have
                    </p>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      <div key={category}>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-1 h-4 bg-[#38BDF8] rounded"></div>
                          {category}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {permissions.map((permission) => {
                            const role = roles.find(r => r.id === editingRole);
                            const isChecked = isPermissionInRole(permission, role!);
                            const isDisabled = !role?.editable;

                            return (
                              <button
                                key={permission.id}
                                onClick={() => !isDisabled && togglePermission(editingRole, permission.id)}
                                disabled={isDisabled}
                                className={`p-3 rounded-lg border-2 text-left transition-all ${
                                  isChecked
                                    ? "border-[#38BDF8] bg-[#38BDF8]/10"
                                    : "border-[#1f2937] bg-[#0B0F17] hover:border-[#38BDF8]/50"
                                } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                    isChecked
                                      ? "border-[#38BDF8] bg-[#38BDF8]"
                                      : "border-[#1f2937]"
                                  }`}>
                                    {isChecked && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className={`text-sm ${isChecked ? "text-white" : "text-[#9CA3AF]"}`}>
                                    {permission.name}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                    <p className="text-[#9CA3AF]">Select a role to edit permissions</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1f2937] bg-[#0B0F17]">
          <button
            onClick={handleSaveAndClose}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors"
          >
            {isSaving ? "Saving..." : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
}