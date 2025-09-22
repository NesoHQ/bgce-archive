package handlers

import (
	"net/http"

	"cortex/category"
	"cortex/config"
)

type Handlers struct {
	cnf             *config.Config
	CategoryService category.Service
}

func NewHandler(
	cnf *config.Config,
	ctgrySvc category.Service,
) *Handlers {
	return &Handlers{
		cnf:             cnf,
		CategoryService: ctgrySvc,
	}
}

func (h *Handlers) CreateSubCategory(w http.ResponseWriter, r *http.Request)  {}
func (h *Handlers) GetSubCategoryList(w http.ResponseWriter, r *http.Request) {}
func (h *Handlers) GetSubCategoryByID(w http.ResponseWriter, r *http.Request) {}
func (h *Handlers) UpdateSubCategory(w http.ResponseWriter, r *http.Request)  {}
func (h *Handlers) DeleteSubCategory(w http.ResponseWriter, r *http.Request)  {}

type SuccessResponse struct {
	Message string      `json:"message"`
	Status  int         `json:"status"`
	Data    interface{} `json:"data"`
}
