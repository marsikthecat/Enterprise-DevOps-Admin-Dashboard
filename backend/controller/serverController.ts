import * as service from "../service/serverService.js";
import { AppError } from "../app.js";
import { deployContainerSchema, serverSchema } from "../zod.js";
import type { DeployContainer, Server } from "../zod.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getServers() {
    return service.getServers();
}

export async function deployServer(request: FastifyRequest<{Body: Server}>,
     reply: FastifyReply) {
    const validation = serverSchema.safeParse(request.body);
    if (!validation.success) {
        throw new AppError(400, validation.error.issues[0].message);
    }
    const server = await service.deployServer(validation.data);
    reply.code(201).send(server);
}

export async function getContainersOfServer(request: FastifyRequest<{   
   Params: {
      id: string;
   };}>) {
    const id = request.params.id;
    if (id == null) {
        throw new AppError(400, "Id of server is missing");
    }
    return service.getContainerOfServer(id);
}

export async function changeContainerState(request: FastifyRequest<{   
   Params: {
      id: string;
      containerId: string;
   };
   Body: {
      action: string;
   }}>) {
    return service.changeContainerState(
        request.params.id,
        request.params.containerId,
        request.body.action
    );
}

export async function deployContainerToServer(request: FastifyRequest<{   
   Params: {
      id: string;
   };
   Body: DeployContainer;
}>, reply: FastifyReply) {
     const validation = deployContainerSchema.safeParse(request.body);
     if (!validation.success) {
        throw new AppError(400, validation.error.issues[0].message);
     }
     const container = await service.deployContainerToServer(
        request.params.id,
        validation.data
    );
    reply.code(201).send(container);
}

export async function getProcessesOfServer(request: FastifyRequest<{   
   Params: {
      id: string;
   }}>) {
    return service.getProcessesOfServer(request.params.id);
}