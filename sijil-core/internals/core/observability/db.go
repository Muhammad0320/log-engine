package observability

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func RunRetentionPolicy(ctx context.Context, db *pgxpool.Pool) {
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			_, err := db.Exec(ctx, "SELECT drop_chunks('logs', INTERVAL '30 days');")
			if err != nil {
				fmt.Printf("⚠️ Global Retention Policy failed: %v\n", err)
			} else {
				fmt.Println("🧹 Global Retention policy Ran: Cleared logs > 30 days old.")
			}
		case <-ctx.Done():
			return
		}
	}
}
