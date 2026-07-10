import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();   

export async function getProcesses() {
    const processes = await prisma.process.findMany({
      orderBy: { createdAt: 'desc'}
    });  
    return processes;
}