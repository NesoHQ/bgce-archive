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
	CreatorID   int
	Meta        map[string]interface{}
}

type UpdateCategoryParams struct {
	ID          int
	Slug        *string
	Label       *string
	Description *string
	ApprovedBy  *int
	DeletedBy   *int
	Status      *string
	Meta        json.RawMessage
}

type DeleteCategoryParams struct {
	ID        int
	DeletedBy int
	DeletedAt time.Time
}

type GetCategoryFilter struct {
	ID     *int
	UUID   *uuid.UUID
	Slug   *string
	Label  *string
	Status *string

	IncludeSubcategories bool
	IncludeTopPosts      bool

	Limit  *int
	Offset *int

	SortBy    *string
	SortOrder *string
}
