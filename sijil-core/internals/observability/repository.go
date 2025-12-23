package observability

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	SearchLogs(ctx context.Context, projectID, limit, offset int, query string, from, to time.Time) ([]LogEntry, error)
	GetStats(ctx context.Context, projectID int, from, to time.Time, bucket string) ([]LogStat, error)
	GetSummary(ctx context.Context, projectID int, from, to time.Time) (*LogSummary, error)
}

type postgresRepository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &postgresRepository{db: db}
}

func (r *postgresRepository) SearchLogs(ctx context.Context, projectID, limit, offset int, searchQuery string, from, to time.Time, retentionDays int) ([]LogEntry, error) {

	// 1. Safety: clamp limit
	const MaxLimit = 1000
	if limit > MaxLimit {
		limit = MaxLimit
	}

	// 2.Enforce a db timeout
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	args := make([]any, 0)
	argsCounter := 1

	var queryBuilder strings.Builder
	queryBuilder.WriteString(fmt.Sprintf(`SELECT timestamp, level, message, service, data
		FROM logs WHERE project_id = $%d`, argsCounter))
	args = append(args, projectID)
	argsCounter++

	// Conditionally add the WHERE clause for search
	if searchQuery != "" {
		// This is the FTS part
		queryBuilder.WriteString(fmt.Sprintf(" WHERE search_vector @@ plainto_tsquery('simple', $%d)", argsCounter))
		args = append(args, searchQuery)
		argsCounter++
	}
	queryBuilder.WriteString(fmt.Sprintf(" AND timestamp > NOW() - INTERVAL '%d days'", retentionDays))

	queryBuilder.WriteString(fmt.Sprintf(" ORDER BY timestamp DESC LIMIT $%d OFFSET $%d", argsCounter, argsCounter+1))
	args = append(args, limit, offset)

	getSQL := queryBuilder.String()
	fmt.Println("Final Query:", getSQL)

	rows, err := r.db.Query(ctx, getSQL, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to get logs: %w", err)
	}
	defer rows.Close()

	var logs []LogEntry
	for rows.Next() {
		var log LogEntry
		err := rows.Scan(&log.Timestamp, &log.Level, &log.Message, &log.Service, &log.Data)
		if err != nil {
			return nil, fmt.Errorf("failed to scan log: %w", err)
		}
		logs = append(logs, log)
	}

	return logs, nil

}

// Implement GetStats and GetSummary using the SQL logic you already wrote in db.go
// (I will omit them for brevity, but you just copy-paste them here and adapt the signature)
func (r *postgresRepository) GetStats(ctx context.Context, projectID int, from, to time.Time, bucket string) ([]LogStat, error) {
	// ... Copy from old db.go ...
	return nil, nil // placeholder
}

func (r *postgresRepository) GetSummary(ctx context.Context, projectID int, from, to time.Time) (*LogSummary, error) {
	// ... Copy from old db.go ...
	return nil, nil // placeholder
}
