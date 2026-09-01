import { PrismaClient } from '@prisma/client';
import { AppError } from '../app.js';

const prisma = new PrismaClient();

function sanitizeUser(user) {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
}

export async function getUsers() {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    });
    return users.map(sanitizeUser);
}

export async function getUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return sanitizeUser(user);
}

export async function createUser(body) {
    const { name, email, password, role, status, avatar } = body;
    const normalizedName = String(name ?? '').trim();
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const normalizedPassword = String(password ?? '').trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
        throw new AppError(400, "Name, email and password are required");
    }

    const existingUserWithEmail = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });

    if (existingUserWithEmail) {
      throw new AppError(409, "An account with this email already exists");
    }

    const existingUserWithPassword = await prisma.user.findFirst({
      where: { password: normalizedPassword }
    });

    if (existingUserWithPassword && existingUserWithPassword.email !== normalizedEmail) {
      throw new AppError(409, `Password already used by user ${existingUserWithPassword.name} (${existingUserWithPassword.email})`);
    }

    const normalizedRole = typeof role === 'string' ? role : 'Developer';
    const roleRecord = await prisma.role.findUnique({ where: { name: normalizedRole } });
    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword,
        roleId: roleRecord?.id ?? null,
        status: status || 'active',
        lastLogin: new Date(),
        sessions: 0,
        avatar: avatar || normalizedName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
      },
      include: { role: true }
    });
    return sanitizeUser(user);
}

export async function signup(body) {
    return createUser(body);
}

export async function loginUser(body) {
    const normalizedEmail = String(body?.email ?? '').trim().toLowerCase();
    const normalizedPassword = String(body?.password ?? '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new AppError(400, "Email and password are required");
    }

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        password: normalizedPassword
      },
      include: { role: true }
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        sessions: user.sessions + 1,
      },
      include: { role: true }
    });

    return sanitizeUser(updatedUser);
}

export async function updateUser(userId, body) {
    const { name, email, password, role, status, sessions } = body;

    const roleRecord = typeof role === 'string' ? await prisma.role.findUnique({ where: { name: role } }) : null;

    const user = await prisma.user.update({
      where: { id: userId},
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password: String(password).trim() }),
        ...(roleRecord ? { roleId: roleRecord.id } : {}),
        ...(status && { status }),
        ...(sessions !== undefined && { sessions }),
        lastLogin: new Date()
      },
      include: { role: true }
    });
    return sanitizeUser(user);
}

export async function deleteUser(userId) {
    await prisma.user.delete({
      where: { id: userId }
    });
}