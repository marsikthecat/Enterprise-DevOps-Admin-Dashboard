import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUsers() {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    });
    return users;
}

export async function getUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });
    if (!user) {
      throw new Error("User not found");
    }
}

export async function createUser(body) {
    const { name, email, role, status, avatar } = body;
    if (!name || !email) {
        throw new Error("Name and email are required");
    }
    const normalizedRole = typeof role === 'string' ? role : 'Developer';
    const roleRecord = await prisma.role.findUnique({ where: { name: normalizedRole } });
    const user = await prisma.user.create({
      data: {
        name,
        email,
        roleId: roleRecord?.id ?? null,
        status: status || 'active',
        lastLogin: new Date(),
        sessions: 0,
        avatar: avatar || name.split(' ').map((n) => n[0]).join('')
      },
      include: { role: true }
    });
    return user;
}

export async function updateUser(userId, body) {
    const { name, email, role, status, sessions } = body;

    const roleRecord = typeof role === 'string' ? await prisma.role.findUnique({ where: { name: role } }) : null;

    const user = await prisma.user.update({
      where: { id: userId},
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(roleRecord ? { roleId: roleRecord.id } : {}),
        ...(status && { status }),
        ...(sessions !== undefined && { sessions }),
        lastLogin: new Date()
      },
      include: { role: true }
    });
    return user;
}

export async function deleteUser(userId) {
    await prisma.user.delete({
      where: { id: userId }
    });
}