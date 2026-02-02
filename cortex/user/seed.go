package user

import (
	"context"
	"fmt"
	"log/slog"
	"strings"

	"cortex/auth"
	"cortex/ent"
	entuser "cortex/ent/user"
)

// SeedUser represents a user to be seeded
type SeedUser struct {
	Username string
	Email    string
	Password string
	FullName string
	Role     entuser.Role
	Status   entuser.Status
}

// DefaultSeedUsers returns the default users to seed
func DefaultSeedUsers() []SeedUser {
	return []SeedUser{
		{
			Username: "admin",
			Email:    "admin@bgce.com",
			Password: "Admin@123",
			FullName: "System Administrator",
			Role:     entuser.RoleAdmin,
			Status:   entuser.StatusActive,
		},
		{
			Username: "editor",
			Email:    "editor@bgce.com",
			Password: "Editor@123",
			FullName: "Content Editor",
			Role:     entuser.RoleEditor,
			Status:   entuser.StatusActive,
		},
		{
			Username: "viewer",
			Email:    "viewer@bgce.com",
			Password: "Viewer@123",
			FullName: "Content Viewer",
			Role:     entuser.RoleViewer,
			Status:   entuser.StatusActive,
		},
		{
			Username: "testuser",
			Email:    "test@example.com",
			Password: "Test@123",
			FullName: "Test User",
			Role:     entuser.RoleViewer,
			Status:   entuser.StatusActive,
		},
	}
}

// SeedUsers seeds the database with initial users
func SeedUsers(ctx context.Context, client *ent.Client, users []SeedUser) error {
	slog.Info("Starting user seeding...")

	for _, seedUser := range users {
		// Check if user already exists
		existingUser, err := client.User.
			Query().
			Where(entuser.Email(seedUser.Email)).
			First(ctx)

		if err == nil && existingUser != nil {
			slog.Info("User already exists, skipping",
				slog.String("email", seedUser.Email),
				slog.String("username", seedUser.Username))
			continue
		}

		// Hash password
		passwordHash, err := auth.HashPassword(seedUser.Password)
		if err != nil {
			return fmt.Errorf("failed to hash password for %s: %w", seedUser.Email, err)
		}

		// Create user
		_, err = client.User.
			Create().
			SetUsername(seedUser.Username).
			SetEmail(seedUser.Email).
			SetPasswordHash(passwordHash).
			SetFullName(seedUser.FullName).
			SetRole(seedUser.Role).
			SetStatus(seedUser.Status).
			Save(ctx)
		if err != nil {
			return fmt.Errorf("failed to create user %s: %w", seedUser.Email, err)
		}

		slog.Info("User created successfully",
			slog.String("email", seedUser.Email),
			slog.String("username", seedUser.Username),
			slog.String("role", string(seedUser.Role)))
	}

	slog.Info("User seeding completed successfully")
	return nil
}

// SeedDefaultUsers seeds the database with default users
func SeedDefaultUsers(ctx context.Context, client *ent.Client) error {
	return SeedUsers(ctx, client, DefaultSeedUsers())
}

// PrintSeedCredentials prints the seeded user credentials
func PrintSeedCredentials() {
	separator := strings.Repeat("=", 70)
	fmt.Println("\n" + separator)
	fmt.Println("SEEDED USER CREDENTIALS")
	fmt.Println(separator)
	fmt.Println()

	users := DefaultSeedUsers()
	for _, user := range users {
		fmt.Printf("Role: %s\n", user.Role)
		fmt.Printf("  Email:    %s\n", user.Email)
		fmt.Printf("  Username: %s\n", user.Username)
		fmt.Printf("  Password: %s\n", user.Password)
		fmt.Printf("  Name:     %s\n", user.FullName)
		fmt.Println()
	}

	fmt.Println(separator)
	fmt.Println("⚠️  IMPORTANT: Change these passwords in production!")
	fmt.Println(separator)
	fmt.Println()
}
