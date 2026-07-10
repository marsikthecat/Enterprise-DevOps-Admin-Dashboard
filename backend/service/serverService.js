import { randomUUID } from "node:crypto";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServers() {
    const servers = await prisma.server.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return servers;
}

export async function deployServer(body) {
   const { id, type, cpu, memory, storage, region } = body;
    if (!id || !type) {
      throw new Error('ID and type are required')
    }
    const server = await prisma.server.create({
      data: {
        id,
        type,
        status: 'healthy',
        cpu: cpu || 4,
        memory: memory || 8,
        disk: storage || 100,
        network: '1 Gbps',
        uptime: '0d 0h',
        location: region || 'us-east-1a',
        ipAddress: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      }
    });
    return server;
}

export async function getContainerOfServer(serverId) {
    const containers = await prisma.container.findMany({
      where: { serverId }
    });
    return containers;
}

export async function deployContainerToServer(params, body) {
    const { id } = params;
    const { container } = bod
    const server = await prisma.server.update({
      where: { id },
      data: { containers: { push: container } }
    });
    return container;
}

export async function getProcessesOfServer(serverId) {
    const processes = await prisma.process.findMany({
      where: { serverId }
    });
    return processes;
}