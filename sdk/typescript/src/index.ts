interface Config {
  apiKey: string;
  apiSecret: string;
  endpoint?: string;
  flushInterval?: number;
  batchSize?: number;
  maxRetries?: number;
}

interface LogEntry {
  level: "info" | "error" | "warn" | "debug";
  message: string;
  service?: string;
  timestamp: string; // ISO string
  data?: Record<string, any>;
}

export class Logengine {
  private config: Required<Config>;
  private queue: LogEntry[] = [];
  private timer: NodeJS.Timeout | null = null;
  private activeRequests = 0;
  private readonly MAX_CURRENT_REQUEST = 5;
  private serviceName = "default";

  constructor(config: Config) {
    if (!config.apiKey || !config.apiSecret) {
      throw new Error("LogEngine: Credentials Missing!");
    }

    this.config = {
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      endpoint: config.endpoint || "http://localhost:8080/api/v1/logs",
      flushInterval: Math.max(config.flushInterval || 1000, 250),
      batchSize: config.batchSize || 100,
      maxRetries: config.maxRetries || 3,
    };

    this.timer = setInterval(() => this.flush(), this.config.flushInterval);
  }

  public setService(name: string) {
    this.serviceName = name;
  }

  public info(message: string, data?: Object) {
    this.push("info", message, data);
  }
  public debug(message: string, data?: Object) {
    this.push("debug", message, data);
  }
  public warn(message: string, data?: Object) {
    this.push("warn", message, data);
  }
  public error(message: string, data?: Object) {
    this.push("error", message, data);
  }

  private push(level: string, message: string, data?: Object) {}

  private flush() {}
}
