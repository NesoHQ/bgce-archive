package util

import (
	"fmt"

	"github.com/shopspring/decimal"
)

func TruncatedStr(val string, places int32) (string, error) {
	if places < 0 {
		return "", fmt.Errorf("decimal places cannot be negative")
	}
	str, _ := decimal.NewFromString(val)
	return str.Truncate(places).String(), nil
}
