import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    name: "Alice Johnson",
    email: "alice@ops.dev",
    role: "Admin",
    status: "active",
    avatar: "AJ",
  },
  {
    name: "Bob Smith",
    email: "bob@ops.dev",
    role: "DevOps Engineer",
    status: "active",
    avatar: "BS",
  },
  {
    name: "Carol White",
    email: "carol@ops.dev",
    role: "Developer",
    status: "active",
    avatar: "CW",
  },
  {
    name: "David Lee",
    email: "david@ops.dev",
    role: "Security",
    status: "active",
    avatar: "DL",
  },
  {
    name: "Emma Davis",
    email: "emma@ops.dev",
    role: "Developer",
    status: "inactive",
    avatar: "ED",
  },
  {
    name: "Frank Miller",
    email: "frank@ops.dev",
    role: "DevOps Engineer",
    status: "active",
    avatar: "FM",
  },
];

const servers = [
  {
    id: "srv-web-01",
    type: "Web Server",
    status: "healthy",
    cpu: 45,
    memory: 62,
    disk: 48,
    network: "2.4 GB/s",
    uptime: "142d 8h",
    location: "US-EAST-1A",
    ipAddress: "10.0.1.24",
    containers: [
      { id: "cnt-web-01", image: "nginx:latest", ports: "80:80, 443:443", status: "running", cpu: 8, memory: 124 },
      { id: "cnt-api-01", image: "node:18-alpine", ports: "3000:3000", status: "running", cpu: 22, memory: 512 },
      { id: "cnt-worker-01", image: "python:3.11", ports: "", status: "running", cpu: 15, memory: 256 },
      { id: "cnt-monitoring", image: "prometheus:latest", ports: "9090:9090", status: "running", cpu: 5, memory: 180 },
    ],
    processes: [
      { pid: 1842, name: "nginx: master", user: "root", cpu: 0.2, memory: 12, threads: 1, status: "R", uptime: "142d 8h" },
      { pid: 1945, name: "nginx: worker", user: "www-data", cpu: 2.1, memory: 24, threads: 2, status: "R", uptime: "142d 8h" },
      { pid: 4130, name: "nginx: worker", user: "www-data", cpu: 1.8, memory: 22, threads: 2, status: "R", uptime: "142d 8h" },
      { pid: 2340, name: "node", user: "node", cpu: 5.5, memory: 128, threads: 4, status: "R", uptime: "142d 7h" },
      { pid: 9743, name: "node", user: "node", cpu: 0.1, memory: 8, threads: 1, status: "R", uptime: "2d 3h" },
      { pid: 2695, name: "python", user: "app", cpu: 3.2, memory: 64, threads: 2, status: "R", uptime: "142d 6h" },
      { pid: 1999, name: "prometheus", user: "prometheus", cpu: 1.2, memory: 45, threads: 2, status: "R", uptime: "142d 5h" },
    ]
  },
  {
    id: "srv-web-02",
    type: "Web Server",
    status: "healthy",
    cpu: 38,
    memory: 58,
    disk: 52,
    network: "2.1 GB/s",
    uptime: "142d 8h",
    location: "US-EAST-1B",
    ipAddress: "10.0.1.25",
    containers: [
      { id: "cnt-web-02", image: "nginx:latest", ports: "80:80, 443:443", status: "running", cpu: 8, memory: 124 },
      { id: "cnt-api-02", image: "node:18-alpine", ports: "3000:3000", status: "running", cpu: 22, memory: 512 },
      { id: "cnt-worker-02", image: "python:3.12", ports: "", status: "running", cpu: 15, memory: 256 },
    ],
    processes: [
      { pid: 1879, name: "nginx: master", user: "root", cpu: 8.2, memory: 124, threads: 4, status: "S", uptime: "142d" },
      { pid: 3022, name: "nginx: worker", user: "www-data", cpu: 1.9, memory: 20, threads: 2, status: "R", uptime: "14d 9h" },
      { pid: 1892, name: "node", user: "node", cpu: 4.8, memory: 120, threads: 4, status: "R", uptime: "142d 7h" },
      { pid: 3004, name: "python", user: "app", cpu: 2.8, memory: 60, threads: 2, status: "R", uptime: "142d 6h" },
      { pid: 3003, name: "fastApi", user: "backend", cpu: 6.8, memory: 50, threads: 2, status: "R", uptime: "159d 2h" },
    ]
  },
  {
    id: "srv-db-01",
    type: "Database",
    status: "healthy",
    cpu: 72,
    memory: 81,
    disk: 73,
    network: "8.2 GB/s",
    uptime: "342d 14h",
    location: "US-EAST-1A",
    ipAddress: "10.0.2.10",
    containers: [
      { id: "cnt-monitoring-db1", image: "prometheus:latest", ports: "9090:9090", status: "running", cpu: 5, memory: 180 },
      { id: "db-mongo-01", image: "mongo:7", status: "running", ports: "27017:27017", cpu: 11, memory: 524 },
      { id: "db-postgres-01", image: "postgres:latest", status: "running", ports: "5432:5432", cpu: 34, memory: 869}
    ],
    processes: [
      { pid: 1033, name: "mongod", user: "mongodb", cpu: 8.5, memory: 256, threads: 8, status: "R", uptime: "342d 14h" },
      { pid: 4597, name: "prometheus", user: "monitoring", cpu: 12.5, memory: 890, threads: 12, status: "R", uptime: "120d" },
      { pid: 1963, name: "elasticsearch", user: "elastic", cpu: 34.2, memory: 3200, threads: 24, status: "S", uptime: "201d" },
      { pid: 2103, name: "postgres", user: "postgres", cpu: 45.8, memory: 4200, threads: 16, status: "R", uptime: "342d" },
      { pid: 3421, name: "postgres", user: "postgres", cpu: 42.3, memory: 4100, threads: 16, status: "S", uptime: "342d" },
    ]
  },
  {
    id: "srv-db-02",
    type: "Database",
    status: "healthy",
    cpu: 68,
    memory: 79,
    disk: 71,
    network: "0.1 GB/s",
    uptime: "342d 14h",
    location: "US-EAST-1B",
    ipAddress: "10.0.2.11",
    containers: [
      { id: "db-mongo-02", image: "mongo:7", ports: "27017:27017", status: "running", cpu: 11, memory: 524 },
    ],
    processes: [
      { pid: 9739, name: "mongod", user: "mongodb", cpu: 7.8, memory: 244, threads: 8, status: "R", uptime: "342d 14h" },
      { pid: 3329, name: "mongod", user: "mongodb", cpu: 6.8, memory: 25, threads: 2, status: "R", uptime: "32d 4h" },
      { pid: 4442, name: "grafana", user: "grafana", cpu: 9.2, memory: 340, threads: 8, status: "S", uptime: "120d" },
    ]
  },
  {
    id: "srv-db-03",
    type: "Database",
    status: "warning",
    cpu: 91,
    memory: 85,
    disk: 68,
    network: "9.4 GB/s",
    uptime: "89d 3h",
    location: "US-EAST-1C",
    ipAddress: "10.0.2.12",
    containers: [
      { id: "cnt-monitoring-db3", image: "prometheus:latest", ports: "9090:9090", status: "running", cpu: 5, memory: 180 },
      { id: "db-mongo-03", image: "mongo:7", ports: "27017:27017", status: "running", cpu: 11, memory: 524 },
    ],
    processes: [
      { pid: 5687, name: "mongod", user: "mongodb", cpu: 9.1, memory: 270, threads: 8, status: "R", uptime: "89d 3h" },
      { pid: 2084, name: "prometheus", user: "prometheus", cpu: 1.5, memory: 50, threads: 2, status: "S", uptime: "89d 2h" },
    ]
  },
  {
    id: "srv-cache-01",
    type: "Cache",
    status: "healthy",
    cpu: 24,
    memory: 34,
    disk: 12,
    network: "1.2 GB/s",
    uptime: "201d 22h",
    location: "US-EAST-1A",
    ipAddress: "10.0.3.5",
    containers: [
      { id: "cnt-web-cache", image: "nginx:latest", ports: "80:80, 443:443", status: "running", cpu: 8, memory: 124 },
      { id: "cnt-api-cache", image: "node:18-alpine", ports: "3000:3000", status: "running", cpu: 22, memory: 512 },
      { id: "cnt-worker-cache", image: "python:3.11", ports: "", status: "running", cpu: 15, memory: 256 },
      { id: "cnt-monitoring-cache", image: "prometheus:latest", ports: "9090:9090", status: "running", cpu: 5, memory: 180 },
    ],
    processes: [
      { pid: 1247, name: "nginx", user: "www-data", cpu: 8.2, memory: 124, threads: 4, status: "S", uptime: "142d" },
      { pid: 6666, name: "node",  user: "nodeapp", cpu: 22.1, memory: 512, threads: 8, status: "R", uptime: "89d" },
      { pid: 4567, name: "prometheus", user: "monitoring", cpu: 12.5, memory: 890, threads: 12, status: "R", uptime: "120d" },
      { pid: 2456, name: "redis-server", user: "redis", cpu: 3.2, memory: 180, threads: 2, status: "S", uptime: "201d" },
    ]
  },
];

