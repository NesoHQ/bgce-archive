package post

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"
)

// buildBaseCacheKey creates a cache key WITHOUT pagination params
// This allows us to cache the full result set once
func (s *service) buildBaseCacheKey(filter PostFilter) string {
	key := "post:list:sort:" + filter.SortBy + ":" + filter.SortOrder

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

// tryGetFromFullCache attempts to get results from a cached full result set
// Returns nil if cache miss or if we need to fetch from DB
func (s *service) tryGetFromFullCache(ctx context.Context, filter PostFilter) ([]*PostListItemResponse, int64, bool) {
	if s.cache == nil {
		return nil, 0, false
	}

	// For searches or very specific filters, use per-page caching
	if filter.Search != nil && *filter.Search != "" {
		return nil, 0, false
	}

	// Build base key without pagination
	baseKey := s.buildBaseCacheKey(filter)

	// Try to get full cached result
	cached, err := s.cache.Get(ctx, baseKey)
	if err != nil || cached == "" {
		return nil, 0, false
	}

	var fullResult struct {
		Posts []*PostListItemResponse `json:"posts"`
		Total int64                   `json:"total"`
	}

	if err := json.Unmarshal([]byte(cached), &fullResult); err != nil {
		return nil, 0, false
	}

	// Slice the cached result based on pagination
	start := filter.Offset
	end := filter.Offset + filter.Limit

	if start >= len(fullResult.Posts) {
		// Offset beyond available data
		return []*PostListItemResponse{}, fullResult.Total, true
	}

	if end > len(fullResult.Posts) {
		end = len(fullResult.Posts)
	}

	slicedPosts := fullResult.Posts[start:end]

	log.Printf("Cache HIT (sliced) - returning posts %d-%d from cached set of %d (key=%s)",
		start, end, len(fullResult.Posts), baseKey)

	return slicedPosts, fullResult.Total, true
}

// cacheFullResultSet caches the FULL result set (up to a reasonable limit)
// This allows pagination to work from cache
func (s *service) cacheFullResultSet(ctx context.Context, filter PostFilter, posts []*PostListItemResponse, total int64) {
	if s.cache == nil {
		return
	}

	// Don't cache search results or very large result sets
	if filter.Search != nil && *filter.Search != "" {
		return
	}

	// Only cache if we have the full set (or a reasonable subset)
	// This prevents caching partial results
	if filter.Offset > 0 {
		return // Don't cache paginated requests
	}

	// Build base key without pagination
	baseKey := s.buildBaseCacheKey(filter)

	// Fetch more results to cache (up to 100 posts)
	maxCacheSize := 100
	if filter.Limit < maxCacheSize {
		// Fetch full set for caching
		fullFilter := filter
		fullFilter.Limit = maxCacheSize
		fullFilter.Offset = 0

		fullPosts, fullTotal, err := s.repo.List(ctx, fullFilter, false)
		if err == nil {
			fullResponses := make([]*PostListItemResponse, len(fullPosts))
			for i, post := range fullPosts {
				fullResponses[i] = ToPostListItemResponse(post)
			}

			result := struct {
				Posts []*PostListItemResponse `json:"posts"`
				Total int64                   `json:"total"`
			}{
				Posts: fullResponses,
				Total: fullTotal,
			}

			data, err := json.Marshal(result)
			if err == nil {
				// Cache for 10 minutes
				if err := s.cache.Set(ctx, baseKey, data, 10*time.Minute); err != nil {
					log.Printf("Failed to cache full post list: %v", err)
				} else {
					log.Printf("Cached full result set: %d posts (key=%s)", len(fullResponses), baseKey)
				}
			}
		}
	}
}
