import { randomUUID } from "node:crypto";
import { PrismaClient } from '@prisma/client';
import { AppError } from "../app.js";

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
      throw new AppError(400, 'ID and type are required');
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

function getImageRepository(image) {
    return image.split('/').pop().split(':')[0].toLowerCase();
}

function processBelongsToImage(processName, image) {
    const name = processName.toLowerCase();
    const repository = getImageRepository(image);
    const processPrefixes = repository === 'mongo' ? ['mongo', 'mongod'] : [repository];
    return processPrefixes.some((prefix) => name === prefix || name.startsWith(`${prefix}:`) || name.startsWith(`${prefix}-`));
}

export async function changeContainerState(serverId, containerId, action) {
    if (action !== 'stop' && action !== 'restart') {
      throw new AppError(400, 'Container action must be stop or restart');
    }

    return prisma.$transaction(async (transaction) => {
      const container = await transaction.container.findFirst({
        where: { id: containerId, serverId }
      });

      if (!container) {
        throw new AppError(404, 'Container not found');
      }

      const processes = await transaction.process.findMany({ where: { serverId } });
      const affectedProcesses = processes.filter((process) => processBelongsToImage(process.name, container.image));
      const isStopped = action === 'stop';

      await transaction.container.update({
        where: { id: container.id },
        data: { status: isStopped ? 'stopped' : 'running' }
      });

      const updatedProcesses = [];
      for (const process of affectedProcesses) {
        const updatedProcess = await transaction.process.update({
          where: { id: process.id },
          data: {
            status: isStopped ? 'S' : 'R',
            cpu: isStopped ? 0 : 20 + (process.pid % 61)
          }
        });
        updatedProcesses.push(updatedProcess);
      }

      return {
        container: { ...container, status: isStopped ? 'stopped' : 'running' },
        processes: updatedProcesses
      };
    });
}

export async function deployContainerToServer(serverId, body) {
    const { container } = body;
    const server = await prisma.server.update({
      where: { serverId },
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