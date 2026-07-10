import * as service from "../service/serverService.js";

const toErrorMessage = (error) =>  error instanceof Error ? error.message : "Unknown error";

export async function getServers(req, res) {
    try {
        const servers = await service.getServers();
        res.status(200).json(servers);
    } catch (error) {
        res.status(500).json({ error: toErrorMessage(error) });
    }
}

export async function deployServer(req, res) {
    try {
        const server = await service.deployServer(req.body);
        res.status(201).json(server);
    } catch (error) {
        res.status(400).json({ error: toErrorMessage(error) });
    }
}

export async function getContainersOfServer(req, res) {
    try {
        const containers = await service.getContainerOfServer(req.params.id);
        res.status(200).json(containers);
    } catch (error) {
        res.status(500).json({ error: toErrorMessage(error) });
    }
}

export async function deployContainerToServer(req, res) {
    try {
        const container = await service.deployContainerToServer(
            req.params.id,
            req.body
        );
        res.status(201).json(container);
    } catch (error) {
        res.status(500).json({ error: toErrorMessage(error) });
    }
}

export async function getProcessesOfServer(req, res) {
    try {
        const processes = await service.getProcessesOfServer(req.params.id);
        res.status(200).json(processes);
    } catch (error) {
        res.status(500).json({ error: toErrorMessage(error) });
    }
}