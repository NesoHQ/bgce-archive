package tenant

import (
	"github.com/google/uuid"
)

type CreateTenantParams struct {
	Name   string
	Slug   string
	Domain *string
	Plan   string
}

type UpdateTenantParams struct {
	UUID     uuid.UUID
	Name     *string
	Slug     *string
	Domain   *string
	Status   *string
	Plan     *string
	Settings map[string]interface{}
}

type GetTenantFilter struct {
	ID     *int
	UUID   *uuid.UUID
	Slug   *string
	Domain *string
	Status *string
	Plan   *string

	Limit  *int
	Offset *int
}
