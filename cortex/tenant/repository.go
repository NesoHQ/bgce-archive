package tenant

import (
	"context"
	"fmt"

	"cortex/ent"
	"cortex/ent/tenant"

	"github.com/google/uuid"
)

type repository struct {
	ent *ent.Client
}

func NewRepository(ent *ent.Client) Repository {
	return &repository{
		ent: ent,
	}
}

func (r *repository) Create(ctx context.Context, params CreateTenantParams) (*ent.Tenant, error) {
	builder := r.ent.Tenant.Create().
		SetName(params.Name).
		SetSlug(params.Slug).
		SetPlan(tenant.Plan(params.Plan)).
		SetStatus(tenant.StatusActive)

	if params.Domain != nil {
		builder.SetDomain(*params.Domain)
	}

	return builder.Save(ctx)
}

func (r *repository) FindByDomain(ctx context.Context, identifier string) (*ent.Tenant, error) {
	// Try to find by slug first (for subdomains and localhost)
	t, err := r.ent.Tenant.Query().
		Where(tenant.SlugEQ(identifier)).
		First(ctx)

	if err == nil {
		return t, nil
	}

	// If not found by slug, try by domain (for custom domains)
	t, err = r.ent.Tenant.Query().
		Where(tenant.DomainEQ(identifier)).
		First(ctx)
	if err != nil {
		return nil, fmt.Errorf("tenant not found for identifier: %s", identifier)
	}

	return t, nil
}

func (r *repository) FindByUUID(ctx context.Context, uuid uuid.UUID) (*ent.Tenant, error) {
	return r.ent.Tenant.Query().
		Where(tenant.UUIDEQ(uuid)).
		First(ctx)
}

func (r *repository) FindByID(ctx context.Context, id int) (*ent.Tenant, error) {
	return r.ent.Tenant.Query().
		Where(tenant.IDEQ(id)).
		First(ctx)
}

func (r *repository) FindAll(ctx context.Context, filter GetTenantFilter) ([]*ent.Tenant, error) {
	query := r.ent.Tenant.Query()

	if filter.ID != nil {
		query.Where(tenant.IDEQ(*filter.ID))
	}
	if filter.UUID != nil {
		query.Where(tenant.UUIDEQ(*filter.UUID))
	}
	if filter.Slug != nil {
		query.Where(tenant.SlugEQ(*filter.Slug))
	}
	if filter.Domain != nil {
		query.Where(tenant.DomainEQ(*filter.Domain))
	}
	if filter.Status != nil {
		query.Where(tenant.StatusEQ(tenant.Status(*filter.Status)))
	}
	if filter.Plan != nil {
		query.Where(tenant.PlanEQ(tenant.Plan(*filter.Plan)))
	}

	if filter.Limit != nil {
		query.Limit(*filter.Limit)
	}
	if filter.Offset != nil {
		query.Offset(*filter.Offset)
	}

	return query.All(ctx)
}

func (r *repository) Update(ctx context.Context, params UpdateTenantParams) (*ent.Tenant, error) {
	builder := r.ent.Tenant.Update().
		Where(tenant.UUIDEQ(params.UUID))

	if params.Name != nil {
		builder.SetName(*params.Name)
	}
	if params.Slug != nil {
		builder.SetSlug(*params.Slug)
	}
	if params.Domain != nil {
		builder.SetDomain(*params.Domain)
	}
	if params.Status != nil {
		builder.SetStatus(tenant.Status(*params.Status))
	}
	if params.Plan != nil {
		builder.SetPlan(tenant.Plan(*params.Plan))
	}
	if params.Settings != nil {
		builder.SetSettings(params.Settings)
	}

	count, err := builder.Save(ctx)
	if err != nil {
		return nil, err
	}
	if count == 0 {
		return nil, fmt.Errorf("tenant not found")
	}

	return r.FindByUUID(ctx, params.UUID)
}

func (r *repository) Delete(ctx context.Context, uuid uuid.UUID) error {
	_, err := r.ent.Tenant.Delete().
		Where(tenant.UUIDEQ(uuid)).
		Exec(ctx)
	return err
}
