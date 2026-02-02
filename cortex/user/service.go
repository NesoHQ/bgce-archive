package user

import (
	"context"
	"errors"
	"fmt"

	"cortex/auth"
	"cortex/config"
	"cortex/ent"
	entuser "cortex/ent/user"
)

var (
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrUserAlreadyExists  = errors.New("user already exists")
	ErrInvalidPassword    = errors.New("invalid password")
)

type Service struct {
	repo   Repository
	config *config.Config
}

// NewService creates a new user service
func NewService(config *config.Config, entClient *ent.Client) *Service {
	return &Service{
		repo:   NewRepository(entClient),
		config: config,
	}
}

// Register creates a new user account
func (s *Service) Register(ctx context.Context, req RegisterRequest) (*UserResponse, error) {
	// Check if user already exists
	existingUser, _ := s.repo.FindByEmail(ctx, req.Email)
	if existingUser != nil {
		return nil, ErrUserAlreadyExists
	}

	existingUser, _ = s.repo.FindByUsername(ctx, req.Username)
	if existingUser != nil {
		return nil, ErrUserAlreadyExists
	}

	// Hash password
	passwordHash, err := auth.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user
	user := &ent.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: passwordHash,
		FullName:     req.FullName,
		Role:         entuser.RoleViewer,
		Status:       entuser.StatusActive,
	}

	createdUser, err := s.repo.Create(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return s.toUserResponse(createdUser), nil
}

// Login authenticates a user and returns a token
func (s *Service) Login(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	// Find user by email
	user, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Check if user is active
	if user.Status != entuser.StatusActive {
		return nil, errors.New("user account is not active")
	}

	// Verify password
	if !auth.VerifyPassword(req.Password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}

	// Update last login
	_ = s.repo.UpdateLastLogin(ctx, user.ID)

	// Generate token
	token, err := auth.GenerateToken(user.ID, user.Username, user.Email, string(user.Role), s.config.JwtSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &LoginResponse{
		Token: token,
		User:  *s.toUserResponse(user),
	}, nil
}

// GetUserByID retrieves a user by ID
func (s *Service) GetUserByID(ctx context.Context, id int) (*UserResponse, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrUserNotFound
	}

	return s.toUserResponse(user), nil
}

// UpdateUser updates user information
func (s *Service) UpdateUser(ctx context.Context, id int, req UpdateUserRequest) (*UserResponse, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrUserNotFound
	}

	// Update fields if provided
	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.FullName != "" {
		user.FullName = req.FullName
	}

	updatedUser, err := s.repo.Update(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return s.toUserResponse(updatedUser), nil
}

// ChangePassword changes user password
func (s *Service) ChangePassword(ctx context.Context, userID int, req ChangePasswordRequest) error {
	user, err := s.repo.FindByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}

	// Verify old password
	if !auth.VerifyPassword(req.OldPassword, user.PasswordHash) {
		return ErrInvalidPassword
	}

	// Hash new password
	newPasswordHash, err := auth.HashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Update password
	user.PasswordHash = newPasswordHash
	_, err = s.repo.Update(ctx, user)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	return nil
}

// ListUsers retrieves a list of users
func (s *Service) ListUsers(ctx context.Context, limit, offset int) ([]UserResponse, error) {
	users, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to list users: %w", err)
	}

	responses := make([]UserResponse, len(users))
	for i, user := range users {
		responses[i] = *s.toUserResponse(user)
	}

	return responses, nil
}

// toUserResponse converts ent.User to UserResponse
func (s *Service) toUserResponse(user *ent.User) *UserResponse {
	return &UserResponse{
		ID:        user.ID,
		UUID:      user.UUID,
		Username:  user.Username,
		Email:     user.Email,
		FullName:  user.FullName,
		Role:      string(user.Role),
		Status:    string(user.Status),
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Meta:      user.Meta,
	}
}
