import { useCurrentUser } from "./useCurrentUser";

export function usePermissions() {
  const { role, permissions = [] } = useCurrentUser();

  return {
    role,
    permissions,
    can: (permission: string) => permissions.includes(permission),
  };
}