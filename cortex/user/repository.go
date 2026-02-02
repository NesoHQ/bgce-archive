package user

import (
	"context"
	"time"

	"cortex/ent"
	"cortex/ent/user"
)

type repository struct {
	client *ent.Client
}

// NewRepository creates a new user repository
func NewRepository(client *ent.Client) Repository {
	return &repository{client: client}
}

func (r *repository) Create(ctx context.Context, userData *ent.User) (*ent.User, error) {
	return r.client.User.
		Create().
		SetUsername(userData.Username).
		SetEmail(userData.Email).
		SetPasswordHash(userData.PasswordHash).
		SetNillableFullName(&userData.FullName).
		SetRole(userData.Role).
		SetStatus(userData.Status).
		Save(ctx)
}

func (r *repository) FindByID(ctx context.Context, id int) (*ent.User, error) {
	return r.client.User.
		Query().
		Where(user.ID(id)).
		First(ctx)
}

func (r *repository) FindByEmail(ctx context.Context, email string) (*ent.User, error) {
	return r.client.User.
		Query().
		Where(user.Email(email)).
		First(ctx)
}

func (r *repository) FindByUsername(ctx context.Context, username string) (*ent.User, error) {
	return r.client.User.
		Query().
		Where(user.Username(username)).
		First(ctx)
}

func (r *repository) Update(ctx context.Context, userData *ent.User) (*ent.User, error) {
	return r.client.User.
		UpdateOneID(userData.ID).
		SetNillableUsername(&userData.Username).
		SetNillableEmail(&userData.Email).
		SetNillableFullName(&userData.FullName).
		Save(ctx)
}

func (r *repository) Delete(ctx context.Context, id int) error {
	return r.client.User.
		DeleteOneID(id).
		Exec(ctx)
}

func (r *repository) List(ctx context.Context, limit, offset int) ([]*ent.User, error) {
	return r.client.User.
		Query().
		Limit(limit).
		Offset(offset).
		Order(ent.Desc(user.FieldCreatedAt)).
		All(ctx)
}

func (r *repository) UpdateLastLogin(ctx context.Context, id int) error {
	now := time.Now()
	return r.client.User.
		UpdateOneID(id).
		SetLastLoginAt(now).
		Exec(ctx)
}
