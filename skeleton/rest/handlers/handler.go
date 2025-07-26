package handlers

import (
	"net/http"

	template "servicetemplate/category"
	"servicetemplate/config"
)

type Handlers struct {
	cnf       *config.Config
	ccCordSvc template.Service
}

func NewHandler(
	cnf *config.Config,
	ccCordSvc template.Service,
) *Handlers {
	return &Handlers{
		cnf:       cnf,
		ccCordSvc: ccCordSvc,
	}
}

func (h *Handlers) GetCategoryByID(w http.ResponseWriter, r *http.Request) {}
func (h *Handlers) UpdateCategory(w http.ResponseWriter, r *http.Request)  {}
func (h *Handlers) DeleteCategory(w http.ResponseWriter, r *http.Request)  {}

func (h *Handlers) CreateSubCategory(w http.ResponseWriter, r *http.Request)  {}
func (h *Handlers) GetSubCategoryList(w http.ResponseWriter, r *http.Request) {}
func (h *Handlers) GetSubCategoryByID(w http.ResponseWriter, r *http.Request) {}
func (h *Handlers) UpdateSubCategory(w http.ResponseWriter, r *http.Request)  {}
func (h *Handlers) DeleteSubCategory(w http.ResponseWriter, r *http.Request)  {}
