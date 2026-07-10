import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { useNetworkStore } from '../app/states/networkTrafficState';
import { useProcessStore } from './states/processCpuState';

export default function App() {
  const startNetworkSimulation = useNetworkStore(s => s.startSimulation);
  const fetchProcesses = useProcessStore(s => s.fetchProcesses);
  const startCpuSimulation = useProcessStore(s => s.startSimulation);

  useEffect(() => {
    fetchProcesses().then(() => {
      startCpuSimulation();
    });
  }, []);

  useEffect(() => {
    startNetworkSimulation();
  }, []);
  return <RouterProvider router={router} />;
}