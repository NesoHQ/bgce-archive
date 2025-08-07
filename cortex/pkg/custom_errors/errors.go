package customerrors

import "errors"

var (
	ErrSlugExists = errors.New("category slug already exists")
)
