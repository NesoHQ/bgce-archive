package post

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"time"

	"postal/cache"
	"postal/domain"
	"postal/post_version"
	"postal/util"
)

type service struct {
	repo        Repository
	versionRepo post_version.Repository
	cache       cache.Cache
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

	// Get the next order_no
	maxOrderNo, err := s.repo.GetMaxOrderNo(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get max order no: %w", err)
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
		OrderNo:         maxOrderNo + 1,
	}

	if err := s.repo.Create(ctx, post); err != nil {
		return nil, fmt.Errorf("failed to create post: %w", err)
	}

	s.cachePost(ctx, post)

	// Invalidate list caches to show new post immediately
	s.invalidateListCaches(ctx)

	// Create initial version
	if err := s.createVersion(ctx, post, userID, "Initial version"); err != nil {
		// Log error but don't fail the request
		fmt.Printf("Failed to create version: %v\n", err)
	}

	return ToPostResponse(post), nil
}

func (s *service) GetPostByID(ctx context.Context, id uint) (*PostResponse, error) {
	// Try cache first
	if s.cache != nil {
		cacheKey := fmt.Sprintf("post:id:%d", id)
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil && cached != "" {
			var post domain.Post
			if err := json.Unmarshal([]byte(cached), &post); err == nil {
				log.Printf("Cache HIT - returning from Redis (id=%d)", id)
				return ToPostResponse(&post), nil
			}
		}
	}

	// Cache MISS - load from DB
	log.Printf("Cache MISS - loading from DB (id=%d)", id)
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Backfill cache
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
	// Try cache first
	if s.cache != nil {
		cacheKey := fmt.Sprintf("post:slug:%s", slug)
		cached, err := s.cache.Get(ctx, cacheKey)
		if err == nil && cached != "" {
			var post domain.Post
			if err := json.Unmarshal([]byte(cached), &post); err == nil {
				log.Printf("Cache HIT - returning from Redis (slug=%s)", slug)
				return ToPostResponse(&post), nil
			}
		}
	}

	// Cache MISS - load from DB
	log.Printf("Cache MISS - loading from DB (slug=%s)", slug)
	post, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	// Backfill cache
	s.cachePost(ctx, post)
	return ToPostResponse(post), nil
}

func (s *service) ListPosts(ctx context.Context, filter PostFilter) ([]*PostListItemResponse, int64, error) {
	// Try cache first for list queries
	if s.cache != nil {
		cacheKey := s.buildListCacheKey(filter)

		cacheStart := time.Now()
		cached, err := s.cache.Get(ctx, cacheKey)
		cacheGetTime := time.Since(cacheStart)

		if err == nil && cached != "" {
			unmarshalStart := time.Now()
			var cachedResult struct {
				Posts []*PostListItemResponse `json:"posts"`
				Total int64                   `json:"total"`
			}
			if err := json.Unmarshal([]byte(cached), &cachedResult); err == nil {
				unmarshalTime := time.Since(unmarshalStart)
				log.Printf("Cache HIT - returning post list from Redis (key=%s) [cache_get=%v, unmarshal=%v, total=%v]",
					cacheKey, cacheGetTime, unmarshalTime, time.Since(cacheStart))
				return cachedResult.Posts, cachedResult.Total, nil
			}
		}
	}

	// Cache MISS - load from DB
	log.Printf("Cache MISS - loading post list from DB")
	posts, total, err := s.repo.List(ctx, filter, false)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]*PostListItemResponse, len(posts))
	for i, post := range posts {
		responses[i] = ToPostListItemResponse(post)
	}

	// Cache the result
	s.cachePostList(ctx, filter, responses, total)

	return responses, total, nil
}

// buildListCacheKey creates a unique cache key based on filter parameters
func (s *service) buildListCacheKey(filter PostFilter) string {
	key := fmt.Sprintf("post:list:limit:%d:offset:%d:sort:%s:%s",
		filter.Limit, filter.Offset, filter.SortBy, filter.SortOrder)

	if filter.Status != nil {
		key += fmt.Sprintf(":status:%s", *filter.Status)
	}
	if filter.CategoryID != nil {
		key += fmt.Sprintf(":cat:%d", *filter.CategoryID)
	}
	if filter.SubCategoryID != nil {
		key += fmt.Sprintf(":subcat:%d", *filter.SubCategoryID)
	}
	if filter.IsFeatured != nil {
		key += fmt.Sprintf(":featured:%t", *filter.IsFeatured)
	}
	if filter.IsPinned != nil {
		key += fmt.Sprintf(":pinned:%t", *filter.IsPinned)
	}
	if filter.IsPublic != nil {
		key += fmt.Sprintf(":public:%t", *filter.IsPublic)
	}
	if filter.Search != nil && *filter.Search != "" {
		key += fmt.Sprintf(":search:%s", *filter.Search)
	}

	return key
}

