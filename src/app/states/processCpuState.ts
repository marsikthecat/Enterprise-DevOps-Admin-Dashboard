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
  applyProcessUpdates: (updates: Process[]) => void;
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

  applyProcessUpdates: (updates) => {
    const updatesById = new Map(updates.map((process) => [process.id, process]));
    set((state) => ({
      processes: state.processes.map((process) => updatesById.get(process.id) ?? process),
    }));
  },

  startSimulation: () => {
    if ((window as any).__processSimStarted) return;
    (window as any).__processSimStarted = true;
    let seconds = 0;

    setInterval(() => {
      seconds++;
      if (seconds > 60) seconds = 0;
      const current = get().processes;
      set({
        processes: current.map(p => {
          if (p.status === 'S') {
            return {
              ...p,
              cpu: 0,
          };
          }
          const r = Math.random();

          let cpuFluct = r > 0.5 ? 0.1 : r < 0.3 ? -0.3 : 0.2;
          let memoryFluct = 0;
          let threadFluct = 0;

          if (seconds % 10 === 0) {
            memoryFluct += r > 0.5 ? 0.05 : -0.05;
          }
          if (seconds % 30 === 0) {
            threadFluct += r > 0.5 ? 1 : -1;
          }
          return {
            ...p,
            cpu: Number((p.cpu + cpuFluct).toFixed(1)),
            memory: Number(Math.max(0, p.memory + memoryFluct).toFixed(2)),
            threads: Math.max(1, p.threads + threadFluct),
          };
        }),
      });
    }, 1000);
  },
}));