package util

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(secret string, email string) (string, error) {
	token, err := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"Email": email,
		},
	).SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("failed to generate jwt: %w", err)
	}

	return token, nil
}
