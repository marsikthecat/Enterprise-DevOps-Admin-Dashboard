import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';
import { useNetworkStore } from '../app/states/networkTrafficState';

export default function App() {
  const startSimulation = useNetworkStore(s => s.startSimulation);

  useEffect(() => {
    startSimulation();
  }, []);
  return <RouterProvider router={router} />;
}