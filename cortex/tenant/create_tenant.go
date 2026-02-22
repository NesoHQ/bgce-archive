package tenant

import (
	"context"
)

func (s *service) CreateTenant(ctx context.Context, params CreateTenantParams) (*Tenant, error) {
	entTenant, err := s.repo.Create(ctx, params)
	if err != nil {
		return nil, err
	}

	tenant := &Tenant{
		ID:        entTenant.ID,
		UUID:      entTenant.UUID,
		Name:      entTenant.Name,
		Slug:      entTenant.Slug,
		Status:    string(entTenant.Status),
		Plan:      string(entTenant.Plan),
		Settings:  entTenant.Settings,
		Meta:      entTenant.Meta,
		CreatedAt: entTenant.CreatedAt,
		UpdatedAt: entTenant.UpdatedAt,
	}

	if entTenant.Domain != "" {
		tenant.Domain = &entTenant.Domain
	}

	return tenant, nil
}
