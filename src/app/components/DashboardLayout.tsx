import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Server,
  Network,
  Activity,
  Cloud,
  Users,
  Shield,
  Bell,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../common/ui/tooltip";
import { useCurrentUser } from "../hooks/useCurrentUser";

const latestNews = [
  "Production API latency is back within normal range.",
  "Database backup completed successfully at 09:42 UTC.",
  "3 security updates are ready for review.",
];

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/servers", label: "Servers", icon: Server },
  { path: "/network", label: "Network", icon: Network },
  { path: "/processes", label: "Processes", icon: Activity },
  { path: "/cloud", label: "Cloud", icon: Cloud },
  { path: "/users", label: "Users", icon: Users },
  { path: "/security", label: "Security", icon: Shield },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const { name, email, clearCurrentUser } = useCurrentUser();

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    clearCurrentUser();
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-[#0B0F17] text-[#E5E7EB] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-[#1f2937] flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">DevOops Central</div>
              <div className="text-[10px] text-[#9CA3AF] mono">v2.8.4</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30"
                    : "text-[#9CA3AF] hover:bg-[#1a2332] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2937]">
          <div className="flex items-center gap-2 mb-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label="View latest news"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1a2332] hover:bg-[#1f2937] rounded-lg text-sm transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="mono text-[#38BDF8]">3</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="end"
                sideOffset={8}
                className="w-80 border border-[#334155] bg-[#111827] p-4 text-[#E5E7EB] shadow-xl"
              >
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Latest news</div>
                    <div className="mt-1 text-[11px] text-[#9CA3AF]">System updates and alerts</div>
                  </div>
                  <div className="space-y-2">
                    {latestNews.map((newsItem) => (
                      <div key={newsItem} className="border-l-2 border-[#38BDF8] pl-3 text-xs leading-5 text-[#CBD5E1]">
                        {newsItem}
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
            <button className="flex items-center justify-center px-3 py-2 bg-[#1a2332] hover:bg-[#1f2937] rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{name}</div>
              <div className="text-xs text-[#9CA3AF] truncate">{email || "No email"}</div>
            </div>
            <button
              type="button"
              aria-label="Logout"
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-[#1a2332] hover:bg-[#1f2937] text-[#9CA3AF] hover:text-white transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
