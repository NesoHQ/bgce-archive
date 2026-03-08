package media

import (
	"context"
	"fmt"

	"media/domain"

	"github.com/jmoiron/sqlx"
)

type repository struct {
	db *sqlx.DB
}

// NewRepository creates a new media repository
func NewRepository(db *sqlx.DB) Repository {
	return &repository{db: db}
}

// Create inserts a new media file record
func (r *repository) Create(ctx context.Context, media *domain.MediaFile) error {
	query := `
		INSERT INTO media_files (uuid, tenant_id, user_id, filename, file_path, file_url, mime_type, file_size, width, height)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at
	`

	return r.db.QueryRowContext(
		ctx,
		query,
		media.UUID,
		media.TenantID,
		media.UserID,
		media.Filename,
		media.FilePath,
		media.FileURL,
		media.MimeType,
		media.FileSize,
		media.Width,
		media.Height,
	).Scan(&media.ID, &media.CreatedAt)
}

// FindByID retrieves a media file by ID
func (r *repository) FindByID(ctx context.Context, id int) (*domain.MediaFile, error) {
	var media domain.MediaFile
	query := `SELECT * FROM media_files WHERE id = $1`

	err := r.db.GetContext(ctx, &media, query, id)
	if err != nil {
		return nil, fmt.Errorf("failed to find media file: %w", err)
	}

	return &media, nil
}

// FindByUUID retrieves a media file by UUID
func (r *repository) FindByUUID(ctx context.Context, uuid string) (*domain.MediaFile, error) {
	var media domain.MediaFile
	query := `SELECT * FROM media_files WHERE uuid = $1`

	err := r.db.GetContext(ctx, &media, query, uuid)
	if err != nil {
		return nil, fmt.Errorf("failed to find media file: %w", err)
	}

	return &media, nil
}

// List retrieves a paginated list of media files
func (r *repository) List(ctx context.Context, req ListMediaRequest) ([]domain.MediaFile, int64, error) {
	var media []domain.MediaFile
	var total int64

	// Build query with filters
	query := `SELECT * FROM media_files WHERE 1=1`
	countQuery := `SELECT COUNT(*) FROM media_files WHERE 1=1`
	args := []interface{}{}
	argCount := 1

	if req.TenantID != nil {
		query += fmt.Sprintf(" AND tenant_id = $%d", argCount)
		countQuery += fmt.Sprintf(" AND tenant_id = $%d", argCount)
		args = append(args, *req.TenantID)
		argCount++
	}

	if req.UserID != nil {
		query += fmt.Sprintf(" AND user_id = $%d", argCount)
		countQuery += fmt.Sprintf(" AND user_id = $%d", argCount)
		args = append(args, *req.UserID)
		argCount++
	}

	if req.MimeType != "" {
		query += fmt.Sprintf(" AND mime_type LIKE $%d", argCount)
		countQuery += fmt.Sprintf(" AND mime_type LIKE $%d", argCount)
		args = append(args, req.MimeType+"%")
		argCount++
	}

	// Get total count
	err := r.db.GetContext(ctx, &total, countQuery, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count media files: %w", err)
	}

	// Add pagination
	query += " ORDER BY created_at DESC"
	if req.Limit > 0 {
		offset := (req.Page - 1) * req.Limit
		query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argCount, argCount+1)
		args = append(args, req.Limit, offset)
	}

	err = r.db.SelectContext(ctx, &media, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list media files: %w", err)
	}

	return media, total, nil
}

// Delete removes a media file record
func (r *repository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM media_files WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete media file: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("media file not found")
	}

	return nil
}

// FindByUserID retrieves media files for a specific user
func (r *repository) FindByUserID(ctx context.Context, userID int, page, limit int) ([]domain.MediaFile, int64, error) {
	var media []domain.MediaFile
	var total int64

	// Get total count
	countQuery := `SELECT COUNT(*) FROM media_files WHERE user_id = $1`
	err := r.db.GetContext(ctx, &total, countQuery, userID)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count user media files: %w", err)
	}

	// Get paginated results
	query := `SELECT * FROM media_files WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`
	offset := (page - 1) * limit

	err = r.db.SelectContext(ctx, &media, query, userID, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list user media files: %w", err)
	}

	return media, total, nil
}
