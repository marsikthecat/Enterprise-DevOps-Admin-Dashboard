import { AppError } from "../app.js";
import * as service from "../service/dashboardService.js";

export async function getAlerts(request, reply) {
    return service.getAlerts();
}

export async function getVulnerabilities(request, reply) {
  return service.getVulnerabilities();
}

export async function getRegions(request, reply) {
  return service.getRegions();
}

export async function getUploads(request, reply) {
  return service.getUploads();
}

export async function getRoles(request, reply) {
  return service.getRoles();
}

export async function getPermissions(request, reply) {
  return service.getPermissions();
}

export async function getPipelines(request, reply) {
  return service.getPipelines();
}

export async function getAuditLogs(request, reply) {
  return service.getAuditLogs();
}

export async function addAuditLog(request, reply) {
  const { action, author } = request.body;
  if (!action || !author) {
    throw new AppError(400, 'Action and author are required');
  }
  return service.addAuditLog({ action, author });
}