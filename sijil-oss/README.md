# Sijil OSS

**The Paranoid Log Engine.** Zero Retention. AI Forensics. 100k+ Logs/Sec.

Sijil is a high-performance observability platform built for developers who care about speed, security, and privacy. We strip PII before it hits the disk and delete your logs the moment you don't need them.

## ✨ Features

- **Zero Retention**: Logs are ephemeral. We don't store them longer than necessary. You just tag them as paranoid and set the hours it should last for.
- **PII Stripping**: Automatically redact sensitive information (emails, credit cards, etc.) at the source.
- **High Performance**: Capable of ingesting 100k+ logs per second with minimal overhead.
- **AI Forensics**: Sijil IQ - Root Cause Analysis (RCA). Sijil Pilot - Natural language search, no complex querying.
- **Universal Compatibility**: Works with any language or framework via our Agent or SDKs.

---

## 🚀 Sijil Agent (Sidecar)

The Sijil Agent is a lightweight binary designed to run alongside your application (as a sidecar or background process). It tails your existing log files, parses them, and securely pushes them to the Sijil Cloud.

### Installation

Download the latest binary for your OS from the [Releases Page](https://github.com/Muhammad0320/sijil/releases).

### Usage

**Linux / macOS**

```bash
./sijil-agent -f /var/log/nginx/access.log \
  -pk pk_live_... \
  -sk sk_live_... \
  -s nginx-loadbalancer
```

**Windows (PowerShell)**

```powershell
.\sijil-agent.exe -f C:\Logs\app.log -pk pk_live_... -sk sk_live_... -s my-windows-service
```

### Configuration Flags

| Flag      | Description                             | Default                           |
| :-------- | :-------------------------------------- | :-------------------------------- |
| `-f`      | Path to the log file to tail            | `test.log`                        |
| `-s`      | Service name to tag logs with           | `log-agent-v1`                    |
| `-pk`     | **Required.** Your Public API Key       |                                   |
| `-sk`     | **Required.** Your Secret API Key       |                                   |
| `-format` | Log format: `regex` or `json`           | `regex`                           |
| `-url`    | Sijil Ingest Endpoint (for self-hosted) | `https://api.sijil.dev/v1/ingest` |

---

## 📦 SDKs

Prefer to integrate directly into your code? We have SDKs for that.

### 1. Node.js / TypeScript

Compatible with Next.js, Express, NestJS, etc.

**Installation**

```bash
npm install @sijil/node
```

**Usage**

```typescript
import { SijilLogger } from "@sijil/node";

const logger = new SijilLogger({
  apiKey: process.env.SIJIL_API_KEY,
  apiSecret: process.env.SIJIL_API_SECRET,
  service: "payment-api",
  flushInterval: 1000, // Optional: Flush logs every 1s
});

logger.info("Payment processed", { amount: 500, currency: "USD" });
logger.error("Transaction failed", { error_code: "ERR_503" });
```

### 2. Python

Compatible with FastAPI, Django, Flask, scripts, etc.

**Installation**

```bash
pip install sijil
```

**Usage**

```python
from sijil import SijilLogger
import os

logger = SijilLogger(
    api_key=os.getenv("SIJIL_API_KEY"),
    api_secret=os.getenv("SIJIL_API_SECRET"),
    service="auth-service"
)

logger.info("User logged in", {"user_id": "u_12345"})
logger.critical("Database connection lost", {"retry_attempt": 3})

# Ensure all logs are sent before exiting
logger.close()
```

### 3. Go

Compatible with Fiber, Gin, Chi, Stdlib, etc.

**Installation**

```bash
go get github.com/sijil/sijil-oss/sdk/go
```

**Usage**

```go
package main

import (
    "github.com/sijil/sijil-oss/sdk/go"
    "time"
)

func main() {
    client := sijil.NewClient(sijil.Config{
        APIKey:    "pk_live_...",
        APISecret: "sk_live_...",
        Service:   "worker-1",
        FlushTime: 500 * time.Millisecond,
    })
    defer client.Close()

    client.Info("Job started", map[string]interface{}{"job_id": 101})
    client.Error("Worker panic recovered", map[string]interface{}{"stack": "..."})
}
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to set up the dev environment.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Sijil Team**
