package auth

import (
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	ShardCount = 256
	TTL        = 5 * time.Minute
)

type ProjectCacheEntry struct {
	ProjectID int 
	Expires int64
}

// The Room (shard)
type CasheShard struct {
	sync.RWMutex
	items map[string]ProjectCacheEntry
}

// The Hallway (The manager)
type AuthCache struct {
	shards [ShardCount]*CasheShard
	db *pgxpool.Pool
}

func NewAuthtCache(db *pgxpool.Pool) *AuthCache {
	c := &AuthCache{db: db} 
	for i := 0; i < ShardCount; i++ {
		c.shards[i] = &CasheShard{
			items: make(map[string]ProjectCacheEntry),
		}
	}
	return c; 
}