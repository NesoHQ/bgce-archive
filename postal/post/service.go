package post

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"time"

	"postal/domain"
	"postal/post_version"
	"postal/util"
)

type Service interface {
	CreatePost(ctx context.Context, req CreatePostRequest, userID uint) (*PostResponse, error)
	GetPostByID(ctx context.Context, id uint) (*PostResponse, error)
	GetPostByUUID(ctx context.Context, uuid string) (*PostResponse, error)
	GetPostBySlug(ctx context.Context, slug string) (*PostResponse, error)
	ListPosts(ctx context.Context, filter PostFilter) ([]*PostResponse, int64, error)
	UpdatePost(ctx context.Context, id uint, req UpdatePostRequest, userID uint) (*PostResponse, error)
	PublishPost(ctx context.Context, id uint, userID uint) error
	UnpublishPost(ctx context.Context, id uint, userID uint) error
	ArchivePost(ctx context.Context, id uint, userID uint) error
	RestorePost(ctx context.Context, id uint, userID uint) error
	DeletePost(ctx context.Context, id uint) error
	HardDeletePost(ctx context.Context, id uint) error
	BatchUploadPosts(ctx context.Context, userID uint, file *multipart.File) error
	BatchDeletePosts(ctx context.Context, uuids *[]string) error
}

type PostCache interface {
	SetPost(ctx context.Context, post *domain.Post) error
	GetByID(ctx context.Context, id uint) (*domain.Post, error)
	GetBySlug(ctx context.Context, slug string) (*domain.Post, error)
}

type service struct {
	repo        Repository
	versionRepo post_version.Repository
	cache       PostCache
}

func NewService(repo Repository, versionRepo post_version.Repository, cache PostCache) Service {
	return &service{
		repo:        repo,
		versionRepo: versionRepo,
		cache:       cache,
	}
}

func (s *service) CreatePost(ctx context.Context, req CreatePostRequest, userID uint) (*PostResponse, error) {
	// Generate slug if not provided or sanitize
	slug := req.Slug
	if slug == "" {
		slug = util.GenerateSlug(req.Title)
	} else {
		slug = util.SanitizeSlug(slug)
	}

	// Check slug uniqueness
	exists, err := s.repo.SlugExists(ctx, slug, 0)
	if err != nil {
		return nil, fmt.Errorf("failed to check slug uniqueness: %w", err)
	}
	if exists {
		return nil, fmt.Errorf("slug already exists")
	}

	// Set defaults
	isPublic := true
	if req.IsPublic != nil {
		isPublic = *req.IsPublic
	}
	isFeatured := false
	if req.IsFeatured != nil {
		isFeatured = *req.IsFeatured
	}
	isPinned := false
	if req.IsPinned != nil {
		isPinned = *req.IsPinned
	}

	post := &domain.Post{
		Title:           req.Title,
		Slug:            slug,
		Summary:         req.Summary,
		Content:         req.Content,
		Thumbnail:       req.Thumbnail,
		CategoryID:      req.CategoryID,
		SubCategoryID:   req.SubCategoryID,
		MetaTitle:       req.MetaTitle,
		MetaDescription: req.MetaDescription,
		Keywords:        req.Keywords,
		OGImage:         req.OGImage,
		Status:          domain.StatusDraft,
		IsPublic:        isPublic,
		IsFeatured:      isFeatured,
		IsPinned:        isPinned,
		CreatedBy:       userID,
		Version:         1,
	}

	if err := s.repo.Create(ctx, post); err != nil {
		return nil, fmt.Errorf("failed to create post: %w", err)
	}

	s.cachePost(ctx, post)

	// Create initial version
	if err := s.createVersion(ctx, post, userID, "Initial version"); err != nil {
		// Log error but don't fail the request
		fmt.Printf("Failed to create version: %v\n", err)
	}

	return ToPostResponse(post), nil
}

