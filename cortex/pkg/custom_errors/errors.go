package customerrors

import "errors"

var (
	ErrSlugExists             = errors.New("category slug already exists")
	ErrCategoryNotFound       = errors.New("category not found")
	ErrCategoryAlreadyDeleted = errors.New("category already deleted")
)
