package handlers

import (
	"community/comment"
	"community/discussion"
	"community/rest/utils"
)

type Handlers struct {
	CommentService    comment.Service
	DiscussionService discussion.Service
	Validator         *utils.Validator
}

func NewHandlers(commentService comment.Service, discussionService discussion.Service, validator *utils.Validator) *Handlers {
	return &Handlers{
		CommentService:    commentService,
		DiscussionService: discussionService,
		Validator:         validator,
	}
}

type SuccessResponse struct {
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type ErrorResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

type PaginatedResponse struct {
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Meta    MetaData    `json:"meta"`
}

type MetaData struct {
	Total  int64 `json:"total"`
	Limit  int   `json:"limit"`
	Offset int   `json:"offset"`
}
