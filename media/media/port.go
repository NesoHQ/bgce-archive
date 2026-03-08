package media

import (
	"context"
	"io"

	"media/domain"
)

// Repository defines the interface for media file data access
type Repository interface {
	Create(ctx context.Context, media *domain.MediaFile) error
	FindByID(ctx context.Context, id int) (*domain.MediaFile, error)
	FindByUUID(ctx context.Context, uuid string) (*domain.MediaFile, error)
	List(ctx context.Context, req ListMediaRequest) ([]domain.MediaFile, int64, error)
	Delete(ctx context.Context, id int) error
	FindByUserID(ctx context.Context, userID int, page, limit int) ([]domain.MediaFile, int64, error)
}

// Service defines the interface for media file business logic
type Service interface {
	Upload(ctx context.Context, filename string, mimeType string, size int64, reader io.Reader, req UploadRequest) (*UploadResponse, error)
	GetByID(ctx context.Context, id int) (*MediaFileResponse, error)
	GetByUUID(ctx context.Context, uuid string) (*MediaFileResponse, error)
	List(ctx context.Context, req ListMediaRequest) (*ListMediaResponse, error)
	Delete(ctx context.Context, id int) error
	GetUserMedia(ctx context.Context, userID int, page, limit int) (*ListMediaResponse, error)
	OptimizeImage(ctx context.Context, id int, req OptimizeRequest) (*OptimizeResponse, error)
}

// StorageProvider defines the interface for file storage operations
type StorageProvider interface {
	Upload(ctx context.Context, path string, reader io.Reader, size int64, contentType string) (string, error)
	Download(ctx context.Context, path string) (io.ReadCloser, error)
	Delete(ctx context.Context, path string) error
	GetURL(path string) string
}
