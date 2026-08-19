import { Shield, AlertTriangle, CheckCircle, Key, Lock, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import IncidentPaywallModal from "./dialogs/PaymentWall";
import { useApi } from "../../hooks/useApi";
import type { Alert, Vulnerability } from "../../types";

const securityEvents = [
  { time: "00:00", events: 12 },
  { time: "04:00", events: 8 },
  { time: "08:00", events: 24 },
  { time: "12:00", events: 18 },
  { time: "16:00", events: 32 },
  { time: "20:00", events: 15 },
  { time: "23:59", events: 9 },
];

export function Security() {
  const api = useApi();
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const [alertsResponse, vulnerabilitiesResponse] = await Promise.all([
          api.getAlerts(),
          api.getVulnerabilities(),
        ]);
        setRecentAlerts(alertsResponse);
        setVulnerabilities(vulnerabilitiesResponse);
      } catch (error) {
        console.error("Failed to fetch security data:", error);
      }
    };
    fetchSecurityData();
  }, [api]);

  const criticalAlerts = recentAlerts.filter((alert) => alert.severity === "critical").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-1">Security Center</h1>
        <p className="text-[#9CA3AF]">Monitor security events and vulnerabilities</p>
      </div>

      {/* Recent Alerts */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Security Alerts</h3>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === "critical"
                  ? "bg-[#EF4444]/5 border-[#EF4444]"
                  : alert.severity === "warning"
                  ? "bg-[#F59E0B]/5 border-[#F59E0B]"
                  : "bg-[#38BDF8]/5 border-[#38BDF8]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.severity === "critical"
                          ? "text-[#EF4444]"
                          : alert.severity === "warning"
                          ? "text-[#F59E0B]"
                          : "text-[#38BDF8]"
                      }`}
                    />
                    <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        alert.severity === "critical"
                          ? "bg-[#EF4444]/10 text-[#EF4444]"
                          : alert.severity === "warning"
                          ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                          : "bg-[#38BDF8]/10 text-[#38BDF8]"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-[#9CA3AF] mb-2">{alert.description}</p>
                  <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                    <span>{alert.time}</span>
                    <span>•</span>
                    <span className="text-[#38BDF8]">{alert.status}</span>
                  </div>
                </div>
                <button className="text-sm text-[#38BDF8] hover:text-[#0EA5E9] px-3 py-1" onClick={() => setPaywallOpen(true)}>
                  Investigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Events Chart */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-1">Security Events</h3>
        <p className="text-sm text-[#9CA3AF] mb-4">Events detected in the last 24 hours</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={securityEvents}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #38BDF8",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="events" fill="#38BDF8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vulnerabilities */}
      <div className="glass-panel rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Known Vulnerabilities</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f2937]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">PACKAGE</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">VERSION</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">SEVERITY</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">CVE</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#9CA3AF]">AFFECTED</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-[#9CA3AF]">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.map((vuln, i) => (
                <tr key={i} className="border-b border-[#1f2937]/50 hover:bg-[#1a2332] transition-colors">
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-white">{vuln.package}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#9CA3AF]">{vuln.version}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        vuln.severity === "high"
                          ? "bg-[#EF4444]/10 text-[#EF4444]"
                          : vuln.severity === "medium"
                          ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                          : "bg-[#38BDF8]/10 text-[#38BDF8]"
                      }`}
                    >
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="mono text-sm text-[#38BDF8]">{vuln.cve}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-[#9CA3AF]">{vuln.serverCount} servers</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-sm text-[#38BDF8] hover:text-[#0EA5E9]">Patch</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-[#10B981]" />
            <h4 className="text-sm font-semibold text-white">Encryption Status</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Data at Rest</span>
              <span className="text-[#10B981]">AES-256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Data in Transit</span>
              <span className="text-[#10B981]">TLS 1.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">SSH Keys</span>
              <span className="text-[#10B981]">RSA 4096</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <h4 className="text-sm font-semibold text-white">Access Control</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">MFA Enabled</span>
              <span className="text-[#10B981]">18 / 24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Active Sessions</span>
              <span className="text-[#38BDF8]">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Failed Logins</span>
              <span className="text-[#F59E0B]">8 today</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#F59E0B]" />
            <h4 className="text-sm font-semibold text-white">Firewall Rules</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Total Rules</span>
              <span className="text-white">247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Active Rules</span>
              <span className="text-[#10B981]">242</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Blocked IPs</span>
              <span className="text-[#EF4444]">1,428</span>
            </div>
          </div>
        </div>
      </div>

      <IncidentPaywallModal open={paywallOpen} onOpenChange={(o) => {setPaywallOpen(o)}} />
    </div>
  );
}
