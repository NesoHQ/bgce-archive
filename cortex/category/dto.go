package category

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type CreateCategoryParams struct {
	Slug        string
	Label       string
	Description string
	CreatedBy   int
	Meta        json.RawMessage
}

type UpdateCategoryParams struct {
	ID          uint
	Slug        *string
	Label       *string
	Description *string
	ApprovedBy  *uint
	DeletedBy   *uint
	Status      *string
	Meta        json.RawMessage
}

type DeleteCategoryParams struct {
	ID        uint
	DeletedBy uint
	DeletedAt time.Time
}

type GetCategoryFilter struct {
	ID    *uint
	UUID  *uuid.UUID
	Slug  *string
	Label *string

	IncludeSubcategories bool
	IncludeTopPosts      bool

	Limit  *int
	Offset *int

	SortBy    *string
	SortOrder *string
}
