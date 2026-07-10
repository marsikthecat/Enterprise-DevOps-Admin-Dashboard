import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAlerts() {
  return prisma.recentAlert.findMany({ orderBy: { id: "asc" } });
}

export async function getVulnerabilities() {
  return prisma.vulnerability.findMany({ orderBy: { package: "asc" } });
}

export async function getRegions() {
  return prisma.storageRegion.findMany({ orderBy: { region: "asc" } });
}

export async function getUploads() {
  return prisma.recentUpload.findMany({ orderBy: { uploadedAt: "asc" } });
}

export async function getRoles() {
  return prisma.role.findMany({
    include: { permissions: true },
    orderBy: { name: "asc" }
  });
}

export async function getPermissions() {
  return prisma.permission.findMany({ orderBy: { category: "asc" } });
}

export async function getPipelines() {
  return prisma.pipeline.findMany({ orderBy: { name: "asc" } });
}
