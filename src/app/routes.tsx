import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Servers } from "./components/server/Servers";
import { ServerDetail } from "./components/server/ServerDetail";
import { Network } from "./components/network/Network";
import { Processes } from "./components/processes/Processes";
import { Cloud } from "./components/cloud/Cloud";
import { Users } from "./components/userMangement/Users";
import { Security } from "./components/security/Security";
import { Login } from "./components/login/Login";
import { Signup } from "./components/signup/Signup";

function requireAuth() {
  const authed = localStorage.getItem("auth") === "true";
  if (!authed) return <Navigate to="/login" replace />;
  return null;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const redirect = requireAuth();
  return redirect ?? <>{children}</>;
}

export const router = createBrowserRouter([
  { path: "/login",  Component: Login },
  { path: "/signup", Component: Signup },
  {
    path: "/",
    element: <AuthGuard><DashboardLayout /></AuthGuard>,
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
