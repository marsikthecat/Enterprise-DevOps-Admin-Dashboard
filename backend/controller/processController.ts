import * as service from "../service/processService.js";

export async function getProcesses() {
  return service.getProcesses();
}