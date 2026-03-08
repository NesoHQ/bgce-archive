package media

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"log/slog"
	"path/filepath"
	"strings"
	"time"

	"media/domain"

	"github.com/google/uuid"
	"github.com/nfnt/resize"
	"golang.org/x/image/webp"
)

type service struct {
	repo            Repository
	storage         StorageProvider
	maxUploadSizeMB int
	allowedTypes    map[string]bool
}

// ServiceConfig holds service configuration
type ServiceConfig struct {
	MaxUploadSizeMB      int
	AllowedImageTypes    []string
	AllowedVideoTypes    []string
	AllowedDocumentTypes []string
}

// NewService creates a new media service
func NewService(repo Repository, storage StorageProvider, config ServiceConfig) Service {
	allowedTypes := make(map[string]bool)
	for _, t := range config.AllowedImageTypes {
		allowedTypes[t] = true
	}
	for _, t := range config.AllowedVideoTypes {
		allowedTypes[t] = true
	}
	for _, t := range config.AllowedDocumentTypes {
		allowedTypes[t] = true
	}

	return &service{
		repo:            repo,
		storage:         storage,
		maxUploadSizeMB: config.MaxUploadSizeMB,
		allowedTypes:    allowedTypes,
	}
}

// Upload handles file upload
func (s *service) Upload(ctx context.Context, filename string, mimeType string, size int64, reader io.Reader, req UploadRequest) (*UploadResponse, error) {
	// Validate file size
	maxSize := int64(s.maxUploadSizeMB) * 1024 * 1024
	if size > maxSize {
		return nil, fmt.Errorf("file size exceeds maximum allowed size of %dMB", s.maxUploadSizeMB)
	}

	// Validate MIME type
	if !s.allowedTypes[mimeType] {
		return nil, fmt.Errorf("file type %s is not allowed", mimeType)
	}

	// Generate unique file path
	fileUUID := uuid.New()
	ext := filepath.Ext(filename)
	storagePath := fmt.Sprintf("%s/%s%s", time.Now().Format("2006/01/02"), fileUUID.String(), ext)

	// Read file content for processing
	buf := new(bytes.Buffer)
	_, err := io.Copy(buf, reader)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	var width, height *int

	// Process image if it's an image file
	if strings.HasPrefix(mimeType, "image/") {
		img, format, err := image.Decode(bytes.NewReader(buf.Bytes()))
		if err == nil {
			bounds := img.Bounds()
			w := bounds.Dx()
			h := bounds.Dy()
			width = &w
			height = &h
			slog.Info("Image dimensions detected", "width", w, "height", h, "format", format)
		}
	}

	// Upload to storage
	fileURL, err := s.storage.Upload(ctx, storagePath, bytes.NewReader(buf.Bytes()), size, mimeType)
	if err != nil {
		return nil, fmt.Errorf("failed to upload file to storage: %w", err)
	}

	// Create database record
	media := &domain.MediaFile{
		UUID:     fileUUID,
		TenantID: req.TenantID,
		UserID:   req.UserID,
		Filename: filename,
		FilePath: storagePath,
		FileURL:  fileURL,
		MimeType: mimeType,
		FileSize: size,
		Width:    width,
		Height:   height,
	}

	err = s.repo.Create(ctx, media)
	if err != nil {
		// Cleanup uploaded file if database insert fails
		_ = s.storage.Delete(ctx, storagePath)
		return nil, fmt.Errorf("failed to create media record: %w", err)
	}

	return &UploadResponse{
		ID:        media.ID,
		UUID:      media.UUID,
		Filename:  media.Filename,
		FileURL:   media.FileURL,
		MimeType:  media.MimeType,
		FileSize:  media.FileSize,
		Width:     media.Width,
		Height:    media.Height,
		CreatedAt: media.CreatedAt,
	}, nil
}

// GetByID retrieves a media file by ID
func (s *service) GetByID(ctx context.Context, id int) (*MediaFileResponse, error) {
	media, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return s.toResponse(media), nil
}

// GetByUUID retrieves a media file by UUID
func (s *service) GetByUUID(ctx context.Context, uuidStr string) (*MediaFileResponse, error) {
	media, err := s.repo.FindByUUID(ctx, uuidStr)
	if err != nil {
		return nil, err
	}

	return s.toResponse(media), nil
}

