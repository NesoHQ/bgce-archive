package util

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGenerateToken(t *testing.T) {
	tests := []struct {
		name        string
		secret      string
		email       string
		expectError bool
	}{
		{
			name:        "Valid Token Generation",
			secret:      "test-secret",
			email:       "user@example.com",
			expectError: false,
		},
		{
			name:        "Empty Email - Should Still Generate",
			secret:      "test-secret",
			email:       "",
			expectError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			token, err := GenerateToken(tt.secret, tt.email)

			if tt.expectError {
				require.Error(t, err, "expected an error but got none")
				require.Empty(t, token, "expected token to be empty on failure")
			} else {
				require.NoError(t, err, "expected no error")
				require.NotEmpty(t, token, "expected a valid token")
			}
		})
	}
}
