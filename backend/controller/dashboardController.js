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