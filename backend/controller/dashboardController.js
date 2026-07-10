import * as service from "../service/dashboardService.js";

const toErrorMessage = (error) => (error instanceof Error ? error.message : "Unknown error");

export async function getAlerts(req, res) {
  try {
    const alerts = await service.getAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: toErrorMessage(error) });
  }
}

export async function getVulnerabilities(req, res) {
  try {
    const vulnerabilities = await service.getVulnerabilities();
    res.json(vulnerabilities);
  } catch (error) {
    res.status(500).json({ error: toErrorMessage(error) });
  }
}

export async function getRegions(req, res) {
  try {
    const regions = await service.getRegions();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: toErrorMessage(error) });
  }
}

export async function getUploads(req, res) {
  try {
    const uploads = await service.getUploads();
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ error: toErrorMessage(error) });
  }
}

export async function getRoles(req, res) {
  try {
    const roles = await service.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: toErrorMessage(error) });
  }
}

export async function getPermissions(req, res) {
  try {
    const permissions = await service.getPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: toErrorMessage(error) });
  }
}

export async function getPipelines(req, res) {
  try {
    const pipelines = await service.getPipelines();
    res.json(pipelines);
  } catch (error) {
    res.status(500).json({ error: toErrorMessage(error) });
  }
}
