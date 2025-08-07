package utils

import (
	"net/url"

	"github.com/go-playground/form/v4"
)

func BindValues(v interface{}, values url.Values) error {
	dec := form.NewDecoder()
	return dec.Decode(v, values)
}
