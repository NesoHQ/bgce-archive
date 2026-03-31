package roadmap

import "roadmap/domain"

type AddPlannedCardRequest struct {
	Title string   `json:"title"`
	Items []string `json:"items"`
}

type PaginationMeta struct {
	Total           int  `json:"total"`
	Page            int  `json:"page"`
	Limit           int  `json:"limit"`
	TotalPages      int  `json:"totalPages"`
	HasNextPage     bool `json:"hasNextPage"`
	HasPreviousPage bool `json:"hasPreviousPage"`
	NextPage        *int `json:"nextPage"`
	PrevPage        *int `json:"prevPage"`
}

type GetPlannedCardsResponse struct {
	Success    bool                 `json:"success"`
	Message    string               `json:"message"`
	Data       []domain.PlannedCard `json:"data"`
	Pagination PaginationMeta       `json:"pagination"`
}

type GetInProgressCardsResponse struct {
	Success    bool                    `json:"success"`
	Message    string                  `json:"message"`
	Data       []domain.InProgressCard `json:"data"`
	Pagination PaginationMeta          `json:"pagination"`
}

type GetCompletedCardsResponse struct {
	Success    bool                   `json:"success"`
	Message    string                 `json:"message"`
	Data       []domain.CompletedCard `json:"data"`
	Pagination PaginationMeta         `json:"pagination"`
}

type AddCardResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type MoveCardResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type UpdateCardResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type DeleteCardResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type UpdateInProgressCardRequest struct {
	Title                string   `json:"title"`
	Items                []string `json:"items"`
	CompletionPercentage float64  `json:"completionPercentage"`
}

type UpdateCompletedCardRequest struct {
	Title string   `json:"title"`
	Items []string `json:"items"`
}

type CreateChangeLogRequest struct {
	Title string   `json:"title"`
	Items []string `json:"items"`
	Month string   `json:"month"`
	Year  int64    `json:"year"`
}

type GetChangeLogsResponse struct {
	Success    bool                   `json:"success"`
	Message    string                 `json:"message"`
	Data       []domain.ChangeLogCard `json:"data"`
	Pagination PaginationMeta         `json:"pagination"`
}
