import Fastify from 'fastify'
import fastifyCors from '@fastify/cors';
import * as serverController from "./controller/serverController.js";
import * as processController from "./controller/processController.js";
import * as userController from "./controller/userController.js";
import * as roleController from "./controller/roleController.js";
import * as dashboardController from "./controller/dashboardController.js";

export class AppError extends Error {
    constructor(statusCode = 500, message = "Internal Server Error") {
        super(message);
      this.statusCode = statusCode;
    }
}

const app = Fastify({
  logger: true
})

await app.register(fastifyCors, {
  origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
})

app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            error: error.message
        });
    }
    return reply.status(500).send({
        error: "Internal Server Error"
    });
});
app.get("/servers", serverController.getServers);
app.post("/servers", serverController.deployServer);
app.get("/servers/:id/containers", serverController.getContainersOfServer);
app.patch("/servers/:id/containers/:containerId/action", serverController.changeContainerState);
app.post("/servers/:id/containers", serverController.deployContainerToServer);
app.get("/servers/:id/processes", serverController.getProcessesOfServer);

app.get("/processes", processController.getProcesses);

app.get("/users", userController.getUsers);
app.get("/users/:id", userController.getUser);
app.post("/users", userController.createUser);
app.patch("/users/:id", userController.updateUser);
app.delete("/users/:id", userController.deleteUser);
app.post("/roles", roleController.createRole);
app.patch("/roles/:id", roleController.updateRole);
app.delete("/roles/:id", roleController.deleteRole);

app.get("/alerts", dashboardController.getAlerts);
app.get("/vulnerabilities", dashboardController.getVulnerabilities);
app.get("/regions", dashboardController.getRegions);
app.get("/uploads", dashboardController.getUploads);
app.get("/roles", dashboardController.getRoles);
app.get("/permissions", dashboardController.getPermissions);
app.get("/pipelines", dashboardController.getPipelines);

app.get("/auditLogs", dashboardController.getAuditLogs);
app.post("/auditLogs", dashboardController.addAuditLog);

const PORT = 3000;

app.listen({ port: PORT }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})