// List retrieves a paginated list of media files
func (s *service) List(ctx context.Context, req ListMediaRequest) (*ListMediaResponse, error) {
	// Set defaults
	if req.Page < 1 {
		req.Page = 1
	}
	if req.Limit < 1 {
		req.Limit = 20
	}
	if req.Limit > 100 {
		req.Limit = 100
	}

	mediaFiles, total, err := s.repo.List(ctx, req)
	if err != nil {
		return nil, err
	}

	data := make([]UploadResponse, len(mediaFiles))
	for i, m := range mediaFiles {
		data[i] = UploadResponse{
			ID:        m.ID,
			UUID:      m.UUID,
			Filename:  m.Filename,
			FileURL:   m.FileURL,
			MimeType:  m.MimeType,
			FileSize:  m.FileSize,
			Width:     m.Width,
			Height:    m.Height,
			CreatedAt: m.CreatedAt,
		}
	}

	totalPages := int(total) / req.Limit
	if int(total)%req.Limit > 0 {
		totalPages++
	}

	return &ListMediaResponse{
		Data:       data,
		Page:       req.Page,
		Limit:      req.Limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

// Delete removes a media file
func (s *service) Delete(ctx context.Context, id int) error {
	// Get media file info
	media, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	// Delete from storage
	err = s.storage.Delete(ctx, media.FilePath)
	if err != nil {
		slog.Warn("Failed to delete file from storage", "error", err, "path", media.FilePath)
	}

	// Delete from database
	err = s.repo.Delete(ctx, id)
	if err != nil {
		return err
	}

	return nil
}

// GetUserMedia retrieves media files for a specific user
func (s *service) GetUserMedia(ctx context.Context, userID int, page, limit int) (*ListMediaResponse, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}

	mediaFiles, total, err := s.repo.FindByUserID(ctx, userID, page, limit)
	if err != nil {
		return nil, err
	}

	data := make([]UploadResponse, len(mediaFiles))
	for i, m := range mediaFiles {
		data[i] = UploadResponse{
			ID:        m.ID,
			UUID:      m.UUID,
			Filename:  m.Filename,
			FileURL:   m.FileURL,
			MimeType:  m.MimeType,
			FileSize:  m.FileSize,
			Width:     m.Width,
			Height:    m.Height,
			CreatedAt: m.CreatedAt,
		}
	}

	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}

	return &ListMediaResponse{
		Data:       data,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

// OptimizeImage optimizes an image file
func (s *service) OptimizeImage(ctx context.Context, id int, req OptimizeRequest) (*OptimizeResponse, error) {
	// Get media file
	media, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Check if it's an image
	if !media.IsImage() {
		return nil, fmt.Errorf("file is not an image")
	}

	// Download original file
	reader, err := s.storage.Download(ctx, media.FilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to download file: %w", err)
	}
	defer reader.Close()

	// Decode image
	var img image.Image
	switch media.MimeType {
	case "image/jpeg", "image/jpg":
		img, err = jpeg.Decode(reader)
	case "image/png":
		img, err = png.Decode(reader)
	case "image/webp":
		img, err = webp.Decode(reader)
	default:
		return nil, fmt.Errorf("unsupported image format for optimization: %s", media.MimeType)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %w", err)
	}

	// Resize if dimensions specified
	if req.Width > 0 || req.Height > 0 {
		img = resize.Resize(uint(req.Width), uint(req.Height), img, resize.Lanczos3)
	}

	// Encode optimized image
	buf := new(bytes.Buffer)
	quality := req.Quality
	if quality == 0 {
		quality = 85 // Default quality
	}

	switch media.MimeType {
	case "image/jpeg", "image/jpg":
		err = jpeg.Encode(buf, img, &jpeg.Options{Quality: quality})
	case "image/png":
		err = png.Encode(buf, img)
	default:
		return nil, fmt.Errorf("unsupported format for encoding")
	}

	if err != nil {
		return nil, fmt.Errorf("failed to encode optimized image: %w", err)
	}

	// Upload optimized version
	optimizedPath := strings.Replace(media.FilePath, filepath.Ext(media.FilePath), "_optimized"+filepath.Ext(media.FilePath), 1)
	optimizedSize := int64(buf.Len())

	newURL, err := s.storage.Upload(ctx, optimizedPath, buf, optimizedSize, media.MimeType)
	if err != nil {
		return nil, fmt.Errorf("failed to upload optimized image: %w", err)
	}

	// Calculate savings
	savings := float64(media.FileSize-optimizedSize) / float64(media.FileSize) * 100

	return &OptimizeResponse{
		OriginalSize:  media.FileSize,
		OptimizedSize: optimizedSize,
		Savings:       savings,
		NewURL:        newURL,
	}, nil
}

// toResponse converts domain model to response DTO
func (s *service) toResponse(media *domain.MediaFile) *MediaFileResponse {
	return &MediaFileResponse{
		ID:        media.ID,
		UUID:      media.UUID,
		TenantID:  media.TenantID,
		UserID:    media.UserID,
		Filename:  media.Filename,
		FilePath:  media.FilePath,
		FileURL:   media.FileURL,
		MimeType:  media.MimeType,
		FileSize:  media.FileSize,
		Width:     media.Width,
		Height:    media.Height,
		CreatedAt: media.CreatedAt,
	}
}
