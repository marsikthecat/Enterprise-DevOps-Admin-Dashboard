import * as service from "../service/roleService.js";

export async function createRole(request, reply) {
  const role = await service.createRole(request.body);
  reply.code(201).send(role);
}

export async function updateRole(request, reply) {
  const role = await service.updateRole(request.params.id, request.body);
  reply.send(role);
}

export async function deleteRole(request, reply) {
  await service.deleteRole(request.params.id);
  reply.code(204).send();
}