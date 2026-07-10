import * as service from "../service/userService.js";

const toErrorMessage = (error) => error instanceof Error ? error.message : "Unknown error";

export async function getUsers(req, res) {
    try {
        const users = await service.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: toErrorMessage(error) });
    }
}

export async function getUser(req, res) {
    try {
        const user = await service.getUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: toErrorMessage(error) });
    }
}

export async function createUser(req, res) {
    try {
        const user = await service.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: toErrorMessage(error) });
    }
}

export async function updateUser(req, res) {
    try {
        const user = await service.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: toErrorMessage(error) });
    }
}

export async function deleteUser(req, res) {
    try {
        await service.deleteUser(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: toErrorMessage(error) });
    }
}