package util

import (
	"bufio"
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"gorm.io/gorm"
)

type PostStatus string

const (
	StatusDraft     PostStatus = "draft"
	StatusPublished PostStatus = "published"
	StatusArchived  PostStatus = "archived"
	StatusDeleted   PostStatus = "deleted"
)

type Post struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	UUID      string         `gorm:"type:uuid;uniqueIndex;not null" json:"uuid"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Content
	Title     string `gorm:"type:varchar(500);not null" json:"title"`
	Slug      string `gorm:"type:varchar(500);uniqueIndex;not null" json:"slug"`
	Summary   string `gorm:"type:text" json:"summary"`
	Content   string `gorm:"type:text;not null" json:"content"`
	Thumbnail string `gorm:"type:varchar(500)" json:"thumbnail_url,omitempty"`

	// Categorization
	CategoryID    uint  `gorm:"not null;index" json:"category_id"`
	SubCategoryID *uint `gorm:"index" json:"sub_category_id,omitempty"`

	// SEO
	MetaTitle       string `gorm:"type:varchar(500)" json:"meta_title,omitempty"`
	MetaDescription string `gorm:"type:text" json:"meta_description,omitempty"`
	Keywords        string `gorm:"type:text" json:"keywords,omitempty"`
	OGImage         string `gorm:"type:varchar(500)" json:"og_image,omitempty"`

	// Status & Visibility
	Status     PostStatus `gorm:"type:varchar(20);not null;default:'draft';index" json:"status"`
	IsPublic   bool       `gorm:"default:true" json:"is_public"`
	IsFeatured bool       `gorm:"default:false;index" json:"is_featured"`
	IsPinned   bool       `gorm:"default:false" json:"is_pinned"`

	// Timestamps
	PublishedAt *time.Time `json:"published_at,omitempty"`
	ArchivedAt  *time.Time `json:"archived_at,omitempty"`

	// Audit
	CreatedBy uint `gorm:"not null" json:"created_by"`
	UpdatedBy uint `json:"updated_by,omitempty"`

	// Stats (can be updated via separate service)
	ViewCount int `gorm:"default:0" json:"view_count"`

	// Version tracking
	Version int `gorm:"default:1" json:"version"`
}

func ParseAndValidateCSV(
	file multipart.File,
	userID uint,
) ([]Post, error) {
	reader := csv.NewReader(bufio.NewReader(file))
	reader.TrimLeadingSpace = true

	// Read header
	if _, err := reader.Read(); err != nil {
		return nil, errors.New("invalid CSV header")
	}

	slugSet := make(map[string]bool)
	var posts []Post

	for {
		row, err := reader.Read()

		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		if len(row) < 14 {
			return nil, fmt.Errorf("invalid CSV format: expected at least 14 columns, got %d", len(row))
		}

		title := strings.TrimSpace(row[0])
		slug := strings.TrimSpace(row[1])
		content := strings.TrimSpace(row[2])
		summary := strings.TrimSpace(row[3])
		thumbnail := strings.TrimSpace(row[4])
		categoryIDStr := strings.TrimSpace(row[5])
		subCategoryIDStr := strings.TrimSpace(row[6])
		metaTitle := strings.TrimSpace(row[7])
		metaDescription := strings.TrimSpace(row[8])
		keywords := strings.TrimSpace(row[9])
		ogImage := strings.TrimSpace(row[10])
		isPublicStr := strings.TrimSpace(row[11])
		isFeaturedStr := strings.TrimSpace(row[12])
		isPinnedStr := strings.TrimSpace(row[13])

		// Set defaults
		isPublic := true
		if isPublicStr != "" {
			isPublic = strings.ToLower(isPublicStr) == "true"
		}

		isFeatured := false
		if isFeaturedStr != "" {
			isFeatured = strings.ToLower(isFeaturedStr) == "true"
		}

		isPinned := false
		if isPinnedStr != "" {
			isPinned = strings.ToLower(isPinnedStr) == "true"
		}

		if title == "" {
			return nil, errors.New("title is required")
		}

		if slug == "" {
			slug = GenerateSlug(title)
		} else {
			slug = SanitizeSlug(slug)
		}

		if slugSet[slug] {
			return nil, errors.New("duplicate slug in CSV: " + slug)
		}
		slugSet[slug] = true

		categoryID, err := strconv.ParseUint(categoryIDStr, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid category ID: %s", categoryIDStr)
		}
		subCategoryID, err := strconv.ParseUint(subCategoryIDStr, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid sub-category ID: %s", subCategoryIDStr)
		}

		subCategoryIDUint := uint(subCategoryID)
		posts = append(posts, Post{
			Title:         title,
			Slug:          slug,
			Summary:       summary,
			Content:       content,
			Thumbnail:     thumbnail,
			CategoryID:    uint(categoryID),
			SubCategoryID: &subCategoryIDUint,
			MetaTitle: metaTitle,
			MetaDescription: metaDescription,
			Keywords: keywords,
			OGImage: ogImage,
			Status: StatusDraft,
			IsPublic: isPublic,
			IsFeatured: isFeatured,
			IsPinned: isPinned,
			CreatedBy: userID,
			Version: 1,
		})
	}

	return posts, nil
}
