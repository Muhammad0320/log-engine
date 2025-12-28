"use server";

import { fetchClient } from "@/lib/client";
import { getSession } from "@/lib/session";

export interface LogStat {
  time: Date;
  count: number;
}

export interface LogSummary {
  total_logs: number;
  error_count: number;
  service_count: number;
  error_rate: number;
}

export type TimeRange = "1h" | "6h" | "12h" | "24h" | "7d";

function getSmartBucket(range: TimeRange): string {
  switch (range) {
    case "1h":
      return "1m";
    case "6h":
      return "5m";
    case "12h":
      return "15m";
    case "24h":
      return "30m";
    case "7d":
      return "6h";
    default:
      return "1h";
  }
}

function calculateDataRange(range: TimeRange): { from: string; to: string } {
  const now = new Date();
  const past = new Date();

  switch (range) {
    case "1h":
      past.setHours(now.getHours() - 1);
      break;
    case "6h":
      past.setHours(now.getHours() - 6);
      break;
    case "12h":
      past.setHours(now.getHours() - 12);
      break;
    case "24h":
      past.setHours(now.getHours() - 24);
      break;
    case "7d":
      past.setDate(now.getDate() - 7);
      break;
  }

  return {
    from: past.toISOString(),
    to: now.toISOString(),
  };
}

export async function getLogStatAction(
  projectID: number,
  timeRange: TimeRange = "24h",
  forcedBucket?: string
) {
  const token = await getSession();

  const { from, to } = calculateDataRange(timeRange);

  const bucket = forcedBucket || getSmartBucket(timeRange);

  const params = new URLSearchParams({
    project_id: projectID.toString(),
    from,
    to,
    bucket,
  });

  try {
    const res = await fetchClient<{ stats: { time: string; count: number }[] }>(
      `/logs/stats?${params.toString()}`,
      { method: "GET" },
      token
    );

    const rawStats = res.stats || [];

    const stats: LogStat[] = rawStats.map((s) => ({
      time: new Date(s.time),
      count: s.count,
    }));

    return { success: true, data: stats };
  } catch (error) {
    console.error("failed to fetch stats", error);
    return { success: true, data: [] };
  }
}

export async function getLogSummaryAction(
  projectId: number,
  range: TimeRange = "24h"
) {
  const token = await getSession();
  const { from, to } = calculateDataRange(range);

  const params = new URLSearchParams({
    project_id: projectId.toString(),
    from,
    to,
  });

  try {
    const data = await fetchClient<{ summary: LogSummary }>(
      `/logs/summary?${params.toString()}`,
      { method: "GET" },
      token
    );
    return { success: true, data: data.summary };
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return { success: false, data: null };
  }
}
