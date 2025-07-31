package category

import (
	"encoding/json"

	"github.com/google/uuid"
)

type CreateCategoryReqParams struct {
	Slug        string          `json:"slug" validate:"required"`
	Label       string          `json:"label" validate:"required"`
	Description string          `json:"description,omitempty"`
	CreatedBy   int             `json:"created_by" validate:"required"`
	Meta        json.RawMessage `json:"meta,omitempty"`
}

type GetCategoryReqParams struct {
	ID    *int       `json:"id,omitempty"`
	UUID  *uuid.UUID `json:"uuid,omitempty"`
	Slug  *string    `json:"slug,omitempty"`
	Label *string    `json:"label,omitempty"`
	// You could add pagination or filter fields if necessary
}

type UpdateCategoryReqParams struct {
	UUID        uuid.UUID       `json:"uuid" validate:"required"`
	Slug        *string         `json:"slug,omitempty"`
	Label       *string         `json:"label,omitempty"`
	Description *string         `json:"description,omitempty"`
	ApprovedBy  *int            `json:"approved_by,omitempty"`
	DeletedBy   *int            `json:"deleted_by,omitempty"`
	Status      *string         `json:"status,omitempty"`
	Meta        json.RawMessage `json:"meta,omitempty"`
}
