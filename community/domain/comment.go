package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CommentStatus string

const (
	CommentStatusPending  CommentStatus = "pending"
	CommentStatusApproved CommentStatus = "approved"
	CommentStatusRejected CommentStatus = "rejected"
	CommentStatusSpam     CommentStatus = "spam"
)

type Comment struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UUID      string    `gorm:"type:uuid;uniqueIndex;not null" json:"uuid"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Multi-tenant support
	TenantID *uint `gorm:"index" json:"tenant_id,omitempty"`

	// References (cross-service; no FK)
	PostID   *uint `gorm:"index" json:"post_id,omitempty"`
	UserID   uint  `gorm:"not null;index" json:"user_id"`
	ParentID *uint `gorm:"index" json:"parent_id,omitempty"`

	// Content
	Content string `gorm:"type:text;not null" json:"content"`

	// Moderation
	Status        CommentStatus `gorm:"type:varchar(20);not null;default:'pending';index" json:"status"`
	ToxicityScore *float64      `gorm:"type:decimal(3,2)" json:"toxicity_score,omitempty"`

	// Stats
	LikeCount  int `gorm:"default:0" json:"like_count"`
	ReplyCount int `gorm:"default:0" json:"reply_count"`
}

func (c *Comment) BeforeCreate(tx *gorm.DB) error {
	if c.UUID == "" {
		c.UUID = uuid.New().String()
	}
	return nil
}

func (Comment) TableName() string {
	return "comments"
}
