package utils

import (
	"errors"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/iancoleman/strcase"
)

type ValidationErrors map[string]interface{}

func msgForField(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return "This field is required"
	case "gt":
		return fmt.Sprintf("Field must be greater than %s", err.Param())
	case "gte":
		return fmt.Sprintf("Field must be greater than or equal %s", err.Param())
	case "min":
		return fmt.Sprintf("Field must be at least %s character(s) long", err.Param())
	default:
		return err.Error()
	}
}

func ParseValidationErrors(err error) ValidationErrors {
	obj := ValidationErrors{}
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		for _, fe := range ve {
			obj[strcase.ToLowerCamel(fe.Field())] = msgForField(fe)
		}
	}

	return obj
}
