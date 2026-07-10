import express from "express";
import cors from "cors";

import * as serverController from "./controller/serverController.js";
import * as processController from "./controller/processController.js";
import * as userController from "./controller/userController.js";
import * as dashboardController from "./controller/dashboardController.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/servers", serverController.getServers);
app.post("/servers", serverController.deployServer);
app.get("/servers/:id/containers", serverController.getContainersOfServer);
app.post("/servers/:id/containers", serverController.deployContainerToServer);
app.get("/servers/:id/processes", serverController.getProcessesOfServer);

app.get("/processes", processController.getProcesses);

app.get("/users", userController.getUsers);
app.get("/users/:id", userController.getUser);
app.post("/users", userController.createUser);
app.patch("/users/:id", userController.updateUser);
app.delete("/users/:id", userController.deleteUser);

app.get("/alerts", dashboardController.getAlerts);
app.get("/vulnerabilities", dashboardController.getVulnerabilities);
app.get("/regions", dashboardController.getRegions);
app.get("/uploads", dashboardController.getUploads);
app.get("/roles", dashboardController.getRoles);
app.get("/permissions", dashboardController.getPermissions);
app.get("/pipelines", dashboardController.getPipelines);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});