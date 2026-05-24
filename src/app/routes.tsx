import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/pages/Dashboard";
import { Servers } from "./components/pages/Servers";
import { ServerDetail } from "./components/pages/ServerDetail";
import { Network } from "./components/pages/Network";
import { Processes } from "./components/pages/Processes";
import { Cloud } from "./components/pages/Cloud";
import { Users } from "./components/pages/Users";
import { Security } from "./components/pages/Security";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "servers", Component: Servers },
      { path: "servers/:id", Component: ServerDetail },
      { path: "network", Component: Network },
      { path: "processes", Component: Processes },
      { path: "cloud", Component: Cloud },
      { path: "users", Component: Users },
      { path: "security", Component: Security },
    ],
  },
]);
