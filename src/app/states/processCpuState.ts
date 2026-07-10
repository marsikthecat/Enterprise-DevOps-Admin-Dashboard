import { create } from "zustand";

export interface Process {
  pid: number;
  id: string;
  serverId: string;
  user: string;
  cpu: number;
  memory: number;
  threads: number;
  status: string;
  uptime: string;
  name: string;
  createdAt: string;
}

interface ProcessStore {
  processes: Process[];
  fetchProcesses: () => Promise<void>;
  startSimulation: () => void;
}

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],

  fetchProcesses: async () => {
    try {
      const res = await fetch("http://localhost:3000/processes");
      const data = await res.json();
      set({ processes: data });
    } catch (err) {
      console.error("fetch error", err);
    }
  },

  startSimulation: () => {
    if ((window as any).__processSimStarted) return;
    (window as any).__processSimStarted = true;
    let seconds = 0;

    setInterval(() => {
      seconds++;
      const current = get().processes;
      set({
        processes: current.map(p => {
          const r = Math.random();

          let cpuFluct = r > 0.6 ? 0.1 : r < 0.3 ? -0.1 : 0.2;
          let memoryFluct = 0;
          let threadFluct = 0;

          if (seconds % 60 === 0) {
            memoryFluct = cpuFluct * 10;
          }
          if (seconds % 180 === 0) {
            threadFluct = -cpuFluct * 10;
          }

          return {
            ...p,
            cpu: Number((p.cpu + cpuFluct).toFixed(1)),
            memory: Math.max(0, p.memory + memoryFluct),
            threads: Math.max(1, Math.round(p.threads + threadFluct)),
          };
        }),
      });
    }, 1000);
  },
}));