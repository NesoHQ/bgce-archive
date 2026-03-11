// @d:\Codes\bgce-archive\axon\rest\swagger\serve-swagger.go
package swagger

import (
	"embed"
	"mime"
	"net/http"
	"path"
	"strings"

	"github.com/go-chi/chi/v5"
)

//go:embed dist/*
var distFS embed.FS

//go:embed swagger.json
var swaggerFS embed.FS

func serveSwagger(w http.ResponseWriter, r *http.Request) {
	filePath := chi.URLParam(r, "path")

	// if file path not specified serve index file
	if filePath == "" || filePath == "/" {
		filePath = "index.html"
	}

	// for swagger json file
	if strings.HasSuffix(filePath, "swagger.json") {
		data, err := swaggerFS.ReadFile("swagger.json")
		if err != nil {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(data)
		return
	}

	// for static dist files
	data, err := distFS.ReadFile(path.Join("dist", filePath))
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	ext := path.Ext(filePath)
	mimeType := mime.TypeByExtension(ext)
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}
	w.Header().Add("Content-Type", mimeType)
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// SetupSwagger registers swagger routes
func SetupSwagger(r chi.Router) {
	r.Get("/swagger/{path}", serveSwagger)
	r.Get("/swagger", serveSwagger)
}