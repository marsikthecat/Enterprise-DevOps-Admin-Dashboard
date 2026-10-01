import * as service from "../service/roleService.js";
import { AppError } from "../app.js";
import { roleSchema, updateRoleSchemaWithPermissions } from "../zod.js";
import type { Role, UpdateRoleWithPermissions } from "../zod.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function createRole(request: FastifyRequest<{Body: Role}>, reply: FastifyReply) {
  const validation = roleSchema.safeParse(request.body);
  if (!validation.success) {
    throw new AppError(400, validation.error.issues[0].message);
  }
  const role = await service.createRole(validation.data);
  reply.code(201).send(role);
}

export async function updateRole(request: FastifyRequest<{   
   Params: {
      id: string;
   };
   Body: UpdateRoleWithPermissions}>, reply: FastifyReply) {
  const id = request.params.id;
  if (id == null) {
    throw new AppError(400, "Id of role is missing");
  }
  const validation = updateRoleSchemaWithPermissions.safeParse(request.body);
  if (!validation.success) {
    throw new AppError(400, validation.error.issues[0].message);
  }
  const role = await service.updateRole(id, validation.data);
  reply.send(role);
}

export async function deleteRole(request: FastifyRequest<{   
  Params: {
    id: string;
  };}>, reply: FastifyReply) {
  const id = request.params.id;
  if (id == null) {
    throw new AppError(400, "Id of role is missing");
  }
  await service.deleteRole(id);
  reply.code(204).send();
}