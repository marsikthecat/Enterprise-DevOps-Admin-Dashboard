import { AppError } from "../app.js";
import * as service from "../service/dashboardService.js";
import { auditLogSchema } from "../zod.js";
import type { AuditLog } from "../zod.js";
import { FastifyRequest } from "fastify";

export async function getAlerts() {
    return service.getAlerts();
}

export async function getVulnerabilities() {
  return service.getVulnerabilities();
}

export async function getRegions() {
  return service.getRegions();
}

export async function getUploads() {
  return service.getUploads();
}

export async function getRoles() {
  return service.getRoles();
}

export async function getPermissions() {
  return service.getPermissions();
}

export async function getPipelines() {
  return service.getPipelines();
}

export async function getAuditLogs() {
  return service.getAuditLogs();
}

export async function addAuditLog(request: FastifyRequest<{Body: AuditLog}>) {
  const validation = auditLogSchema.safeParse(request.body);
  if (!validation.success) {
    throw new AppError(400, validation.error.issues[0].message);
  }
  return service.addAuditLog(validation.data);
}