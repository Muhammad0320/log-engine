"use server";

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
  timeRange: string = "24h"
) {}
