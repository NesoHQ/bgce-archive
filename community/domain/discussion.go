package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DiscussionStatus string

const (
	DiscussionStatusOpen   DiscussionStatus = "open"
	DiscussionStatusClosed DiscussionStatus = "closed"
	DiscussionStatusLocked DiscussionStatus = "locked"
)

type Discussion struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	UUID      string         `gorm:"type:uuid;uniqueIndex;not null" json:"uuid"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	// Multi-tenant support
	TenantID *uint `gorm:"index" json:"tenant_id,omitempty"`

	// References (cross-service; no FK)
	UserID     uint  `gorm:"not null;index" json:"user_id"`
	CategoryID uint  `gorm:"not null;index" json:"category_id"`

	// Content
	Title   string `gorm:"type:varchar(500);not null" json:"title"`
	Slug    string `gorm:"type:varchar(500);uniqueIndex;not null" json:"slug"`
	Content string `gorm:"type:text;not null" json:"content"`

	// Status
	Status   DiscussionStatus `gorm:"type:varchar(20);not null;default:'open';index" json:"status"`
	IsPinned bool             `gorm:"default:false;index" json:"is_pinned"`

	// Stats
	UpvoteCount   int       `gorm:"default:0" json:"upvote_count"`
	ViewCount     int       `gorm:"default:0" json:"view_count"`
	ReplyCount    int       `gorm:"default:0" json:"reply_count"`
	LastActivityAt *time.Time `json:"last_activity_at,omitempty"`
}

func (d *Discussion) BeforeCreate(tx *gorm.DB) error {
	if d.UUID == "" {
		d.UUID = uuid.New().String()
	}
	return nil
}

func (Discussion) TableName() string {
	return "discussions"
}
