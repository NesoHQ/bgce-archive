package utils

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type Validator struct {
	validate *validator.Validate
}

func NewValidator() *Validator {
	return &Validator{
		validate: validator.New(),
	}
}

type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
	Tag     string `json:"tag"`
	Value   string `json:"value,omitempty"`
}

type ValidationErrors struct {
	Errors []ValidationError `json:"errors"`
}

func (v *Validator) ValidateStruct(s interface{}) *ValidationErrors {
	err := v.validate.Struct(s)
	if err == nil {
		return nil
	}

	validationErrs, ok := err.(validator.ValidationErrors)
	if !ok {
		return &ValidationErrors{
			Errors: []ValidationError{
				{
					Field:   "unknown",
					Message: "validation failed",
					Tag:     "error",
				},
			},
		}
	}

	errors := make([]ValidationError, 0, len(validationErrs))
	for _, fieldErr := range validationErrs {
		errors = append(errors, ValidationError{
			Field:   fieldErr.Field(),
			Message: getErrorMessage(fieldErr),
			Tag:     fieldErr.Tag(),
			Value:   fmt.Sprintf("%v", fieldErr.Value()),
		})
	}

	return &ValidationErrors{Errors: errors}
}

func getErrorMessage(fieldErr validator.FieldError) string {
	field := fieldErr.Field()
	param := fieldErr.Param()

	switch fieldErr.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "min":
		if fieldErr.Type().String() == "string" {
			return fmt.Sprintf("%s must be at least %s characters long", field, param)
		}
		return fmt.Sprintf("%s must be at least %s", field, param)
	case "max":
		if fieldErr.Type().String() == "string" {
			return fmt.Sprintf("%s must not exceed %s characters", field, param)
		}
		return fmt.Sprintf("%s must not exceed %s", field, param)
	case "email":
		return fmt.Sprintf("%s must be a valid email address", field)
	case "url":
		return fmt.Sprintf("%s must be a valid URL", field)
	case "uuid":
		return fmt.Sprintf("%s must be a valid UUID", field)
	case "dive":
		return fmt.Sprintf("one or more items in %s are invalid", field)
	case "oneof":
		return fmt.Sprintf("%s must be one of: %s", field, param)
	case "len":
		return fmt.Sprintf("%s must be exactly %s characters long", field, param)
	default:
		return fmt.Sprintf("%s failed validation for tag '%s'", field, fieldErr.Tag())
	}
}
