package post

import (
	"context"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, post *Post) error
	GetByID(ctx context.Context, id uint) (*Post, error)
	GetByUUID(ctx context.Context, uuid string) (*Post, error)
	GetBySlug(ctx context.Context, slug string) (*Post, error)
	List(ctx context.Context, filter PostFilter) ([]*Post, int64, error)
	Update(ctx context.Context, post *Post) error
	Delete(ctx context.Context, id uint) error
	HardDelete(ctx context.Context, id uint) error
	SlugExists(ctx context.Context, slug string, excludeID uint) (bool, error)
	BatchCreate(ctx context.Context, posts[]Post) error
	FindExistingSlugs(ctx context.Context, slugs []string) (map[string]bool, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, post *Post) error {
	return r.db.WithContext(ctx).Create(post).Error
}

func (r *repository) GetByID(ctx context.Context, id uint) (*Post, error) {
	var post Post
	err := r.db.WithContext(ctx).First(&post, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &post, nil
}

func (r *repository) GetByUUID(ctx context.Context, uuid string) (*Post, error) {
	var post Post
	err := r.db.WithContext(ctx).Where("uuid = ?", uuid).First(&post).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &post, nil
}

func (r *repository) GetBySlug(ctx context.Context, slug string) (*Post, error) {
	var post Post
	err := r.db.WithContext(ctx).Where("slug = ? AND status = ?", slug, StatusPublished).First(&post).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &post, nil
}

func (r *repository) List(ctx context.Context, filter PostFilter) ([]*Post, int64, error) {
	var posts []*Post
	var total int64

	query := r.db.WithContext(ctx).Model(&Post{})

	// Apply filters
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.CategoryID != nil {
		query = query.Where("category_id = ?", *filter.CategoryID)
	}
	if filter.SubCategoryID != nil {
		query = query.Where("sub_category_id = ?", *filter.SubCategoryID)
	}
	if filter.IsFeatured != nil {
		query = query.Where("is_featured = ?", *filter.IsFeatured)
	}
	if filter.IsPinned != nil {
		query = query.Where("is_pinned = ?", *filter.IsPinned)
	}
	if filter.IsPublic != nil {
		query = query.Where("is_public = ?", *filter.IsPublic)
	}
	if filter.Search != nil && *filter.Search != "" {
		searchTerm := "%" + *filter.Search + "%"
		query = query.Where("title ILIKE ? OR content ILIKE ? OR summary ILIKE ?", searchTerm, searchTerm, searchTerm)
	}

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply sorting
	sortBy := "created_at"
	if filter.SortBy != "" {
		sortBy = filter.SortBy
	}
	sortOrder := "DESC"
	if filter.SortOrder != "" {
		sortOrder = filter.SortOrder
	}
	query = query.Order(fmt.Sprintf("%s %s", sortBy, sortOrder))

	// Apply pagination
	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	err := query.Find(&posts).Error
	return posts, total, err
}

func (r *repository) Update(ctx context.Context, post *Post) error {
	return r.db.WithContext(ctx).Save(post).Error
}

func (r *repository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&Post{}, id).Error
}

func (r *repository) HardDelete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Unscoped().Delete(&Post{}, id).Error
}

func (r *repository) SlugExists(ctx context.Context, slug string, excludeID uint) (bool, error) {
	var count int64
	query := r.db.WithContext(ctx).Model(&Post{}).Where("slug = ?", slug)
	if excludeID > 0 {
		query = query.Where("id != ?", excludeID)
	}
	err := query.Count(&count).Error
	return count > 0, err
}


func (r *repository) BatchCreate(ctx context.Context, posts[]Post) error {
	tx := r.db.WithContext(ctx).Begin()
	if tx.Error != nil {
		return tx.Error
	}

	const batchSize = 1000

	for i := 0; i < len(posts); i += batchSize{
		end := i + batchSize
		if end > len(posts) {
			end = len(posts)
		}

		if err := tx.Create(posts[i:end]).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

func (r *repository) FindExistingSlugs(ctx context.Context, slugs []string) (map[string]bool, error){
	var existing []string

	err := r.db.WithContext(ctx).
		Model(&Post{}).
		Where("slug IN ?", slugs).
		Pluck("slug", &existing).Error

	if err != nil {
		return nil, err
	}

	result := make(map[string]bool)
	for _, slug := range existing {
		result[slug] = true
	}

	return result, nil
}