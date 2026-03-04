package post

import (
	"context"
	"fmt"
	"log"

	"postal/domain"
)

// invalidatePostCache removes cached entries for a specific post
func (s *service) invalidatePostCache(ctx context.Context, post *domain.Post) {
	if s.cache == nil || post == nil {
		return
	}

	// Invalidate by ID
	idKey := fmt.Sprintf("post:id:%d", post.ID)
	if err := s.cache.Del(ctx, idKey); err != nil {
		log.Printf("Failed to invalidate post cache by ID: %v", err)
	}

	// Invalidate by slug
	if post.Slug != "" {
		slugKey := fmt.Sprintf("post:slug:%s", post.Slug)
		if err := s.cache.Del(ctx, slugKey); err != nil {
			log.Printf("Failed to invalidate post cache by slug: %v", err)
		}
	}

	// Invalidate by UUID
	if post.UUID != "" {
		uuidKey := fmt.Sprintf("post:uuid:%s", post.UUID)
		if err := s.cache.Del(ctx, uuidKey); err != nil {
			log.Printf("Failed to invalidate post cache by uuid: %v", err)
		}
	}

	log.Printf("Invalidated cache for post ID=%d, slug=%s, uuid=%s", post.ID, post.Slug, post.UUID)
}

// invalidateListCaches removes all cached list queries
func (s *service) invalidateListCaches(ctx context.Context) {
	if s.cache == nil {
		return
	}

	// Delete all keys matching the pattern "post:list:*"
	if err := s.cache.DelPattern(ctx, "post:list:*"); err != nil {
		log.Printf("Failed to invalidate post list cache: %v", err)
		return
	}

	log.Printf("Post list caches invalidated")
}
