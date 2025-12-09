import { LogEntry } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const LogSchema = z.object({
  timestamp: z.string(),
  level: z.string(),
  service: z.string(),
  message: z.string(),
  project_id: z.number(),
});

type ConnectionStatus = "CONNECTING" | "OPEN" | "CLOSED" | "ERROR";

export function useLogStream(projectID: number, token: string | null) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("CLOSED");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!projectID || !token) return;

    const wsBase =
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/api/v1";
    const wsUrl = `${wsBase}/logs/ws?project_id=${projectID}&token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WS Connected");
      setStatus("OPEN");
    };

    ws.current.onmessage = (event) => {
      try {
        const raw: LogEntry = JSON.parse(event.data);

        const result = LogSchema.safeParse(raw);

        if (result.success) {
          setLogs((prevLogs) => [result.data, ...prevLogs]);
        } else {
          console.warn("⚠️ Invalid log packet received:", result.error);
        }
      } catch (error) {
        console.error(" 🔥 Failed to parse WS message:", event.data);
      }
    };

    ws.current.onclose = () => setStatus("CLOSED");
    ws.current.onerror = () => setStatus("ERROR");

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [projectID, token]);

  return { logs, status };
}
