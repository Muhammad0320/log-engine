package identity

import (
	"context"
	"time"
)

type Repository interface {
	Create(ctx context.Context, u *User) (int, error)
	GetByEmail(ctc context.Context, email string) (*User, error)
	GetByID(ctx context.Context, id int) (*User, error)
	UpdateVerification(ctx context.Context, userID int, isVerified bool) error
	SetResetToken(ctx context.Context, email string, token string, expiry time.Time) error
}
