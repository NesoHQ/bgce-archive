package email

import (
	"fmt"
	"os"
)

// NewProvider creates the appropriate email provider based on config
func NewProvider() (Provider, error) {
	provider := os.Getenv("EMAIL_PROVIDER")

	switch provider {
	case "sendgrid":
		apiKey := os.Getenv("SENDGRID_API_KEY")
		if apiKey == "" {
			return nil, fmt.Errorf("SENDGRID_API_KEY is required for sendgrid provider")
		}
		return NewSendGridProvider(
			apiKey,
			os.Getenv("EMAIL_FROM"),
			os.Getenv("EMAIL_FROM_NAME"),
		), nil

	case "smtp":
		return NewSMTPProviderFromEnv()

	default:
		return nil, fmt.Errorf("unknown email provider: %s (use 'sendgrid' or 'smtp')", provider)
	}
}
