package category

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

const (
	StatusPending  = "pending"
	StatusApproved = "approved"
	StatusRejected = "rejected"
	StatusDeleted  = "deleted"
)

type Category struct {
	ID          uint            `json:"id,omitempty"`
	UUID        uuid.UUID       `json:"uuid"`
	Slug        string          `json:"slug"`
	Label       string          `json:"label"`
	Description string          `json:"description,omitempty"`
	CreatedBy   uint            `json:"created_by"`
	UpdatedBy   *uint           `json:"updated_by,omitempty"`
	ApprovedBy  *uint           `json:"approved_by,omitempty"`
	DeletedBy   *uint           `json:"deleted_by,omitempty"`
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
	CreatedBy   uint
	Meta        json.RawMessage
}

type UpdateCategoryModel struct {
	ID          uint
	Slug        *string
	Label       *string
	Description *string
	ApprovedBy  *uint
	DeletedBy   *uint
	Status      *string
	Meta        json.RawMessage
	UpdatedAt   time.Time
}

type DeleteCategoryModel struct {
	ID        uint
	DeletedBy uint
	DeletedAt time.Time
}

type GetCategoryModel struct {
	ID    *uint
	UUID  *uuid.UUID
	Slug  *string
	Label *string
}
