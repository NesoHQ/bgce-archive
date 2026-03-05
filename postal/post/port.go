package post

import (
	"context"
	"mime/multipart"

	"postal/domain"
)

// Service defines the business logic interface for posts
type Service interface {
	CreatePost(ctx context.Context, req CreatePostRequest, userID uint) (*PostResponse, error)
	GetPostByID(ctx context.Context, id uint) (*PostResponse, error)
	GetPostByUUID(ctx context.Context, uuid string) (*PostResponse, error)
	GetPostBySlug(ctx context.Context, slug string) (*PostResponse, error)
	ListPosts(ctx context.Context, filter PostFilter) ([]*PostListItemResponse, int64, error)
	UpdatePost(ctx context.Context, id uint, req UpdatePostRequest, userID uint) (*PostResponse, error)
	PublishPost(ctx context.Context, id uint, userID uint) error
	UnpublishPost(ctx context.Context, id uint, userID uint) error
	ArchivePost(ctx context.Context, id uint, userID uint) error
	RestorePost(ctx context.Context, id uint, userID uint) error
	DeletePost(ctx context.Context, id uint) error
	HardDeletePost(ctx context.Context, id uint) error
	BatchUploadPosts(ctx context.Context, userID uint, file *multipart.File) error
	BatchDeletePosts(ctx context.Context, uuids *[]string) error
	SeedReadTime(ctx context.Context, userID uint) error
	IncrementViewCount(ctx context.Context, id uint) error
}

// Repository defines the interface for post persistence
type Repository interface {
	Create(ctx context.Context, post *domain.Post) error
	GetByID(ctx context.Context, id uint) (*domain.Post, error)
	GetByUUID(ctx context.Context, uuid string) (*domain.Post, error)
	GetBySlug(ctx context.Context, slug string) (*domain.Post, error)
	List(ctx context.Context, filter PostFilter, withContent bool) ([]*domain.Post, int64, error)
	Update(ctx context.Context, post *domain.Post) error
	Delete(ctx context.Context, id uint) error
	HardDelete(ctx context.Context, id uint) error
	BatchDeleteByUUIDs(ctx context.Context, uuids []string) error
	SlugExists(ctx context.Context, slug string, excludeID uint) (bool, error)
	BatchCreate(ctx context.Context, posts *[]domain.Post) error
	FindExistingSlugs(ctx context.Context, slugs []string) (map[string]bool, error)
	GetMaxOrderNo(ctx context.Context) (uint, error)
	IncrementViewCount(ctx context.Context, id uint) error
	WithTransaction(ctx context.Context, fn func(txRepo Repository) error) error
}
