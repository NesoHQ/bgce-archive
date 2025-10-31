package util

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(secret string, userID int, name, email, role string) (string, error) {
	claims := jwt.MapClaims{
		"sub":      fmt.Sprintf("%d", userID),
		"name":     name,
		"email":    email,
		"role":     role,
		"is_admin": role == "admin",
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("failed to generate jwt: %w", err)
	}

	return signed, nil
}
