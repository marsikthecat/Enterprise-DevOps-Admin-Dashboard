import * as service from "../service/processService.js";

const toErrorMessage = (error) => error instanceof Error ? error.message : "Unknown error";

export async function getProcesses(req, res) {
    try {
        const processes = await service.getProcesses();
        res.status(200).json(processes);
    } catch (error) {
        res.status(500).json({ error: toErrorMessage(error)});
    }
}