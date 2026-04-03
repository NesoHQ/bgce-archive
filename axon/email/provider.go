package email

import (
	"fmt"
	"os"
)

// NewProvider creates the appropriate email provider based on config
func NewProvider() (Provider, error) {
	provider := os.Getenv("EMAIL_PROVIDER")

	switch provider {
	case "smtp":
		return NewSMTPProviderFromEnv()

	default:
		return nil, fmt.Errorf("unknown email provider: %s (use 'smtp')", provider)
	}
}
