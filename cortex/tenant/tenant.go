package tenant

import (
	"time"

	"github.com/google/uuid"
)

const (
	StatusActive    = "active"
	StatusInactive  = "inactive"
	StatusSuspended = "suspended"
)

const (
	PlanFree         = "free"
	PlanStarter      = "starter"
	PlanProfessional = "professional"
	PlanEnterprise   = "enterprise"
)

type Tenant struct {
	ID        int                    `json:"id" db:"id"`
	UUID      uuid.UUID              `json:"uuid" db:"uuid"`
	Name      string                 `json:"name" db:"name"`
	Slug      string                 `json:"slug" db:"slug"`
	Domain    *string                `json:"domain,omitempty" db:"domain"`
	Status    string                 `json:"status" db:"status"`
	Plan      string                 `json:"plan" db:"plan"`
	Settings  map[string]interface{} `json:"settings,omitempty" db:"settings"`
	Meta      map[string]interface{} `json:"meta,omitempty" db:"meta"`
	CreatedAt time.Time              `json:"created_at" db:"created_at"`
	UpdatedAt time.Time              `json:"updated_at" db:"updated_at"`
	Stats     *TenantStats           `json:"stats,omitempty"`
}

type TenantStats struct {
	TotalPosts      int `json:"total_posts"`
	TotalUsers      int `json:"total_users"`
	TotalCategories int `json:"total_categories"`
	StorageUsedMB   int `json:"storage_used_mb"`
}
