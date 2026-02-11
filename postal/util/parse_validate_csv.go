package util

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"strings"
	"postal/domain"
)

type SlugRow struct {
	Slug string
	Row  int
}

func ParseAndValidateCSV(
	file *multipart.File,
	userID uint,
) (*[]domain.Post, *[]SlugRow, error) {
	reader := csv.NewReader(bufio.NewReader(*file))
	reader.TrimLeadingSpace = true

	// Read header
	if _, err := reader.Read(); err != nil {
		return nil, nil, fmt.Errorf("invalid CSV header: %w", err)
	}

	var (
		posts    []domain.Post
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
			slug = GenerateSlug(title)
		} else {
			slug = SanitizeSlug(slug)
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
		posts = append(posts, domain.Post{
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
			Status:          domain.StatusDraft,
			IsPublic:        isPublic,
			IsFeatured:      isFeatured,
			IsPinned:        isPinned,
			CreatedBy:       userID,
			Version:         1,
		})
	}

	return &posts, &slugRows, nil
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