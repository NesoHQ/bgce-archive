package handlers

import (
	"net/http"

	cortex "cortex/category"
	"cortex/config"
)

type Handlers struct {
	cnf       *config.Config
	ccCordSvc cortex.Service
}

func NewHandler(
	cnf *config.Config,
	ccCordSvc cortex.Service,
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
