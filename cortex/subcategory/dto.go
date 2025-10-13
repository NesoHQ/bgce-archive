package subcategory

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Subcategory struct {
	ID          int            `json:"id,omitempty" db:"id"`
	ParentID    int            `json:"parent_id,omitempty" db:"parent_id"`
	UUID        uuid.UUID      `json:"uuid" db:"uuid"`
	Slug        string         `json:"slug" db:"slug"`
	Label       string         `json:"label" db:"label"`
	Description string         `json:"description,omitempty" db:"description"`
	CreatedBy   int            `json:"created_by" db:"created_by"`
	UpdatedBy   *int           `json:"updated_by,omitempty" db:"updated_by"`
	ApprovedBy  *int           `json:"approved_by,omitempty" db:"approved_by"`
	DeletedBy   *int           `json:"deleted_by,omitempty" db:"deleted_by"`
	CreatedAt   time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at" db:"updated_at"`
	ApprovedAt  *time.Time     `json:"approved_at,omitempty" db:"approved_at"`
	DeletedAt   *time.Time     `json:"deleted_at,omitempty" db:"deleted_at"`
	Status      string         `json:"status,omitempty" db:"status"`
	Meta        map[string]any `json:"meta,omitempty" db:"meta"`
}

type CreateSubcategoryParams struct {
	Slug        string
	Label       string
	Description string
	CreatorID   int
	ParentUUID  string
	Meta        map[string]interface{}
}

type UpdateSubcategoryParams struct {
	UUID        uuid.UUID
	Slug        *string
	Label       *string
	Description *string
	UpdatedBy   int
	Status      *string
	Meta        json.RawMessage
}

type GetSubcategoryFilter struct {
	ID     *int
	UUID   *uuid.UUID
	Slug   *string
	Label  *string
	Status *string

	Limit  *int
	Offset *int

	SortBy    *string
	SortOrder *string
}