func (s *service) GetPostByID(ctx context.Context, id uint) (*PostResponse, error) {
	if s.cache != nil {
		post, err := s.cache.GetByID(ctx, id)
		if err != nil {
			return nil, err
		}
		if post != nil {
			// Cache HIT - returning from Redis
			log.Printf("Cache HIT - returning from Redis (id=%d)", id)
			return ToPostResponse(post), nil
		}
	}
	// Cache MISS - loading from DB and backfilling cache
	log.Printf("Cache MISS - loading from DB and backfilling cache (id=%d)", id)
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	s.cachePost(ctx, post)
	return ToPostResponse(post), nil
}

func (s *service) GetPostByUUID(ctx context.Context, uuid string) (*PostResponse, error) {
	post, err := s.repo.GetByUUID(ctx, uuid)
	if err != nil {
		return nil, err
	}
	return ToPostResponse(post), nil
}

func (s *service) GetPostBySlug(ctx context.Context, slug string) (*PostResponse, error) {
	if s.cache != nil {
		post, err := s.cache.GetBySlug(ctx, slug)
		if err != nil {
			return nil, err
		}
		if post != nil {
			// Cache HIT - returning from Redis
			log.Printf("Cache HIT - returning from Redis (slug=%s)", slug)
			return ToPostResponse(post), nil
		}
	}
	// Cache MISS - loading from DB and backfilling cache
	log.Printf("Cache MISS - loading from DB and backfilling cache (slug=%s)", slug)
	post, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	s.cachePost(ctx, post)
	return ToPostResponse(post), nil
}

func (s *service) ListPosts(ctx context.Context, filter PostFilter) ([]*PostResponse, int64, error) {
	posts, total, err := s.repo.List(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]*PostResponse, len(posts))
	for i, post := range posts {
		responses[i] = ToPostResponse(post)
	}

	return responses, total, nil
}

func (s *service) UpdatePost(ctx context.Context, id uint, req UpdatePostRequest, userID uint) (*PostResponse, error) {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Track if content changed for versioning
	contentChanged := false

	// Update fields
	if req.Title != nil {
		post.Title = *req.Title
		contentChanged = true
	}
	if req.Slug != nil {
		slug := util.SanitizeSlug(*req.Slug)
		exists, err := s.repo.SlugExists(ctx, slug, post.ID)
		if err != nil {
			return nil, fmt.Errorf("failed to check slug uniqueness: %w", err)
		}
		if exists {
			return nil, fmt.Errorf("slug already exists")
		}
		post.Slug = slug
	}
	if req.Summary != nil {
		post.Summary = *req.Summary
		contentChanged = true
	}
	if req.Content != nil {
		post.Content = *req.Content
		contentChanged = true
	}
	if req.Thumbnail != nil {
		post.Thumbnail = *req.Thumbnail
	}
	if req.CategoryID != nil {
		post.CategoryID = *req.CategoryID
	}
	if req.SubCategoryID != nil {
		post.SubCategoryID = req.SubCategoryID
	}
	if req.MetaTitle != nil {
		post.MetaTitle = *req.MetaTitle
	}
	if req.MetaDescription != nil {
		post.MetaDescription = *req.MetaDescription
	}
	if req.Keywords != nil {
		post.Keywords = *req.Keywords
	}
	if req.OGImage != nil {
		post.OGImage = *req.OGImage
	}
	if req.IsPublic != nil {
		post.IsPublic = *req.IsPublic
	}
	if req.IsFeatured != nil {
		post.IsFeatured = *req.IsFeatured
	}
	if req.IsPinned != nil {
		post.IsPinned = *req.IsPinned
	}

	post.UpdatedBy = userID

	// Increment version if content changed
	if contentChanged {
		post.Version++
	}

	if err := s.repo.Update(ctx, post); err != nil {
		return nil, fmt.Errorf("failed to update post: %w", err)
	}

	// Create version if content changed
	if contentChanged {
		if err := s.createVersion(ctx, post, userID, "Content updated"); err != nil {
			fmt.Printf("Failed to create version: %v\n", err)
		}
	}

	return ToPostResponse(post), nil
}

