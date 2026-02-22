package tenant

import (
	"context"

	"cortex/ent"

	"github.com/google/uuid"
)

type Service interface {
	CreateTenant(ctx context.Context, params CreateTenantParams) (*Tenant, error)
	GetTenantByDomain(ctx context.Context, identifier string) (*Tenant, error)
	GetTenantByUUID(ctx context.Context, uuid uuid.UUID) (*Tenant, error)
	GetTenantByID(ctx context.Context, id int) (*Tenant, error)
	GetTenants(ctx context.Context, filter GetTenantFilter) ([]*Tenant, error)
	UpdateTenant(ctx context.Context, params UpdateTenantParams) (*Tenant, error)
	DeleteTenant(ctx context.Context, uuid uuid.UUID) error
	GetTenantStats(ctx context.Context, tenantID int) (*TenantStats, error)
}

type Repository interface {
	Create(ctx context.Context, params CreateTenantParams) (*ent.Tenant, error)
	FindByDomain(ctx context.Context, identifier string) (*ent.Tenant, error)
	FindByUUID(ctx context.Context, uuid uuid.UUID) (*ent.Tenant, error)
	FindByID(ctx context.Context, id int) (*ent.Tenant, error)
	FindAll(ctx context.Context, filter GetTenantFilter) ([]*ent.Tenant, error)
	Update(ctx context.Context, params UpdateTenantParams) (*ent.Tenant, error)
	Delete(ctx context.Context, uuid uuid.UUID) error
}
