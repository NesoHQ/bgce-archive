package util

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGenerateToken(t *testing.T) {
	tests := []struct {
		name        string
		secret      string
		userID      int
		username    string
		email       string
		role        string
		expectError bool
	}{
		{
			name:        "Valid Token Generation",
			secret:      "test-secret",
			userID:      1,
			username:    "Normal User",
			email:       "user@example.com",
			role:        "user",
			expectError: false,
		},
		{
			name:        "Admin Role Token",
			secret:      "test-secret",
			userID:      2,
			username:    "Admin User",
			email:       "admin@example.com",
			role:        "admin",
			expectError: false,
		},
		{
			name:        "Empty Email - Still Generates",
			secret:      "test-secret",
			userID:      3,
			username:    "NoEmailUser",
			email:       "",
			role:        "user",
			expectError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			token, err := GenerateToken(tt.secret, tt.userID, tt.username, tt.email, tt.role)

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
