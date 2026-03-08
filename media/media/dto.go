package media

import (
	"time"

	"github.com/google/uuid"
)

// UploadRequest represents a file upload request
type UploadRequest struct {
	TenantID *int `form:"tenant_id"`
	UserID   *int `form:"user_id"`
}

// UploadResponse represents a file upload response
type UploadResponse struct {
	ID        int       `json:"id"`
	UUID      uuid.UUID `json:"uuid"`
	Filename  string    `json:"filename"`
	FileURL   string    `json:"file_url"`
	MimeType  string    `json:"mime_type"`
	FileSize  int64     `json:"file_size"`
	Width     *int      `json:"width,omitempty"`
	Height    *int      `json:"height,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// ListMediaRequest represents a request to list media files
type ListMediaRequest struct {
	TenantID *int   `form:"tenant_id"`
	UserID   *int   `form:"user_id"`
	MimeType string `form:"mime_type"`
	Page     int    `form:"page"`
	Limit    int    `form:"limit"`
}

// ListMediaResponse represents a paginated list of media files
type ListMediaResponse struct {
	Data       []UploadResponse `json:"data"`
	Page       int              `json:"page"`
	Limit      int              `json:"limit"`
	Total      int64            `json:"total"`
	TotalPages int              `json:"total_pages"`
}

// MediaFileResponse represents a single media file response
type MediaFileResponse struct {
	ID        int       `json:"id"`
	UUID      uuid.UUID `json:"uuid"`
	TenantID  *int      `json:"tenant_id,omitempty"`
	UserID    *int      `json:"user_id,omitempty"`
	Filename  string    `json:"filename"`
	FilePath  string    `json:"file_path"`
	FileURL   string    `json:"file_url"`
	MimeType  string    `json:"mime_type"`
	FileSize  int64     `json:"file_size"`
	Width     *int      `json:"width,omitempty"`
	Height    *int      `json:"height,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// DeleteResponse represents a delete operation response
type DeleteResponse struct {
	Message string `json:"message"`
	Success bool   `json:"success"`
}

// OptimizeRequest represents an image optimization request
type OptimizeRequest struct {
	Quality int `json:"quality" validate:"min=1,max=100"`
	Width   int `json:"width,omitempty" validate:"omitempty,min=1"`
	Height  int `json:"height,omitempty" validate:"omitempty,min=1"`
}

// OptimizeResponse represents an image optimization response
type OptimizeResponse struct {
	OriginalSize  int64   `json:"original_size"`
	OptimizedSize int64   `json:"optimized_size"`
	Savings       float64 `json:"savings_percentage"`
	NewURL        string  `json:"new_url"`
}
