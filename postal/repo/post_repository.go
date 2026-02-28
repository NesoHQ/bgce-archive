package repo

import (
	"context"
	"errors"
	"fmt"

	"postal/domain"
	"postal/post"

	"gorm.io/gorm"
)

type postRepository struct {
	db *gorm.DB
}

func NewPostRepository(db *gorm.DB) post.Repository {
	return &postRepository{db: db}
}

func (r *postRepository) Create(ctx context.Context, post *domain.Post) error {
	return r.db.WithContext(ctx).Create(post).Error
}

func (r *postRepository) WithTransaction(ctx context.Context, fn func(txRepo post.Repository) error) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txRepo := &postRepository{db: tx}
		return fn(txRepo)
	})
}

func (r *postRepository) GetByID(ctx context.Context, id uint) (*domain.Post, error) {
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

func (r *postRepository) GetByUUID(ctx context.Context, uuid string) (*domain.Post, error) {
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

func (r *postRepository) GetBySlug(ctx context.Context, slug string) (*domain.Post, error) {
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

func (r *postRepository) List(ctx context.Context, filter post.PostFilter, withContent bool) ([]*domain.Post, int64, error) {
	var posts []*domain.Post
	var total int64

	baseQuery := r.db.WithContext(ctx).Model(&domain.Post{})

	// Apply filters
	if filter.Status != nil {
		baseQuery = baseQuery.Where("status = ?", *filter.Status)
	}
	if filter.CategoryID != nil {
		baseQuery = baseQuery.Where("category_id = ?", *filter.CategoryID)
	}
	if filter.SubCategoryID != nil {
		baseQuery = baseQuery.Where("sub_category_id = ?", *filter.SubCategoryID)
	}
	if filter.IsFeatured != nil {
		baseQuery = baseQuery.Where("is_featured = ?", *filter.IsFeatured)
	}
	if filter.IsPinned != nil {
		baseQuery = baseQuery.Where("is_pinned = ?", *filter.IsPinned)
	}
	if filter.IsPublic != nil {
		baseQuery = baseQuery.Where("is_public = ?", *filter.IsPublic)
	}
	if filter.Search != nil && *filter.Search != "" {
		searchTerm := "%" + *filter.Search + "%"
		baseQuery = baseQuery.Where("title ILIKE ? OR content ILIKE ? OR summary ILIKE ?", searchTerm, searchTerm, searchTerm)
	}

	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	selectQuery := r.db.WithContext(ctx).Model(&domain.Post{})

	if !withContent {
		selectQuery = selectQuery.Select(
			"id", "order_no", "slug", "title", "summary", "meta_description", "keywords",
			"category_id", "sub_category_id", "is_featured", "is_pinned",
			"status", "created_by", "view_count", "created_at",
			"CHAR_LENGTH(content) as content_length",
		)
	}

	// Apply same filters
	if filter.Status != nil {
		selectQuery = selectQuery.Where("status = ?", *filter.Status)
	}
	if filter.CategoryID != nil {
		selectQuery = selectQuery.Where("category_id = ?", *filter.CategoryID)
	}
	if filter.SubCategoryID != nil {
		selectQuery = selectQuery.Where("sub_category_id = ?", *filter.SubCategoryID)
	}
	if filter.IsFeatured != nil {
		selectQuery = selectQuery.Where("is_featured = ?", *filter.IsFeatured)
	}
	if filter.IsPinned != nil {
		selectQuery = selectQuery.Where("is_pinned = ?", *filter.IsPinned)
	}
	if filter.IsPublic != nil {
		selectQuery = selectQuery.Where("is_public = ?", *filter.IsPublic)
	}
	if filter.Search != nil && *filter.Search != "" {
		searchTerm := "%" + *filter.Search + "%"
		selectQuery = selectQuery.Where("title ILIKE ? OR content ILIKE ? OR summary ILIKE ?", searchTerm, searchTerm, searchTerm)
	}

	sortBy := "order_no"
	if filter.SortBy != "" {
		sortBy = filter.SortBy
	}
	sortOrder := "ASC"
	if filter.SortOrder != "" {
		sortOrder = filter.SortOrder
	}
	allowedSortColumns := map[string]bool{
		"order_no": true, "created_at": true, "title": true,
		"view_count": true, "id": true,
	}
	if !allowedSortColumns[sortBy] {
		sortBy = "order_no"
	}
	if sortOrder != "ASC" && sortOrder != "DESC" {
		sortOrder = "ASC"
	}
	selectQuery = selectQuery.Order(fmt.Sprintf("%s %s", sortBy, sortOrder))

	if filter.Limit > 0 {
		selectQuery = selectQuery.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		selectQuery = selectQuery.Offset(filter.Offset)
	}

	err := selectQuery.Find(&posts).Error
	return posts, total, err
}

func (r *postRepository) Update(ctx context.Context, post *domain.Post) error {
	return r.db.WithContext(ctx).Save(post).Error
}

func (r *postRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Post{}, id).Error
}

func (r *postRepository) HardDelete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Unscoped().Delete(&domain.Post{}, id).Error
}

func (r *postRepository) BatchDeleteByUUIDs(ctx context.Context, uuids []string) error {
	if len(uuids) == 0 {
		return nil
	}

	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var count int64
		if err := tx.Model(&domain.Post{}).Where("uuid IN ?", uuids).Count(&count).Error; err != nil {
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

		return tx.Where("uuid IN ?", uuids).Delete(&domain.Post{}).Error
	})
}

func (r *postRepository) SlugExists(ctx context.Context, slug string, excludeID uint) (bool, error) {
	var count int64
	query := r.db.WithContext(ctx).Model(&domain.Post{}).Where("slug = ?", slug)
	if excludeID > 0 {
		query = query.Where("id != ?", excludeID)
	}
	err := query.Count(&count).Error
	return count > 0, err
}

func (r *postRepository) BatchCreate(ctx context.Context, posts *[]domain.Post) error {
	const batchSize = 1000
	return r.db.WithContext(ctx).Select("*").CreateInBatches(*posts, batchSize).Error
}

func (r *postRepository) FindExistingSlugs(ctx context.Context, slugs []string) (map[string]bool, error) {
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

func (r *postRepository) GetMaxOrderNo(ctx context.Context) (uint, error) {
	var maxOrderNo uint

	err := r.db.WithContext(ctx).
		Model(&domain.Post{}).
		Select("COALESCE(MAX(order_no), 0)").
		Row().
		Scan(&maxOrderNo)
	if err != nil {
		return 0, err
	}

	return maxOrderNo, nil
}
