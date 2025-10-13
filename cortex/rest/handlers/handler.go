package handlers

import (
	"net/http"

	"cortex/category"
	"cortex/config"
	"cortex/subcategory"
)

type Handlers struct {
	cnf                 *config.Config
	CategoryService     category.Service
	SubcategoryService  subcategory.Service
}

func NewHandler(
	cnf *config.Config,
	ctgrySvc category.Service,
	subcategorySvc subcategory.Service,
) *Handlers {
	return &Handlers{
		cnf:                cnf,
		CategoryService:    ctgrySvc,
		SubcategoryService: subcategorySvc,
	}
}

func (h *Handlers) CreateSubCategory(w http.ResponseWriter, r *http.Request) {
	h.CreateSubcategory(w, r)
}
func (h *Handlers) Hello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, World!"))
}

type SuccessResponse struct {
	Message string      `json:"message"`
	Status  int         `json:"status"`
	Data    interface{} `json:"data"`
}
