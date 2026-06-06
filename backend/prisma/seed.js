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

async function main() {
  console.log('Seeding database...');

  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        lastLogin: new Date(),
        sessions: Math.floor(Math.random() * 4)
      }
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
