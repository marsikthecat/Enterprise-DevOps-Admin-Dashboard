const API_BASE_URL = "http://localhost:3000";
import type { Alert, AuditLogEntry, Container, FileUpload, Permission, Process, Role, StorageRegion, User, Vulnerability } from "../types";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) as T : undefined as T;
}

export const api = {
  getServers: () => request<Record<string, unknown>[]>("/servers"),
  createServer: (server: Record<string, unknown>) => request<Record<string, unknown>>("/servers", {
    method: "POST",
    body: server,
  }),

  getContainers: (serverId: string) => request<Container[]>(`/servers/${serverId}/containers`),
  deployContainer: (serverId: string, container: Record<string, unknown>) => request<Container>(`/servers/${serverId}/containers`, {
    method: "POST",
    body: container,
  }),
  changeContainerState: (serverId: string, containerId: string, action: "stop" | "restart") => request<{
    container: Container;
    processes: Process[];
  }>(`/servers/${serverId}/containers/${containerId}/action`, {
    method: "PATCH",
    body: { action },
  }),

  getProcesses: () => request<Process[]>("/processes"),
  getServerProcesses: (serverId: string) => request<Process[]>(`/servers/${serverId}/processes`),

  getUsers: () => request<User[]>("/users"),
  deleteUser: (userId: string) => request<void>(`/users/${userId}`, { method: "DELETE" }),
  getRoles: () => request<Role[]>("/roles"),
  createRole: (name: string) => request<Role>("/roles", {
    method: "POST",
    body: { name },
  }),
  updateRole: (roleId: string | number, permissions: Array<Omit<Permission, "id">>) => request<Role>(`/roles/${roleId}`, {
    method: "PATCH",
    body: { permissions },
  }),
  deleteRole: (roleId: string | number) => request<void>(`/roles/${roleId}`, { method: "DELETE" }),
  getUser: (userId: string) => request<Record<string, unknown>>(`/users/${userId}`),

  getAlerts: () => request<Alert[]>("/alerts"),
  getVulnerabilities: () => request<Vulnerability[]>("/vulnerabilities"),
  getRegions: () => request<StorageRegion[]>("/regions"),
  getUploads: () => request<FileUpload[]>("/uploads"),
  getPermissions: () => request<Record<string, unknown>[]>("/permissions"),
  getPipelines: () => request<Record<string, unknown>[]>("/pipelines"),

  getAuditLogs: () => request<AuditLogEntry[]>("/auditLogs"),
  addAuditLog: (entry: { action: string; author: string }) => request<AuditLogEntry>("/auditLogs", {
    method: "POST",
    body: entry,
  }),
};

export function useApi() {
  return api;
}
