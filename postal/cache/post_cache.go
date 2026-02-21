package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"postal/domain"

	goRedis "github.com/redis/go-redis/v9"
)

const postCacheKeyPrefix = "postal:post"

type PostCache interface {
	SetPost(ctx context.Context, post *domain.Post) error
	GetByID(ctx context.Context, id uint) (*domain.Post, error)
	GetBySlug(ctx context.Context, slug string) (*domain.Post, error)
}

type postCache struct {
	writeClient goRedis.Cmdable
}

func NewPostCache(writeClient goRedis.Cmdable) PostCache {
	return &postCache{
		writeClient: writeClient,
	}
}

func (c *postCache) SetPost(ctx context.Context, post *domain.Post) error {
	if c == nil || c.writeClient == nil || post == nil {
		return nil
	}

	payload, err := json.Marshal(post)
	if err != nil {
		return fmt.Errorf("failed to marshal post for cache: %w", err)
	}

	if err := c.writeClient.Set(ctx, postIDKey(post.ID), payload, 0).Err(); err != nil {
		return fmt.Errorf("failed to set post cache by id: %w", err)
	}

	if post.Slug != "" {
		if err := c.writeClient.Set(ctx, postSlugKey(post.Slug), payload, 0).Err(); err != nil {
			return fmt.Errorf("failed to set post cache by slug: %w", err)
		}
	}

	return nil
}

func (c *postCache) GetByID(ctx context.Context, id uint) (*domain.Post, error) {
	if c == nil || c.writeClient == nil {
		return nil, nil
	}
	data, err := c.writeClient.Get(ctx, postIDKey(id)).Bytes()
	if err == goRedis.Nil {
		// Cache MISS - key not in Redis
		log.Printf("Cache MISS - key not in Redis (id=%d)", id)
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var post domain.Post
	if err := json.Unmarshal(data, &post); err != nil {
		return nil, fmt.Errorf("failed to unmarshal post from cache: %w", err)
	}
	// Cache HIT - post found in Redis
	log.Printf("Cache HIT - post found in Redis (id=%d)", id)
	return &post, nil
}

func (c *postCache) GetBySlug(ctx context.Context, slug string) (*domain.Post, error) {
	if c == nil || c.writeClient == nil {
		return nil, nil
	}
	data, err := c.writeClient.Get(ctx, postSlugKey(slug)).Bytes()
	if err == goRedis.Nil {
		// Cache MISS - key not in Redis
		log.Printf("Cache MISS - key not in Redis (slug=%s)", slug)
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var post domain.Post
	if err := json.Unmarshal(data, &post); err != nil {
		return nil, fmt.Errorf("failed to unmarshal post from cache: %w", err)
	}
	// Cache HIT - post found in Redis
	log.Printf("Cache HIT - post found in Redis (slug=%s)", slug)
	return &post, nil
}

func postIDKey(id uint) string {
	return fmt.Sprintf("%s:id:%d", postCacheKeyPrefix, id)
}

func postSlugKey(slug string) string {
	return fmt.Sprintf("%s:slug:%s", postCacheKeyPrefix, slug)
}