const storageRegions = [
  { 
    region: "US-EAST", 
    usedMemory: 2.4, 
    totalMemory: 5, 
    files: 12847, 
    lat: 40, 
    lng: -74 
  },
  { 
    region: "US-WEST", 
    usedMemory: 1.8, 
    totalMemory: 5, 
    files: 8923, 
    lat: 37, 
    lng: -122 
  },
  { 
    region: "EU-CENTRAL", 
    usedMemory: 3.2, 
    totalMemory: 5, 
    files: 15234, 
    lat: 50, 
    lng: 8 },
  { 
    region: "ASIA-PACIFIC", 
    usedMemory: 1.5, 
    totalMemory: 5, 
    files: 6432, 
    lat: 35, 
    lng: 139 
  },
];

const recentUploads = [
  {
    fileName: "backup-db-20260516.tar.gz",
    fileSize: 4.2,
    uploadedAt: "2 min ago",
    status: "complete"
  },
  {
    fileName: "logs-web-20260516.zip",
    fileSize: 0.89,
    uploadedAt: "15 min ago",
    status: "complete"
  },
  {
    fileName: "deployment-package.tar",
    fileSize: 1.2,
    uploadedAt: "1 hour ago",
    status: "syncing"
  },
  {
    fileName: "analytics-export.csv",
    fileSize: 0.045,
    uploadedAt: "3 hours ago",
    status: "complete"
  },
];

