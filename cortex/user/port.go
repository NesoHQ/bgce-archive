package user

import (
	"context"

	"cortex/ent"
)

// Repository defines the interface for user data operations
type Repository interface {
	Create(ctx context.Context, user *ent.User) (*ent.User, error)
	FindByID(ctx context.Context, id int) (*ent.User, error)
	FindByEmail(ctx context.Context, email string) (*ent.User, error)
	FindByUsername(ctx context.Context, username string) (*ent.User, error)
	Update(ctx context.Context, user *ent.User) (*ent.User, error)
	Delete(ctx context.Context, id int) error
	List(ctx context.Context, limit, offset int) ([]*ent.User, error)
	UpdateLastLogin(ctx context.Context, id int) error
}
