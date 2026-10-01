import Fastify from 'fastify'
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import * as serverController from "./controller/serverController.js";
import * as processController from "./controller/processController.js";
import * as userController from "./controller/userController.js";
import * as roleController from "./controller/roleController.js";
import * as dashboardController from "./controller/dashboardController.js";

export class AppError extends Error {
    readonly statusCode: number;

    constructor(statusCode = 500, message = "Internal Server Error") {
      super(message);
      this.statusCode = statusCode;
      this.name = "AppError";
    }
}

const app = Fastify({
  logger: true
})

await app.register(fastifyCors, {
  origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
})

const jwtSecret = process.env.JWT_SECRET || (
  process.env.NODE_ENV === "production" ? null : "development-only-change-me"
);

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be configured in production");
}

await app.register(fastifyJwt, { secret: jwtSecret })

app.addHook("onRequest", async (request, reply) => {
  const path = request.url.split("?")[0];
  const isPublic = request.method === "OPTIONS" || path === "/auth/login" || path === "/auth/signup";

  if (isPublic) return;

  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ error: "Authentication required" });
  }
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
app.post("/auth/signup", userController.signup);
app.post("/auth/login", userController.login);
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

const PORT = Number(process.env.PORT || 3000);

app.listen({ port: PORT }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})