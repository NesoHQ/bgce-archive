package tenant

import (
	"context"
)

func (s *service) GetTenants(ctx context.Context, filter GetTenantFilter) ([]*Tenant, error) {
	entTenants, err := s.repo.FindAll(ctx, filter)
	if err != nil {
		return nil, err
	}

	tenants := make([]*Tenant, 0, len(entTenants))
	for _, entTenant := range entTenants {
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

		tenants = append(tenants, tenant)
	}

	return tenants, nil
}
