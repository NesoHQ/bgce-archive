package util

import (
	"bufio"
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"strings"

	"postal/domain"
)

func ParseAndValidateCSV(
	file multipart.File,
	userID uint,
) ([]domain.Post, error) {
	reader := csv.NewReader(bufio.NewReader(file))
	reader.TrimLeadingSpace = true

	// Read header
	if _, err := reader.Read(); err != nil {
		return nil, errors.New("invalid CSV header")
	}

	slugSet := make(map[string]bool)
	var posts []domain.Post

	for {
		row, err := reader.Read()

		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		if len(row) < 14 {
			return nil, fmt.Errorf("invalid CSV format: expected at least 14 columns, got %d", len(row))
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
		isPublicStr := strings.TrimSpace(row[11])
		isFeaturedStr := strings.TrimSpace(row[12])
		isPinnedStr := strings.TrimSpace(row[13])

		// Set defaults
		isPublic := true
		if isPublicStr != "" {
			isPublic = strings.ToLower(isPublicStr) == "true"
		}

		isFeatured := false
		if isFeaturedStr != "" {
			isFeatured = strings.ToLower(isFeaturedStr) == "true"
		}

		isPinned := false
		if isPinnedStr != "" {
			isPinned = strings.ToLower(isPinnedStr) == "true"
		}

		if title == "" {
			return nil, errors.New("title is required")
		}

		if slug == "" {
			slug = GenerateSlug(title)
		} else {
			slug = SanitizeSlug(slug)
		}

		if slugSet[slug] {
			return nil, errors.New("duplicate slug in CSV: " + slug)
		}
		slugSet[slug] = true

		categoryID, err := strconv.ParseUint(categoryIDStr, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid category ID: %s", categoryIDStr)
		}
		subCategoryID, err := strconv.ParseUint(subCategoryIDStr, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid sub-category ID: %s", subCategoryIDStr)
		}

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

	return posts, nil
}
