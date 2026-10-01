import { PrismaClient } from '@prisma/client';
import { AppError } from '../app.js';
import type { LoginUser, UpdatedUser, User } from '../zod.js';

const prisma = new PrismaClient();

function sanitizeUser<T extends { password: string }>(user: T): Omit<T, "password">;
function sanitizeUser<T extends { password: string }>(user: T | null) {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
}

export async function getUsers() {
    const users = await prisma.user.findMany({
      include: { role: { include: { permissions: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return users.map((user) => sanitizeUser(user));
}

export async function getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: { include: { permissions: true } } }
    });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return sanitizeUser(user);
}

export async function createUser(newUser: User) {
    const { name, email, password, role, status, avatar } = newUser;
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

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
      include: { role: { include: { permissions: true } } }
    });
    return sanitizeUser(user);
}

export async function signup(body: User) {
    return createUser(body);
}

export async function loginUser(loginUser: LoginUser) {
    const normalizedEmail = loginUser.email.trim().toLowerCase();
    const normalizedPassword = loginUser.password.trim();

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        password: normalizedPassword
      },
      include: { role: { include: { permissions: true } } }
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
      include: { role: { include: { permissions: true } } }
    });

    return sanitizeUser(updatedUser);
}

export async function updateUser(userId: string, updatedUser: UpdatedUser) {
  const { name, email, password, role, status, sessions } = updatedUser;

    const roleRecord =  await prisma.role.findUnique({ where: { name: role }});

    const user = await prisma.user.update({
      where: { id: userId},
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password: password.trim() }),
        ...(roleRecord ? { roleId: roleRecord.id } : {}),
        ...(status && { status }),
        ...(sessions !== undefined && { sessions }),
        lastLogin: new Date()
      },
      include: { role: { include: { permissions: true } } }
    });
    return sanitizeUser(user);
}

export async function deleteUser(userId: string) {
    await prisma.user.delete({
      where: { id: userId }
    });
}