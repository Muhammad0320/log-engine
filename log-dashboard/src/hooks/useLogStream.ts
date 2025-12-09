import { LogEntry } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);

  const connect = useCallback(() => {
    if (!projectID || !token) return;

    const wsBase =
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/api/v1";
    const wsUrl = `${wsBase}/logs/ws?project_id=${projectID}&token=${token}`;

    setStatus("CONNECTING");
    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      console.log("🟢 WS Connected");
      setStatus("OPEN");
      retryCount.current = 0;
    };

    socket.onmessage = (event) => {
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

    socket.onclose = (event) => {
      if (event.wasClean) {
        setStatus("CLOSED");
        return;
      }

      setStatus("ERROR");
      ws.current = null;

      const delay = Math.min(1000 * Math.pow(2, retryCount.current), 30000);
      console.log(`⚠️ WS closed. Reconnecting in ${delay}ms...`);

      reconnectTimeout.current = setTimeout(() => {
        retryCount.current++;
        connect();
      }, delay);
    };
    socket.onerror = () => {
      socket.close();
    };
  }, [projectID, token]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) {
        ws.current.close(1000, "Unmounting");
      }
    };
  }, [connect]);

  return { logs, status };
}
