import * as service from "../service/processService.js";

export async function getProcesses(request, reply) {
  return service.getProcesses();
}