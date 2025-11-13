package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/nxadm/tail"
)

type Log struct {
	Level string
	Message string
	Service string
}

func main() {

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	fmt.Println("starting to tail test.log")
	
	t, err := tail.TailFile("test.log", tail.Config{Follow: true})
	if err != nil {
		log.Fatalf("Failed to tail file: %v", err)
	}
	
	
	for line := range t.Lines {
		
		newLog := Log{Level: "info", Service: "log-agent-v1", Message: line.Text}
		jsonData, err := json.Marshal(newLog)
		if err != nil {
			fmt.Printf("error marchaling json: %s", err)
			continue
		}


	// Create a new HTTP request
	req, err := http.NewRequest("POST", "http://localhost:8080/api/v1/logs", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		continue
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %v\n", err)
		continue
	}
	
	io.ReadAll(req.Body)
	resp.Body.Close()
	
	fmt.Printf("Send log, server responded with status: %d\n", resp.StatusCode)
	}
}