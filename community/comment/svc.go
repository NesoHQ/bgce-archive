package comment

// NewService creates a new comment service with injected dependencies
func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}