func (s *service) PublishPost(ctx context.Context, id uint, userID uint) error {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if post.Status == domain.StatusPublished {
		return fmt.Errorf("post is already published")
	}

	now := time.Now()
	post.Status = domain.StatusPublished
	post.PublishedAt = &now
	post.UpdatedBy = userID

	return s.repo.Update(ctx, post)
}

func (s *service) UnpublishPost(ctx context.Context, id uint, userID uint) error {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	post.Status = domain.StatusDraft
	post.UpdatedBy = userID

	return s.repo.Update(ctx, post)
}

func (s *service) ArchivePost(ctx context.Context, id uint, userID uint) error {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	now := time.Now()
	post.Status = domain.StatusArchived
	post.ArchivedAt = &now
	post.UpdatedBy = userID

	return s.repo.Update(ctx, post)
}

func (s *service) RestorePost(ctx context.Context, id uint, userID uint) error {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	post.Status = domain.StatusDraft
	post.ArchivedAt = nil
	post.UpdatedBy = userID

	return s.repo.Update(ctx, post)
}

func (s *service) DeletePost(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}

func (s *service) HardDeletePost(ctx context.Context, id uint) error {
	return s.repo.HardDelete(ctx, id)
}

func (s *service) createVersion(ctx context.Context, post *domain.Post, userID uint, changeNote string) error {
	version := &post_version.PostVersion{
		PostID:     post.ID,
		VersionNo:  post.Version,
		Title:      post.Title,
		Content:    post.Content,
		Summary:    post.Summary,
		EditedBy:   userID,
		ChangeNote: changeNote,
	}
	return s.versionRepo.Create(ctx, version)
}

func (s *service) BatchUploadPosts(ctx context.Context, userID uint, file *multipart.File) error {
	posts, slugRows, err := util.ParseAndValidateCSV(file, userID)
	if err != nil {
		return fmt.Errorf("failed to parse CSV: %w", err)
	}

	if err := s.repo.WithTransaction(ctx, func(txRepo Repository) error {
		// collect slugs for uniqueness check
		slugs := make([]string, 0, len(*slugRows))
		for _, sr := range *slugRows {
			slugs = append(slugs, sr.Slug)
		}

		// check in DB within the same transaction
		existing, err := txRepo.FindExistingSlugs(ctx, slugs)
		if err != nil {
			return err
		}

		for _, sr := range *slugRows {
			if existing[sr.Slug] {
				return fmt.Errorf("row %d: slug '%s' already exists in database", sr.Row, sr.Slug)
			}
		}

		// Get max order_no and add a buffer to avoid conflicts
		maxOrderNo, err := txRepo.GetMaxOrderNo(ctx)
		if err != nil {
			return fmt.Errorf("failed to get max order no: %w", err)
		}

		// Start from maxOrderNo + 1 to ensure no conflicts
		currentOrderNo := maxOrderNo
		for i := range *posts {
			currentOrderNo++
			(*posts)[i].OrderNo = currentOrderNo
		}

		return txRepo.BatchCreate(ctx, posts)
	}); err != nil {
		return err
	}

	for i := range *posts {
		s.cachePost(ctx, &(*posts)[i])
	}

	return nil
}

func (s *service) BatchDeletePosts(ctx context.Context, uuids *[]string) error {
	if len(*uuids) == 0 {
		return fmt.Errorf("no post UUIDs provided")
	}

	unique := make(map[string]struct{}, len(*uuids))
	for _, u := range *uuids {
		if u == "" {
			continue
		}
		unique[u] = struct{}{}
	}

	if len(unique) == 0 {
		return fmt.Errorf("no valid post UUIDs provided")
	}

	ids := make([]string, 0, len(unique))
	for u := range unique {
		ids = append(ids, u)
	}

	return s.repo.BatchDeleteByUUIDs(ctx, ids)
}

func (s *service) cachePost(ctx context.Context, post *domain.Post) {
	if s.cache == nil || post == nil {
		return
	}

	if err := s.cache.SetPost(ctx, post); err != nil {
		fmt.Printf("Failed to cache post: %v\n", err)
	}
}
