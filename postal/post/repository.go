package post

import (
	"context"
	"errors"
	"fmt"
	"postal/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	Create(ctx context.Context, post *domain.Post) error
	GetByID(ctx context.Context, id uint) (*domain.Post, error)
	GetByUUID(ctx context.Context, uuid string) (*domain.Post, error)
	GetBySlug(ctx context.Context, slug string) (*domain.Post, error)
	List(ctx context.Context, filter PostFilter) ([]*domain.Post, int64, error)
	Update(ctx context.Context, post *domain.Post) error
	Delete(ctx context.Context, id uint) error
	HardDelete(ctx context.Context, id uint) error
	BatchDeleteByUUIDs(ctx context.Context, uuids []string) error
	SlugExists(ctx context.Context, slug string, excludeID uint) (bool, error)
	BatchCreate(ctx context.Context, posts *[]domain.Post) error
	FindExistingSlugs(ctx context.Context, slugs []string) (map[string]bool, error)
	GetMaxOrderNo(ctx context.Context) (uint, error)
	WithTransaction(ctx context.Context, fn func(txRepo Repository) error) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, post *domain.Post) error {
	return r.db.WithContext(ctx).Create(post).Error
}

func (r *repository) WithTransaction(ctx context.Context, fn func(txRepo Repository) error) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txRepo := &repository{db: tx}
		return fn(txRepo)
	})
}

func (r *repository) GetByID(ctx context.Context, id uint) (*domain.Post, error) {
	var post domain.Post
	err := r.db.WithContext(ctx).First(&post, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &post, nil
}

func (r *repository) GetByUUID(ctx context.Context, uuid string) (*domain.Post, error) {
	var post domain.Post
	err := r.db.WithContext(ctx).Where("uuid = ?", uuid).First(&post).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &post, nil
}

func (r *repository) GetBySlug(ctx context.Context, slug string) (*domain.Post, error) {
	var post domain.Post
	err := r.db.WithContext(ctx).Where("slug = ? AND status = ?", slug, domain.StatusPublished).First(&post).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("post not found")
		}
		return nil, err
	}
	return &post, nil
}

func (r *repository) List(ctx context.Context, filter PostFilter) ([]*domain.Post, int64, error) {
	var posts []*domain.Post
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Post{})

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

func (r *repository) Update(ctx context.Context, post *domain.Post) error {
	return r.db.WithContext(ctx).Save(post).Error
}

func (r *repository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Post{}, id).Error
}

func (r *repository) HardDelete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Unscoped().Delete(&domain.Post{}, id).Error
}

func (r *repository) BatchDeleteByUUIDs(ctx context.Context, uuids []string) error {
	if len(uuids) == 0 {
		return nil
	}

	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var  count int64
		if err := tx.Model(&domain.Post{}).
			Where("uuid IN ?", uuids).
			Count(&count).Error; err != nil {
			return err
		}

		if count == 0 {
			return errors.New("no posts found for provided uuids")
		}

		if int(count) != len(uuids) {
			return errors.New("some posts not found for provided uuids")
		}

		if err := tx.Model(&domain.Post{}).
			Where("uuid IN ?", uuids).
			Updates(map[string]interface{}{
				"slug":   gorm.Expr("CONCAT('deleted-', uuid)"),
				"status": domain.StatusDeleted,
			}).Error; err != nil {
				return err
			}

		if err := tx.Where("uuid IN ?", uuids).
			Delete(&domain.Post{}).Error; err != nil {
				return err
			}

		return nil
	})
}

func (r *repository) SlugExists(ctx context.Context, slug string, excludeID uint) (bool, error) {
	var count int64
	query := r.db.WithContext(ctx).Model(&domain.Post{}).Where("slug = ?", slug)
	if excludeID > 0 {
		query = query.Where("id != ?", excludeID)
	}
	err := query.Count(&count).Error
	return count > 0, err
}

func (r *repository) BatchCreate(ctx context.Context, posts *[]domain.Post) error {
	const batchSize = 1000
	return r.db.WithContext(ctx).Select("*").CreateInBatches(*posts, batchSize).Error
}

func (r *repository) FindExistingSlugs(ctx context.Context, slugs []string) (map[string]bool, error) {
	var existing []string

	err := r.db.WithContext(ctx).
		Model(&domain.Post{}).
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

func (r *repository) GetMaxOrderNo(ctx context.Context) (uint, error) {
	var post domain.Post

	err := r.db.WithContext(ctx).
		Model(&domain.Post{}).
		Order("order_no DESC").
		Clauses(clause.Locking{Strength: "UPDATE"}).
		Limit(1).
		Select("order_no").
		First(&post).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, nil
	}

	if err != nil {
		return 0, err
	}

	return post.OrderNo, nil
}
