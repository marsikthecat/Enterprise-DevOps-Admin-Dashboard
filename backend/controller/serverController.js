import * as service from "../service/serverService.js";
import { AppError } from "../app.js";

export async function getServers(request, reply) {
    return service.getServers();
}

export async function deployServer(request, reply) {
    const server = await service.deployServer(request.body);
    reply.code(201).send(server);
}

export async function getContainersOfServer(request, reply) {
    return service.getContainerOfServer(request.params.id);
}

export async function deployContainerToServer(request, reply) {
     const container = await service.deployContainerToServer(
        request.params.id,
        request.body
    );
    reply.code(201).send(container);
}

export async function getProcessesOfServer(request, reply) {
    return service.getProcessesOfServer(request.params.id);
}