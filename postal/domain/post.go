package domain

import (
	"time"

	"github.com/google/uuid"
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

// BeforeCreate hook to generate UUID
func (p *Post) BeforeCreate(tx *gorm.DB) error {
	if p.UUID == "" {
		p.UUID = uuid.New().String()
	}
	return nil
}

// TableName specifies the table name
func (Post) TableName() string {
	return "posts"
}
