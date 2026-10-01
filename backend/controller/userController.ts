import { AppError } from "../app.js";
import * as service from "../service/userService.js";
import { loginUserSchema, userSchema, userUpdateSchema } from "../zod.js";
import type { UpdatedUser, User } from "../zod.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getUsers() {
    return service.getUsers();
}

export async function getUser(request: FastifyRequest<{
    Params: {
        id: string
    }
}>) {
    return service.getUser(request.params.id);
}

export async function createUser(request: FastifyRequest<{   
   Body: User}>, reply: FastifyReply) {
    const validation = userSchema.safeParse(request.body);
    if (!validation.success) {
        throw new AppError(400, validation.error.issues[0].message);
    }
    const user = await service.createUser(validation.data);
    reply.code(201).send(user);
}

export async function signup(request: FastifyRequest<{Body: User}>, 
    reply: FastifyReply) {
    const validation = userSchema.safeParse(request.body);
    if (!validation.success) {
        throw new AppError(400, validation.error.issues[0].message);
    }
    const user = await service.signup(validation.data);
    const token = request.server.jwt.sign({ sub: user.id, email: user.email, role: user.role?.name });
    reply.code(201).send({ user, token });
}

export async function login(request: FastifyRequest<{   
   Body: User}>, reply: FastifyReply) {
    const validation = loginUserSchema.safeParse(request.body);
    if (!validation.success) {
        throw new AppError(400, validation.error.issues[0].message);
    }
    const user = await service.loginUser(validation.data);
    const token = request.server.jwt.sign({ sub: user.id, email: user.email, role: user.role?.name });
    reply.send({ user, token });
}

export async function updateUser(request: FastifyRequest<{   
   Params: {
      id: string;
   };
   Body: UpdatedUser}>, reply: FastifyReply) {
    const validation = userUpdateSchema.safeParse(request.body);
    if (!validation.success) {
        throw new AppError(400, validation.error.issues[0].message);
    }
    const user = await service.updateUser(request.params.id, validation.data);
    reply.send(user);
}

export async function deleteUser(request: FastifyRequest<{   
   Params: {
      id: string;
   };}>) {
    await service.deleteUser(request.params.id);
}