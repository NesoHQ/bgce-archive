package discussion

// NewService creates a new discussion service with injected dependencies
func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}
