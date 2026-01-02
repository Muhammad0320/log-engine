import {
  getLogStatAction,
  getLogSummaryAction,
  LogStat,
  LogSummary,
} from "@/actions/metrics";
import { LogEntry } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

export function useLiveMetrics(projectId: number | null, liveLogs: LogEntry[]) {
  const [stats, setStats] = useState<LogStat[]>([]);
  const [summary, setSummary] = useState<LogSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const latProcessedTimeRef = useRef<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;
    setTimeout(() => {
      setLoading(true);
    }, 0);

    Promise.all([
      getLogStatAction(projectId),
      getLogSummaryAction(projectId),
    ]).then(([statsRes, summaryRes]) => {
      if (isMounted) {
        if (statsRes.success) setStats(statsRes.data);
        if (summaryRes.success) setSummary(summaryRes.data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // The 'Magic' coupling (Live updates);
  useEffect(() => {
    if (liveLogs.length === 0 || !summary) return;

    const latestlog = liveLogs[0];

    if (latestlog.timestamp === latProcessedTimeRef.current) return;
    latProcessedTimeRef.current = latestlog.timestamp;

    setTimeout(() => {
      setSummary((prev) => {
        if (!prev) return null;

        const totalLogs = prev.total_logs + 1;
        const isError =
          latestlog.level.toLowerCase() === "error" ||
          latestlog.level.toLowerCase() === "critical";
        const newErrors = prev.error_count + (isError ? 1 : 0);

        return {
          ...prev,
          total_logs: totalLogs,
          error_count: newErrors,
          error_rate: (newErrors / totalLogs) * 100,
          service_count: prev.service_count,
        };
      });
    }, 0);

    setTimeout(() => {
      setStats((prevStats) => {
        if (prevStats.length === 0) return prevStats;

        const logDate = new Date(latestlog.timestamp);
        logDate.setHours(0, 0, 0);
        const bucketKey = logDate.toISOString();

        const lastStat = prevStats[prevStats.length - 1];

        // Case 1: The log belongs to the current latest bucket
        if (lastStat.time === bucketKey) {
          const updated = [...prevStats];

          updated[updated.length - 1] = {
            ...lastStat,
            count: lastStat.count + 1,
          };
          return updated;
        }

        // Case 2: It's a new hour
        if (new Date(bucketKey) > new Date(lastStat.time)) {
          return [...prevStats.slice(1), { time: bucketKey, count: 1 }];
        }

        return prevStats;
      });
    }, 0);
  }, [liveLogs]); // Run only when a new log arrives via ws

  return { stats, summary, loading };
}
