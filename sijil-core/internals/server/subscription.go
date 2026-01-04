package server

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func StartSubscriptionManager(ctx context.Context, db *pgxpool.Pool) {

	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {

		select {
		case <-ticker.C:
			downgradeExpiredUsers(ctx, db)
		case <-ctx.Done():
			return

		}

	}

}

func downgradeExpiredUsers(ctx context.Context, db *pgxpool.Pool) {

	query := `
		UPDATE users 
		SET plan_id = 1, plan_expires_at = NULL
		WHERE plan_expires_at < NOW() AND plan_id < 1
		`
	tag, err := db.Exec(ctx, query)
	if err != nil {
		log.Printf("⚠️ Subscription Manager Failed: %v", err)
		return
	}

	if tag.RowsAffected() > 0 {
		fmt.Printf("📉 Repo Man: Downgraded %d expired users to free tier", tag.RowsAffected())
	}
}
