package utils

import (
	"net/url"
)

func SanitizeQueryParams(params any, queryParams url.Values) (interface{}, error) {
	if err := BindValues(params, queryParams); err != nil {
		return nil, err
	}

	if err := Validate(params); err != nil {
		return TranslateError(err), err
	}

	return nil, nil
}
