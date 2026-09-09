import { AppError } from "../app.js";
import * as service from "../service/userService.js";

export async function getUsers(request, reply) {
    return service.getUsers();
}

export async function getUser(request, reply) {
    return service.getUser(request.params.id);
}

export async function createUser(request, reply) {
    const user = await service.createUser(request.body);
    reply.code(201).send(user);
}

export async function signup(request, reply) {
    const user = await service.signup(request.body);
    const token = request.server.jwt.sign({ sub: user.id, email: user.email, role: user.role?.name });
    reply.code(201).send({ user, token });
}

export async function login(request, reply) {
    const user = await service.loginUser(request.body);
    const token = request.server.jwt.sign({ sub: user.id, email: user.email, role: user.role?.name });
    reply.send({ user, token });
}

export async function updateUser(request, reply) {
    const user = await service.updateUser(request.params.id, request.body);
    reply.send(user);
}

export async function deleteUser(request, reply) {
    await service.deleteUser(request.params.id);
}