const recentAlerts = [
  {
    severity: "critical",
    title: "Multiple failed login attempts",
    description: "5 failed attempts from IP 203.0.113.42",
    time: "5 min ago",
    status: "investigating",
  },
  {
    severity: "warning",
    title: "SSL certificate expiring",
    description: "Certificate for api.ops.dev expires in 7 days",
    time: "2 hours ago",
    status: "pending",
  },
  {
    severity: "info",
    title: "New SSH key added",
    description: "User alice@ops.dev added new SSH key",
    time: "3 hours ago",
    status: "resolved",
  },
  {
    severity: "warning",
    title: "Unusual API access pattern",
    description: "High request rate from new client",
    time: "5 hours ago",
    status: "monitoring",
  },
];

const vulnerabilities = [
  { 
    package: "openssl", 
    version: "1.1.1k", 
    severity: "high",
    cve: "CVE-2024-1234",
    serverCount: 3 
  },
  { 
    package: "nginx", 
    version: "1.18.0",
    severity: "medium", 
    cve: "CVE-2024-5678", 
    serverCount: 6 
  },
  { 
    package: "postgres",
    version: "13.2", 
    severity: "low",
    cve: "CVE-2024-9012", 
    serverCount: 4 
  },
];

const allPermissions = [
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

const defaultRoles = [
  {
    name: "Admin",
    permissions: [
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
    ],
    editable: false,
  },
  {
    name: "DevOps Engineer",
    permissions: [
      { id: "servers.read", name: "View Servers", category: "Servers" },
      { id: "servers.write", name: "Manage Servers", category: "Servers" },
      { id: "servers.deploy", name: "Deploy Servers", category: "Servers" }, 
      { id: "containers.read", name: "View Containers", category: "Containers" },
      { id: "containers.write", name: "Manage Containers", category: "Containers" },
      { id: "containers.deploy", name: "Deploy Containers", category: "Containers" },
      { id: "network.read", name: "View Network", category: "Network" },
      { id: "network.write", name: "Configure Network", category: "Network" },
    ],
    editable: true,
  },
  {
    name: "Developer",
    permissions: [
      { id: "servers.read", name: "View Servers", category: "Servers" },
      { id: "containers.read", name: "View Containers", category: "Containers" },
      { id: "network.read", name: "View Network", category: "Network" },
    ],
    editable: true,
  },
  {
    name: "Security",
    permissions: [
      { id: "security.read", name: "View Security", category: "Security" },
      { id: "security.write", name: "Manage Security", category: "Security" },
    ],
    editable: true,
  }
];

async function resetDatabase() {
  await prisma.$transaction([
    prisma.permission.deleteMany(),
    prisma.user.deleteMany(),
    prisma.container.deleteMany(),
    prisma.process.deleteMany(),
    prisma.server.deleteMany(),
    prisma.storageRegion.deleteMany(),
    prisma.recentUpload.deleteMany(),
    prisma.recentAlert.deleteMany(),
    prisma.vulnerability.deleteMany(),
    prisma.pipeline.deleteMany(),
    prisma.alert.deleteMany(),
    prisma.role.deleteMany(),
  ]);
}

async function main() {
  console.log('Seeding database...');

  await resetDatabase();

  const roleMap = new Map();

  for (const role of defaultRoles) {
    const createdRole = await prisma.role.create({
      data: {
        name: role.name,
        editable: role.editable,
      },
    });

    roleMap.set(role.name, createdRole.id);

    for (const permission of role.permissions) {
      await prisma.permission.create({
        data: {
          key: permission.id,
          name: permission.name,
          category: permission.category,
          roleId: createdRole.id,
        },
      });
    }
  }

  for (const user of users) {
    const { role, ...userData } = user;

    await prisma.user.create({
      data: {
        ...userData,
        roleId: roleMap.get(role) ?? null,
        lastLogin: new Date(),
        sessions: Math.floor(Math.random() * 4),
      },
    });
  }
  for (const server of servers) {
    const { containers, processes, ...serverData } = server;
    await prisma.server.create({
      data: {
        ...serverData,
        containers: {
          create: containers
        },
        processes: {
          create: processes
        }
      }
    });
  }
  for (const region of storageRegions) {
    await prisma.storageRegion.create({
      data: region
    });
  }
  for (const upload of recentUploads) {
    await prisma.recentUpload.create({
      data: upload
    });
  }
  for (const alert of recentAlerts) {
    await prisma.recentAlert.create({
      data: alert
    });
  }
  for (const vuln of vulnerabilities) {
    await prisma.vulnerability.create({
      data: vuln
    });
  }
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
