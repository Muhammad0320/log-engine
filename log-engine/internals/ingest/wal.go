package ingest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log-engine/internals/database"
	"os"
	"sync"
)

type WAL struct {
	mu sync.Mutex
	file *os.File 
}

func NewWal(path string) (*WAL, error) {

	file, err := os.OpenFile(path, os.O_APPEND | os.O_CREATE | os.O_RDWR, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to open WAL: %w", err)
	}

	return &WAL{file: file}, nil
}

func (w *WAL) WriteLog(entry database.LogEntry) error {

	w.mu.Lock()
	defer w.mu.Unlock()

	data, err := json.Marshal(entry)
	if err != nil {
		return fmt.Errorf("wal marshal error: %w", err)
	}

	if _, err := w.file.Write(data); err != nil {
		return fmt.Errorf("wal write error: %w", err)
	}

	// Sync (The paranoid step)
	if err := w.file.Sync(); err != nil {
		return fmt.Errorf("wal sync error: %w", err)
	}

	return  nil 
}

func (w *WAL) WriteBatch(entries []database.LogEntry) error {
	w.mu.Lock()
	defer w.mu.Unlock()

	var buffer bytes.Buffer
	buffer.Grow(len(entries) * 150)

	for _, entry := range entries {
		data, err := json.Marshal(entry) 
		if err != nil {
			return fmt.Errorf("wal marshal error: %w", err)
		}
		buffer.Write(data)
		buffer.WriteByte('\n')
	}

	if _, err := w.file.Write(buffer.Bytes()); err != nil {
		return fmt.Errorf("wal write error: %w", err)
	}

	// Sync (The paranoid step)
	if err := w.file.Sync(); err != nil {
		return fmt.Errorf("wal sync error: %w", err)
	}

	return nil 
}

func (w *WAL) Close() error {
	return w.file.Close()
}

func (w *WAL) Recover() ([]database.LogEntry, error) {

	w.mu.Lock()
	defer w.mu.Unlock()

	_, err :=w.file.Seek(0, 0)
	if err != nil {
		return nil, err
	}

	var logs []database.LogEntry
	
	// Use json decoder instead of scanner. It allows read object-by-object
	decoder := json.NewDecoder(w.file)

	for decoder.More() {
		var entry database.LogEntry
		if err := decoder.Decode(&entry); err != nil {	
			fmt.Printf("⚠️ WAL corrupt Chunk: %v\n", err)
			continue
		}
		logs = append(logs, entry)
	}

	return  logs, nil 
}

func (w *WAL) Clear() error {
	w.mu.Lock()
	defer w.mu.Unlock()

	if err := w.file.Truncate(0); err != nil {
		return  err
	}

	_, err := w.file.Seek(0, 0)	
	return  err
}
