import { useCallback, useState } from "react";
import { useApi } from "./useApi";
import type { AuditLogEntry } from "../types";

export function useAuditLog() {
  const api = useApi();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);

    try {
      const data = await api.getAuditLogs();
      setAuditLogs(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error("Failed to load audit logs:", error);
      setAuditLogs([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  const addAuditLog = useCallback(async ({ action, author }: { action: string; author: string }) => {
    try {
      const entry = await api.addAuditLog({ action, author });
      setAuditLogs((prev) => [entry, ...prev]);
      return entry;
    } catch (error) {
      console.error("Failed to add audit log:", error);
      throw error;
    }
  }, [api]);

  const exportAuditLogs = useCallback((format: "csv" | "json" | "txt" = "csv") => {
    if (!auditLogs.length) return;

    let content = "";

    if (format === "json") {
      content = JSON.stringify(auditLogs, null, 2);
    } else if (format === "csv") {
      const rows = ["timeStamp,action,author"];
      auditLogs.forEach((entry) => {
        rows.push(`"${entry.timeStamp}","${entry.action}","${entry.author}"`);
      });
      content = rows.join("\n");
    } else {
      content = auditLogs
        .map((entry) => `${entry.timeStamp} | ${entry.action} | ${entry.author}`)
        .join("\n");
    }

    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [auditLogs]);

  return {
    auditLogs,
    loading,
    fetchAuditLogs,
    addAuditLog,
    exportAuditLogs,
  };
}
