import { create } from "zustand";

interface NetworkPoint {
  time: string;
  in: number;
  out: number;
}

interface NetworkStore {
  networkData: NetworkPoint[];
  networkThroughput: number;
  startSimulation: () => void;
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  networkData: (() => {
    const now = Date.now();

    return Array.from({ length: 30 }, (_, i) => ({
      time: new Date(now - (29 - i) * 1000).toLocaleTimeString(),
      in: Number((2 + Math.random() * 3).toFixed(2)),
      out: Number((1 + Math.random() * 2).toFixed(2)),
    }));
  })(),
    
  networkThroughput: 0,
  startSimulation: () => {
    if ((window as any).__networkStarted) return;
    (window as any).__networkStarted = true;

    setInterval(() => {
      const current = get().networkData;
      const last = current[current.length - 1];

      const newIn = Math.max(0,
        last.in + (Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5)
      );
      const newOut = Math.max(0,
        last.out + (Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5)
      );

      set({
        networkData: [
          ...current.slice(1),
          {
            time: new Date().toLocaleTimeString(),
            in: Number(newIn.toFixed(2)),
            out: Number(newOut.toFixed(2)),
          },
        ],
        networkThroughput: Number((newIn + newOut).toFixed(2)),
      });
    }, 1000);
  },
}));