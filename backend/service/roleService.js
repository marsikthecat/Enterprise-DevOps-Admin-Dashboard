import { PrismaClient } from "@prisma/client";
import { AppError } from "../app.js";

const prisma = new PrismaClient();

export async function createRole(body) {
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    throw new AppError(400, "Role name is required");
  }

  const existingRole = await prisma.role.findUnique({ where: { name } });
  if (existingRole) {
    throw new AppError(409, "A role with this name already exists");
  }

  return prisma.role.create({
    data: { name, editable: true },
    include: { permissions: true },
  });
}

export async function updateRole(roleId, body) {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) {
    throw new AppError(404, "Role not found");
  }

  if (!role.editable) {
    throw new AppError(400, "This role cannot be changed");
  }

  if (!Array.isArray(body?.permissions)) {
    throw new AppError(400, "Permissions must be an array");
  }

  const permissions = body.permissions.map((permission) => {
    const key = typeof permission?.key === "string" ? permission.key.trim() : "";
    const name = typeof permission?.name === "string" ? permission.name.trim() : "";
    const category = typeof permission?.category === "string" ? permission.category.trim() : "";

    if (!key || !name || !category) {
      throw new AppError(400, "Each permission requires a key, name, and category");
    }

    return { key, name, category, roleId };
  });

  await prisma.$transaction([
    prisma.permission.deleteMany({ where: { roleId } }),
    prisma.permission.createMany({ data: permissions }),
  ]);

  return prisma.role.findUnique({
    where: { id: roleId },
    include: { permissions: true },
  });
}

export async function deleteRole(roleId) {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
  });

  if (!role) {
    throw new AppError(404, "Role not found");
  }

  if (!role.editable) {
    throw new AppError(400, "This role cannot be deleted");
  }

  await prisma.$transaction([
    prisma.permission.deleteMany({ where: { roleId } }),
    prisma.role.delete({ where: { id: roleId } }),
  ]);
}