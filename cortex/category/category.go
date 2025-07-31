package category

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID          int             `json:"id,omitempty"`
	UUID        uuid.UUID       `json:"uuid"`
	Slug        string          `json:"slug"`
	Label       string          `json:"label"`
	Description string          `json:"description,omitempty"`
	CreatedBy   int             `json:"created_by"`
	UpdatedBy   *int            `json:"updated_by,omitempty"`
	ApprovedBy  *int            `json:"approved_by,omitempty"`
	DeletedBy   *int            `json:"deleted_by,omitempty"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	ApprovedAt  *time.Time      `json:"approved_at,omitempty"`
	DeletedAt   *time.Time      `json:"deleted_at,omitempty"`
	Status      string          `json:"status,omitempty"`
	Meta        json.RawMessage `json:"meta,omitempty"`
}

type CreateCategoryModel struct {
	Slug        string
	Label       string
	Description string
	CreatedBy   int
	Meta        json.RawMessage
}

type UpdateCategoryModel struct {
	ID          int
	Slug        *string
	Label       *string
	Description *string
	ApprovedBy  *int
	DeletedBy   *int
	Status      *string
	Meta        json.RawMessage
	UpdatedAt   time.Time
}

type DeleteCategoryModel struct {
	ID        int
	DeletedBy int
	DeletedAt time.Time
}

type GetCategoryModel struct {
	ID    *int
	UUID  *uuid.UUID
	Slug  *string
	Label *string
}
