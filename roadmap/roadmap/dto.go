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

type MoveCardToCompletedResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
