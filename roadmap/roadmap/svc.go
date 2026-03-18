package roadmap

func NewService(repo Repository) Service {
	return &service{repo: repo}
}
