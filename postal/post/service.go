package post

import (
	"bufio"
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"strings"
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
	BatchUploadPosts(ctx context.Context, userID uint, file multipart.File) ([]Post, error)
}

type service struct {
	repo        Repository
	versionRepo post_version.Repository
}

type SlugRow struct {
	Slug string
	Row  int
}

func NewService(repo Repository, versionRepo post_version.Repository) Service {
	return &service{
		repo:        repo,
		versionRepo: versionRepo,
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

	// Create initial version
	if err := s.createVersion(ctx, post, userID, "Initial version"); err != nil {
		// Log error but don't fail the request
		fmt.Printf("Failed to create version: %v\n", err)
	}

	return ToPostResponse(post), nil
}

func (s *service) GetPostByID(ctx context.Context, id uint) (*PostResponse, error) {
	post, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
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
	post, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
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

func (s *service) BatchUploadPosts(ctx context.Context, userID uint, file multipart.File) ([]Post, error) {
	posts, slugRows, err := ParseAndValidateCSV(file, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to parse CSV: %w", err)
	}

	// collect slugs for uniqueness check
	slags := make([]string, 0, len(slugRows))
	for _, sr := range slugRows {
		slags = append(slags, sr.Slug)
	}

	// check in DB
	existing, err := s.repo.FindExistingSlugs(ctx, slags)
	if err != nil {
		return nil, err
	}

	for _, sr := range slugRows {
		if existing[sr.Slug] {
			return nil, fmt.Errorf("row %d: slug '%s' already exists in database", sr.Row, sr.Slug)
		}
	}

	if err := s.repo.BatchCreate(ctx, posts); err != nil {
		return nil, err
	}

	return posts, nil
}

func ParseAndValidateCSV(
	file multipart.File,
	userID uint,
) ([]Post, []SlugRow, error) {
	reader := csv.NewReader(bufio.NewReader(file))
	reader.TrimLeadingSpace = true

	// Read header
	if _, err := reader.Read(); err != nil {
		return nil, nil, fmt.Errorf("invalid CSV header: %w", err)
	}

	var (
		posts    []Post
		slugRows []SlugRow
		slugSet  = make(map[string]bool)
		rowNo    = 1
	)

	for {
		rowNo++
		row, err := reader.Read()

		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, nil, err
		}

		if len(row) < 14 {
			return nil, nil, fmt.Errorf("invalid CSV format: expected at least 14 columns, got %d , in row %d", len(row), rowNo)
		}

		// Validate all required fields
		fields := []string{
			"title", "slug", "content", "summary", "thumbnail",
			"category_id", "sub_category_id", "meta_title", "meta_description",
			"keywords", "og_image", "is_public", "is_featured", "is_pinned",
		}
		for i, name := range fields {
			if strings.TrimSpace(row[i]) == "" {
				return nil, nil, fmt.Errorf("row %d: %s is required", rowNo, name)
			}
		}

		title := strings.TrimSpace(row[0])
		slug := strings.TrimSpace(row[1])
		content := strings.TrimSpace(row[2])
		summary := strings.TrimSpace(row[3])
		thumbnail := strings.TrimSpace(row[4])
		categoryIDStr := strings.TrimSpace(row[5])
		subCategoryIDStr := strings.TrimSpace(row[6])
		metaTitle := strings.TrimSpace(row[7])
		metaDescription := strings.TrimSpace(row[8])
		keywords := strings.TrimSpace(row[9])
		ogImage := strings.TrimSpace(row[10])
		isPublic, err := parseBoolStrict(row[11], "is_public", rowNo)
		if err != nil {
			return nil, nil, err
		}

		isFeatured, err := parseBoolStrict(row[12], "is_featured", rowNo)
		if err != nil {
			return nil, nil, err
		}

		isPinned, err := parseBoolStrict(row[13], "is_pinned", rowNo)
		if err != nil {
			return nil, nil, err
		}

		// category and sub-category IDs
		categoryID, err := strconv.ParseUint(categoryIDStr, 10, 64)
		if err != nil {
			return nil, nil, fmt.Errorf("row %d: invalid category_id '%s'", rowNo, categoryIDStr)
		}
		subCategoryID, err := strconv.ParseUint(subCategoryIDStr, 10, 64)
		if err != nil {
			return nil, nil, fmt.Errorf("row %d: invalid sub_category_id '%s'", rowNo, subCategoryIDStr)
		}

		if slug == "" {
			slug = util.GenerateSlug(title)
		} else {
			slug = util.SanitizeSlug(slug)
		}

		if slugSet[slug] {
			return nil, nil, fmt.Errorf("row %d: duplicate slug '%s'", rowNo, slug)
		}
		slugSet[slug] = true

		slugRows = append(slugRows, SlugRow{
			Slug: slug,
			Row:  rowNo,
		})


		

		subCategoryIDUint := uint(subCategoryID)
		posts = append(posts, Post{
			Title:           title,
			Slug:            slug,
			Summary:         summary,
			Content:         content,
			Thumbnail:       thumbnail,
			CategoryID:      uint(categoryID),
			SubCategoryID:   &subCategoryIDUint,
			MetaTitle:       metaTitle,
			MetaDescription: metaDescription,
			Keywords:        keywords,
			OGImage:         ogImage,
			Status:          StatusDraft,
			IsPublic:        isPublic,
			IsFeatured:      isFeatured,
			IsPinned:        isPinned,
			CreatedBy:       userID,
			Version:         1,
		})
	}

	return posts, slugRows, nil
}

func parseBoolStrict(value string, field string, row int) (bool, error) {
	v := strings.ToLower(strings.TrimSpace(value))

	switch v {
	case "true":
		return true, nil
	case "false":
		return false, nil
	default:
		return false, fmt.Errorf(
			"row %d: %s must be 'true' or 'false', got '%s'",
			row, field, value,
		)
	}
}
