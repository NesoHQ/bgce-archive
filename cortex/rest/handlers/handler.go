package handlers

import (
	"net/http"

	"cortex/category"
	"cortex/config"
	"cortex/subcategory"
	"cortex/tenant"
	"cortex/user"
)

type Handlers struct {
	cnf                *config.Config
	CategoryService    category.Service
	SubcategoryService subcategory.Service
	TenantService      tenant.Service
	userService        *user.Service
}

func NewHandler(
	cnf *config.Config,
	ctgrySvc category.Service,
	subcategorySvc subcategory.Service,
	tenantSvc tenant.Service,
	userSvc *user.Service,
) *Handlers {
	return &Handlers{
		cnf:                cnf,
		CategoryService:    ctgrySvc,
		SubcategoryService: subcategorySvc,
		TenantService:      tenantSvc,
		userService:        userSvc,
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
	Status  bool        `json:"status"`
	Data    interface{} `json:"data"`
}
