export interface Process {
  pid: number;
  id: string;
  serverId: string;
  user: string;
  cpu: number;
  memory: number;
  threads: number;
  status: string;
  uptime: string;
  name: string;
  createdAt: string;
}

export interface Container {
  id: string;
  image: string;
  status: string;
  ports: string;
}

export interface StorageRegion {
  id: string;
  region: string;
  totalMemory: number;
  usedMemory: number;
  files: number;
  lat: number;
  lng: number;
}

export interface FileUpload {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  time: string;
  status: "open" | "investigating" | "resolved";
}

export interface Vulnerability {
  package: string;
  version: string;
  severity: "high" | "medium" | "low";
  cve: string;
  serverCount: number;
}

export interface Permission {
  id: string;
  key?: string;
  name: string;
  category: string;
}

export interface Role {
  id: string | number;
  name: string;
  category?: string;
  permissions: Permission[];
  editable: boolean;
}

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

export interface AuditLogEntry {
  id: string;
  timeStamp: string;
  action: string;
  author: string;
}
