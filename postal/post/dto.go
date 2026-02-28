package post

import (
	"time"

	"postal/domain"
)

type CreatePostRequest struct {
	Title           string `json:"title" validate:"required,min=3,max=500"`
	Slug            string `json:"slug" validate:"required,min=3,max=500"`
	Summary         string `json:"summary" validate:"max=1000"`
	Content         string `json:"content" validate:"required"`
	Thumbnail       string `json:"thumbnail"`
	CategoryID      uint   `json:"category_id" validate:"required,min=1"`
	SubCategoryID   *uint  `json:"sub_category_id"`
	MetaTitle       string `json:"meta_title" validate:"max=500"`
	MetaDescription string `json:"meta_description" validate:"max=1000"`
	Keywords        string `json:"keywords"`
	OGImage         string `json:"og_image"`
	IsPublic        *bool  `json:"is_public"`
	IsFeatured      *bool  `json:"is_featured"`
	IsPinned        *bool  `json:"is_pinned"`
}

type UpdatePostRequest struct {
	Title           *string `json:"title" validate:"omitempty,min=3,max=500"`
	Slug            *string `json:"slug" validate:"omitempty,min=3,max=500"`
	Summary         *string `json:"summary" validate:"omitempty,max=1000"`
	Content         *string `json:"content"`
	Thumbnail       *string `json:"thumbnail"`
	CategoryID      *uint   `json:"category_id" validate:"omitempty,min=1"`
	SubCategoryID   *uint   `json:"sub_category_id"`
	MetaTitle       *string `json:"meta_title" validate:"omitempty,max=500"`
	MetaDescription *string `json:"meta_description" validate:"omitempty,max=1000"`
	Keywords        *string `json:"keywords"`
	OGImage         *string `json:"og_image"`
	IsPublic        *bool   `json:"is_public"`
	IsFeatured      *bool   `json:"is_featured"`
	IsPinned        *bool   `json:"is_pinned"`
}

type PostFilter struct {
	Status        *domain.PostStatus
	CategoryID    *uint
	SubCategoryID *uint
	IsFeatured    *bool
	IsPinned      *bool
	IsPublic      *bool
	Search        *string
	Limit         int
	Offset        int
	SortBy        string
	SortOrder     string
}

type PostResponse struct {
	ID              uint              `json:"id"`
	UUID            string            `json:"uuid"`
	Title           string            `json:"title"`
	Slug            string            `json:"slug"`
	Summary         string            `json:"summary"`
	Content         string            `json:"content"`
	Thumbnail       string            `json:"thumbnail,omitempty"`
	CategoryID      uint              `json:"category_id"`
	SubCategoryID   *uint             `json:"sub_category_id,omitempty"`
	MetaTitle       string            `json:"meta_title,omitempty"`
	MetaDescription string            `json:"meta_description,omitempty"`
	Keywords        string            `json:"keywords,omitempty"`
	OGImage         string            `json:"og_image,omitempty"`
	Status          domain.PostStatus `json:"status"`
	IsPublic        bool              `json:"is_public"`
	IsFeatured      bool              `json:"is_featured"`
	IsPinned        bool              `json:"is_pinned"`
	PublishedAt     *time.Time        `json:"published_at,omitempty"`
	ArchivedAt      *time.Time        `json:"archived_at,omitempty"`
	CreatedBy       uint              `json:"created_by"`
	UpdatedBy       uint              `json:"updated_by,omitempty"`
	ViewCount       int               `json:"view_count"`
	Version         int               `json:"version"`
	CreatedAt       time.Time         `json:"created_at"`
	UpdatedAt       time.Time         `json:"updated_at"`
}

// PostListItemResponse is a lighter response for list endpoints
type PostListItemResponse struct {
	ID              uint              `json:"id"`
	OrderNo         uint              `json:"order_no"`
	Slug            string            `json:"slug"`
	Title           string            `json:"title"`
	Summary         string            `json:"summary"`
	MetaDescription string            `json:"meta_description,omitempty"`
	Keywords        string            `json:"keywords,omitempty"`
	CategoryID      uint              `json:"category_id"`
	Status          domain.PostStatus `json:"status"`
	SubCategoryID   *uint             `json:"sub_category_id,omitempty"`
	IsFeatured      bool              `json:"is_featured"`
	IsPinned        bool              `json:"is_pinned"`
	CreatedBy       uint              `json:"created_by"`
	ViewCount       int               `json:"view_count"`
	ContentLength   int               `json:"content_length"` // For read time calculation

	CreatedAt time.Time `json:"created_at"`
}

type BatchDeleteRequest struct {
	UUIDs []string `json:"uuids" validate:"required,min=1,dive,required,uuid"`
}

func ToPostResponse(post *domain.Post) *PostResponse {
	return &PostResponse{
		ID:              post.ID,
		UUID:            post.UUID,
		Title:           post.Title,
		Slug:            post.Slug,
		Summary:         post.Summary,
		Content:         post.Content,
		Thumbnail:       post.Thumbnail,
		CategoryID:      post.CategoryID,
		SubCategoryID:   post.SubCategoryID,
		MetaTitle:       post.MetaTitle,
		MetaDescription: post.MetaDescription,
		Keywords:        post.Keywords,
		OGImage:         post.OGImage,
		Status:          post.Status,
		IsPublic:        post.IsPublic,
		IsFeatured:      post.IsFeatured,
		IsPinned:        post.IsPinned,
		PublishedAt:     post.PublishedAt,
		ArchivedAt:      post.ArchivedAt,
		CreatedBy:       post.CreatedBy,
		UpdatedBy:       post.UpdatedBy,
		ViewCount:       post.ViewCount,
		Version:         post.Version,
		CreatedAt:       post.CreatedAt,
		UpdatedAt:       post.UpdatedAt,
	}
}

func ToPostListItemResponse(post *domain.Post) *PostListItemResponse {
	return &PostListItemResponse{
		ID:              post.ID,
		OrderNo:         post.OrderNo,
		Slug:            post.Slug,
		Title:           post.Title,
		Summary:         post.Summary,
		MetaDescription: post.MetaDescription,
		Keywords:        post.Keywords,
		CategoryID:      post.CategoryID,
		Status:          post.Status,
		SubCategoryID:   post.SubCategoryID,
		IsFeatured:      post.IsFeatured,
		IsPinned:        post.IsPinned,
		CreatedBy:       post.CreatedBy,
		ViewCount:       post.ViewCount,
		ContentLength:   post.ContentLength,
		CreatedAt:       post.CreatedAt,
	}
}
