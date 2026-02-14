package handlers

import (
	"postal/post"
	"postal/post_version"
	"postal/rest/utils"
)

type Handlers struct {
	PostService        post.Service
	PostVersionService post_version.Repository
	Validator		   *utils.Validator
}

func NewHandlers(postService post.Service, versionRepo post_version.Repository, validator *utils.Validator) *Handlers {
	return &Handlers{
		PostService:        postService,
		PostVersionService: versionRepo,
		Validator:		   validator,
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
