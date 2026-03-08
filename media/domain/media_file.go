package domain

import (
	"time"

	"github.com/google/uuid"
)

// MediaFile represents a media file entity
type MediaFile struct {
	ID        int       `db:"id" json:"id"`
	UUID      uuid.UUID `db:"uuid" json:"uuid"`
	TenantID  *int      `db:"tenant_id" json:"tenant_id,omitempty"`
	UserID    *int      `db:"user_id" json:"user_id,omitempty"`
	Filename  string    `db:"filename" json:"filename"`
	FilePath  string    `db:"file_path" json:"file_path"`
	FileURL   string    `db:"file_url" json:"file_url"`
	MimeType  string    `db:"mime_type" json:"mime_type"`
	FileSize  int64     `db:"file_size" json:"file_size"`
	Width     *int      `db:"width" json:"width,omitempty"`
	Height    *int      `db:"height" json:"height,omitempty"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

// TableName returns the table name for the MediaFile entity
func (MediaFile) TableName() string {
	return "media_files"
}

// IsImage checks if the media file is an image
func (m *MediaFile) IsImage() bool {
	imageTypes := []string{
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
	}

	for _, t := range imageTypes {
		if m.MimeType == t {
			return true
		}
	}
	return false
}

// IsVideo checks if the media file is a video
func (m *MediaFile) IsVideo() bool {
	videoTypes := []string{
		"video/mp4",
		"video/webm",
		"video/ogg",
		"video/quicktime",
	}

	for _, t := range videoTypes {
		if m.MimeType == t {
			return true
		}
	}
	return false
}

// IsDocument checks if the media file is a document
func (m *MediaFile) IsDocument() bool {
	documentTypes := []string{
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	}

	for _, t := range documentTypes {
		if m.MimeType == t {
			return true
		}
	}
	return false
}

// FileSizeInMB returns the file size in megabytes
func (m *MediaFile) FileSizeInMB() float64 {
	return float64(m.FileSize) / (1024 * 1024)
}
