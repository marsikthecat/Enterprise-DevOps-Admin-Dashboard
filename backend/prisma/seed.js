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
    cpu: 65,
    memory: 16,
    disk: 512,
    network: "2.4 GB/s",
    uptime: "142d 8h",
    location: "US-EAST-1A",
    ipAddress: "10.0.1.24",
    containers: [
      { id: "cnt-web-01", image: "nginx:latest", ports: "80:80, 443:443", status: "running"},
      { id: "cnt-api-01", image: "node:18-alpine", ports: "3000:3000", status: "running"},
      { id: "cnt-worker-01", image: "python:3.11", ports: "", status: "running"},
      { id: "cnt-monitoring", image: "prometheus:latest", ports: "9090:9090", status: "running"},
    ],
    processes: [
      { pid: 1842, name: "nginx: master", user: "root", cpu: 56, memory: 1.2, threads: 1, status: "R", uptime: "142d 8h" },
      { pid: 1945, name: "nginx: worker", user: "www-data", cpu: 89, memory: 0.24, threads: 2, status: "R", uptime: "142d 8h" },
      { pid: 4130, name: "nginx: worker", user: "www-data", cpu: 77, memory: 0.22, threads: 2, status: "R", uptime: "142d 8h" },
      { pid: 2340, name: "node", user: "node", cpu: 98, memory: 2.28, threads: 4, status: "R", uptime: "142d 7h" },
      { pid: 9743, name: "node", user: "node", cpu: 87, memory: 1.8, threads: 1, status: "R", uptime: "2d 3h" },
      { pid: 2695, name: "python", user: "app", cpu: 44, memory: 0.64, threads: 2, status: "R", uptime: "142d 6h" },
      { pid: 1999, name: "prometheus", user: "prometheus", cpu: 17, memory: 0.45, threads: 2, status: "R", uptime: "142d 5h" },
    ]
  },
  {
    id: "srv-web-02",
    type: "Web Server",
    status: "healthy",
    cpu: 41,
    memory: 12,
    disk: 128,
    network: "2.1 GB/s",
    uptime: "142d 8h",
    location: "US-EAST-1B",
    ipAddress: "10.0.1.25",
    containers: [
      { id: "cnt-web-02", image: "nginx:latest", ports: "80:80, 443:443", status: "running"},
      { id: "cnt-api-02", image: "node:18-alpine", ports: "3000:3000", status: "running"},
      { id: "cnt-worker-02", image: "python:3.12", ports: "", status: "running"},
    ],
    processes: [
      { pid: 1879, name: "nginx: master", user: "root", cpu: 0, memory: 3.2, threads: 0, status: "S", uptime: "142d" },
      { pid: 3022, name: "nginx: worker", user: "www-data", cpu: 19, memory: 0.2, threads: 2, status: "R", uptime: "14d 9h" },
      { pid: 1892, name: "node", user: "node", cpu: 48, memory: 1.2, threads: 4, status: "R", uptime: "142d 7h" },
      { pid: 3004, name: "python", user: "app", cpu: 28, memory: 0.6, threads: 2, status: "R", uptime: "142d 6h" },
      { pid: 3003, name: "fastApi", user: "backend", cpu: 68, memory: 0.5, threads: 2, status: "R", uptime: "159d 2h" },
    ]
  },
  {
    id: "srv-db-01",
    type: "Database",
    status: "warning",
    cpu: 91,
    memory: 32,
    disk: 256,
    network: "8.2 GB/s",
    uptime: "342d 14h",
    location: "US-EAST-1A",
    ipAddress: "10.0.2.10",
    containers: [
      { id: "cnt-monitoring-db1", image: "prometheus:latest", ports: "9090:9090", status: "running"},
      { id: "db-mongo-01", image: "mongo:7", status: "running", ports: "27017:27017"},
      { id: "db-postgres-01", image: "postgres:latest", status: "running", ports: "5432:5432"}
    ],
    processes: [
      { pid: 1033, name: "mongod", user: "mongodb", cpu: 75, memory: 7.6, threads: 8, status: "R", uptime: "342d 14h" },
      { pid: 4597, name: "prometheus", user: "monitoring", cpu: 95, memory: 0.89, threads: 12, status: "R", uptime: "120d" },
      { pid: 1963, name: "elasticsearch", user: "elastic", cpu: 98.3, memory: 3.2, threads: 24, status: "R", uptime: "201d" },
      { pid: 2103, name: "postgres", user: "postgres", cpu: 86.8, memory: 8.200, threads: 16, status: "R", uptime: "342d" },
      { pid: 3421, name: "postgres", user: "postgres", cpu: 100.3, memory: 11.8, threads: 16, status: "R", uptime: "342d" },
    ]
  },
  {
    id: "srv-db-02",
    type: "Database",
    status: "healthy",
    cpu: 49,
    memory: 16,
    disk: 64,
    network: "0.1 GB/s",
    uptime: "342d 14h",
    location: "US-EAST-1B",
    ipAddress: "10.0.2.11",
    containers: [
      { id: "db-mongo-02", image: "mongo:7", ports: "27017:27017", status: "running"},
    ],
    processes: [
      { pid: 9739, name: "mongod", user: "mongodb", cpu: 78, memory: 2.44, threads: 8, status: "R", uptime: "342d 14h" },
      { pid: 3329, name: "mongod", user: "mongodb", cpu: 68, memory: 2.5, threads: 2, status: "R", uptime: "32d 4h" },
      { pid: 4442, name: "grafana", user: "grafana", cpu: 0, memory: 3.4, threads: 8, status: "S", uptime: "120d" },
    ]
  },
  {
    id: "srv-db-03",
    type: "Database",
    status: "healthy",
    cpu: 15,
    memory: 8,
    disk: 64,
    network: "9.4 GB/s",
    uptime: "89d 3h",
    location: "US-EAST-1C",
    ipAddress: "10.0.2.12",
    containers: [
      { id: "cnt-monitoring-db3", image: "prometheus:latest", ports: "9090:9090", status: "running"},
      { id: "db-mongo-03", image: "mongo:7", ports: "27017:27017", status: "running"},
    ],
    processes: [
      { pid: 5687, name: "mongod", user: "mongodb", cpu: 31, memory: 2.7, threads: 8, status: "R", uptime: "89d 3h" },
      { pid: 2084, name: "prometheus", user: "prometheus", cpu: 1.5, memory: 5.0, threads: 1, status: "S", uptime: "89d 2h" },
    ]
  },
  {
    id: "srv-cache-01",
    type: "Cache",
    status: "healthy",
    cpu: 88,
    memory: 32,
    disk: 512,
    network: "1.2 GB/s",
    uptime: "201d 22h",
    location: "US-EAST-1A",
    ipAddress: "10.0.3.5",
    containers: [
      { id: "cnt-web-cache", image: "nginx:latest", ports: "80:80, 443:443", status: "running"},
      { id: "cnt-api-cache", image: "node:18-alpine", ports: "3000:3000", status: "running"},
      { id: "cnt-worker-cache", image: "python:3.11", ports: "", status: "running"},
      { id: "cnt-monitoring-cache", image: "prometheus:latest", ports: "9090:9090", status: "running"},
    ],
    processes: [
      { pid: 1247, name: "nginx", user: "www-data", cpu: 100.3, memory: 2.4, threads: 4, status: "R", uptime: "142d" },
      { pid: 6666, name: "node",  user: "nodeapp", cpu: 85.4, memory: 0.5, threads: 8, status: "R", uptime: "89d" },
      { pid: 4567, name: "prometheus", user: "monitoring", cpu: 100.3, memory: 8.9, threads: 12, status: "R", uptime: "120d" },
      { pid: 2456, name: "redis-server", user: "redis", cpu: 0.3, memory: 18.0, threads: 2, status: "S", uptime: "201d" },
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
    uploadedAt: "20 min ago",
    status: "complete",
    uploadedBy: "alice@ops.dev"
  },
  {
    fileName: "logs-web-20260516.zip",
    fileSize: 0.89,
    uploadedAt: "42 min ago",
    status: "complete",
    uploadedBy: "alice@ops.dev"
  },
  {
    fileName: "deployment-package.tar",
    fileSize: 1.2,
    uploadedAt: "6 hour ago",
    status: "syncing",
    uploadedBy: "alice@ops.dev"
  },
  {
    fileName: "analytics-export.csv",
    fileSize: 0.045,
    uploadedAt: "10 hours ago",
    status: "complete",
    uploadedBy: "alice@ops.dev"
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
    severity: "critical",
    title: "Suspected DDoS-Attack",
    description: "Overload of request from IP 127.22.8.238",
    time: "3 hours ago",
    status: "investigating",
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
  {
    severity: "warning",
    title: "Multiple failed login attempts",
    description: "3 failed attempts from IP 143.0.96.189",
    time: "2 days ago",
    status: "resolved",
  },
  {
    severity: "info",
    title: "2FA activated",
    description: "User carol@ops.dev enabled 2FA for her account",
    time: "1 week ago",
    status: "resolved",
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

const auditLogs = [
  {
    timeStamp: new Date().toISOString(),
    action: "rotate keys",
    author: "alice@ops.dev"
  }
]

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
    prisma.auditLogEntry.deleteMany(),
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
  for (const auditLog of auditLogs) {
    await prisma.auditLogEntry.create({
      data: auditLog
    })
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
