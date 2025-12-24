package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"sync/atomic"
	"time"
)

const (
	URL         = "http://localhost:8080/api/v1/logs"
	Concurrency = 50      // 50 parallel connections
	TotalLogs   = 500_000 // 500k Logs (Real stress)
	BatchSize   = 1000    // Larger batches = Higher Throughput

	// STOP!
	// 1. Go to Postman/Curl
	// 2. Login to your API: POST /api/v1/auth/login
	// 3. Copy the "token" from the response.
	// 4. Paste it below.
	JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjcxNjU0MjEsImlhdCI6MTc2NjU2MDYyMSwic3ViIjoxfQ.HNJRs2_UneYEXUMombs7DLwtg3ku-8kS38XBE3wLWHg"
)

func main() {
	var success int64
	var fail int64

	totalRequests := TotalLogs / BatchSize
	reqsPerWorker := totalRequests / Concurrency

	fmt.Printf("🔥 Stress Test: Sending %d logs in batches of %d.\n", TotalLogs, BatchSize)
	fmt.Printf("🔥 Total HTTP Requests: %d (%d per worker)\n", totalRequests, reqsPerWorker)

	// 1. PRE-GENERATE PAYLOAD (Optimization: Don't measure JSON allocs, measure Network/DB)
	var batch []map[string]interface{} // changed to interface{} for flexibility
	for k := 0; k < BatchSize; k++ {
		batch = append(batch, map[string]interface{}{
			"level":    "info",
			"message":  fmt.Sprintf("stress test log payload %d", k),
			"service":  "stress-bot",
			"metadata": map[string]string{"env": "prod", "zone": "us-east-1"},
		})
	}
	payload, _ := json.Marshal(batch)

	start := time.Now()
	var wg sync.WaitGroup
	wg.Add(Concurrency)

	for i := 0; i < Concurrency; i++ {
		go func() {
			defer wg.Done()
			client := &http.Client{Timeout: 30 * time.Second}

			for j := 0; j < reqsPerWorker; j++ {
				req, _ := http.NewRequest("POST", URL, bytes.NewBuffer(payload))
				req.Header.Set("Content-Type", "application/json")
				// Your middleware expects "Bearer <token>"
				req.Header.Set("Authorization", "Bearer "+JWT_TOKEN)

				resp, err := client.Do(req)
				if err != nil {
					atomic.AddInt64(&fail, 1)
					fmt.Printf("E")
				} else {
					if resp.StatusCode > 299 {
						atomic.AddInt64(&fail, 1)
						// Print status to debug (e.g., S401 means Auth failed)
						fmt.Printf("S%d ", resp.StatusCode)
					} else {
						atomic.AddInt64(&success, int64(BatchSize))
					}
					resp.Body.Close()
				}
			}
		}()
	}

	wg.Wait()
	duration := time.Since(start)

	fmt.Println("\n\n--- RESULTS ---")
	fmt.Printf("Time: %v\n", duration)
	fmt.Printf("RPS:  %.2f logs/sec\n", float64(TotalLogs)/duration.Seconds())
	fmt.Printf("✅ Logs Ingested: %d\n", success)
	fmt.Printf("❌ Batches Failed: %d\n", fail)
}
