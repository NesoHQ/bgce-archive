package category

import (
	"context"
	"log/slog"
	"time"

	"cortex/logger"
)

// WarmCache pre-loads frequently accessed categories into cache
func (s *service) WarmCache(ctx context.Context) error {
	slog.InfoContext(ctx, "Warming category cache...")

	// Warm approved categories list
	approvedStatus := "approved"
	filter := GetCategoryFilter{
		Status: &approvedStatus,
	}

	categories, err := s.GetCategoryList(ctx, filter)
	if err != nil {
		slog.ErrorContext(ctx, "Failed to warm category cache", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		return err
	}

	slog.InfoContext(ctx, "Category cache warmed successfully", logger.Extra(map[string]any{
		"count": len(categories),
	}))

	return nil
}

// StartCacheWarmer starts a background goroutine to periodically warm the cache
func (s *service) StartCacheWarmer(ctx context.Context, interval time.Duration) {
	go func() {
		// Initial warm
		if err := s.WarmCache(ctx); err != nil {
			slog.ErrorContext(ctx, "Initial cache warming failed", logger.Extra(map[string]any{
				"error": err.Error(),
			}))
		}

		// Periodic warming
		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				slog.InfoContext(ctx, "Cache warmer stopped")
				return
			case <-ticker.C:
				if err := s.WarmCache(ctx); err != nil {
					slog.ErrorContext(ctx, "Periodic cache warming failed", logger.Extra(map[string]any{
						"error": err.Error(),
					}))
				}
			}
		}
	}()
}
