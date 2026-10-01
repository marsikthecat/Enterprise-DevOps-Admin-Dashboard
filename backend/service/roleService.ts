import { PrismaClient } from "@prisma/client";
import { AppError } from "../app.js";
import type { Role, UpdateRoleWithPermissions } from "../zod.js";

const prisma = new PrismaClient();

export async function createRole(newRole: Role) {
  const { name } = newRole;
  const existingRole = await prisma.role.findUnique({ where: { name } });
  if (existingRole) {
    throw new AppError(409, "A role with this name already exists");
  }
  return prisma.role.create({
    data: { name, editable: true },
    include: { permissions: true },
  });
}

export async function updateRole(id: string, permissions: UpdateRoleWithPermissions) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) {
    throw new AppError(404, "Role not found");
  }
  if (!role.editable) {
    throw new AppError(400, "This role cannot be changed");
  }
  await prisma.$transaction([
    prisma.permission.deleteMany({ where: { roleId: id } }),
    prisma.permission.createMany({
      data: permissions.permissions.map((permission) => ({
        ...permission,
        roleId: id,
      })),
    }),
  ]);

  return prisma.role.findUnique({
    where: { id },
    include: { permissions: true },
  });
}

export async function deleteRole(roleId: string) {
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