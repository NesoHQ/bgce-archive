package customerrors

import "errors"

var ErrAlreadyExists = errors.New("already-exists")
var ErrNotFound = errors.New("not-found")
