package utils

import (
	"strings"
)

// ExtractIDFromPath extracts the ID from paths like /api/v1/posts/123 or /api/v1/posts/123/publish
func ExtractIDFromPath(path string) string {
	// Remove trailing slash if present
	path = strings.TrimSuffix(path, "/")

	// Split by /
	parts := strings.Split(path, "/")

	// For /api/v1/posts/123 -> parts[4] is the ID
	// For /api/v1/posts/123/publish -> parts[4] is the ID
	if len(parts) >= 5 {
		return parts[4]
	}

	return ""
}

// ExtractSlugFromPath extracts the slug from paths like /api/v1/posts/slug/my-post
func ExtractSlugFromPath(path string) string {
	// Remove trailing slash if present
	path = strings.TrimSuffix(path, "/")

	// Split by /
	parts := strings.Split(path, "/")

	// For /api/v1/posts/slug/my-post -> parts[5] is the slug
	if len(parts) >= 6 && parts[4] == "slug" {
		return parts[5]
	}

	return ""
}

// ExtractUUIDFromPath extracts the UUID from paths like /api/v1/posts/uuid/some-uuid
func ExtractUUIDFromPath(path string) string {
	// Remove trailing slash if present
	path = strings.TrimSuffix(path, "/")

	// Split by /
	parts := strings.Split(path, "/")

	// For /api/v1/posts/uuid/some-uuid -> parts[5] is the uuid
	if len(parts) >= 6 && parts[4] == "uuid" {
		return parts[5]
	}

	return ""
}