// cachePostList caches the list result
func (s *service) cachePostList(ctx context.Context, filter PostFilter, posts []*PostListItemResponse, total int64) {
	if s.cache == nil {
		return
	}

	cacheKey := s.buildListCacheKey(filter)
	result := struct {
		Posts []*PostListItemResponse `json:"posts"`
		Total int64                   `json:"total"`
	}{
		Posts: posts,
		Total: total,
	}

	data, err := json.Marshal(result)
	if err != nil {
		log.Printf("Failed to marshal post list for cache: %v", err)
		return
	}

	// Cache list results for 5 minutes (shorter TTL than individual posts)
	if err := s.cache.Set(ctx, cacheKey, data, 5*time.Minute); err != nil {
		log.Printf("Failed to cache post list: %v", err)
	}
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

	// Update cache with fresh post data
	s.cachePost(ctx, post)

	// Invalidate list caches (since post data changed)
	s.invalidateListCaches(ctx)

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

	if err := s.repo.Update(ctx, post); err != nil {
		return err
	}

	// Update cache with fresh post data
	s.cachePost(ctx, post)

	// Invalidate list caches
	s.invalidateListCaches(ctx)

	return nil
}

func (s *service) UnpublishPost(ctx context.Context, id uint, userID uint) error {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	post.Status = domain.StatusDraft
	post.UpdatedBy = userID

	if err := s.repo.Update(ctx, post); err != nil {
		return err
	}

	// Update cache with fresh post data
	s.cachePost(ctx, post)

	// Invalidate list caches
	s.invalidateListCaches(ctx)

	return nil
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

	if err := s.repo.Update(ctx, post); err != nil {
		return err
	}

	// Update cache with fresh post data
	s.cachePost(ctx, post)

	// Invalidate list caches
	s.invalidateListCaches(ctx)

	return nil
}

func (s *service) RestorePost(ctx context.Context, id uint, userID uint) error {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	post.Status = domain.StatusDraft
	post.ArchivedAt = nil
	post.UpdatedBy = userID

	if err := s.repo.Update(ctx, post); err != nil {
		return err
	}

	// Update cache with fresh post data
	s.cachePost(ctx, post)

	// Invalidate list caches
	s.invalidateListCaches(ctx)

	return nil
}

func (s *service) DeletePost(ctx context.Context, id uint) error {
	// Get post before deletion for cache invalidation
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := s.repo.Delete(ctx, id); err != nil {
		return err
	}

	// Invalidate cache
	s.invalidatePostCache(ctx, post)
	s.invalidateListCaches(ctx)

	return nil
}

func (s *service) HardDeletePost(ctx context.Context, id uint) error {
	// Get post before deletion for cache invalidation
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := s.repo.HardDelete(ctx, id); err != nil {
		return err
	}

	// Invalidate cache
	s.invalidatePostCache(ctx, post)
	s.invalidateListCaches(ctx)

	return nil
}

func (s *service) createVersion(ctx context.Context, post *domain.Post, userID uint, changeNote string) error {
	version := &domain.PostVersion{
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

	// Invalidate list caches to show new posts immediately
	s.invalidateListCaches(ctx)

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

	if err := s.repo.BatchDeleteByUUIDs(ctx, ids); err != nil {
		return err
	}

	// Invalidate list caches after batch deletion
	s.invalidateListCaches(ctx)

	return nil
}

func (s *service) cachePost(ctx context.Context, post *domain.Post) {
	if s.cache == nil || post == nil {
		return
	}

	data, err := json.Marshal(post)
	if err != nil {
		log.Printf("Failed to marshal post for cache: %v", err)
		return
	}

	// Cache by ID
	idKey := fmt.Sprintf("post:id:%d", post.ID)
	if err := s.cache.Set(ctx, idKey, data, 24*time.Hour); err != nil {
		log.Printf("Failed to cache post by ID: %v", err)
	}

	// Cache by slug
	if post.Slug != "" {
		slugKey := fmt.Sprintf("post:slug:%s", post.Slug)
		if err := s.cache.Set(ctx, slugKey, data, 24*time.Hour); err != nil {
			log.Printf("Failed to cache post by slug: %v", err)
		}
	}
}
