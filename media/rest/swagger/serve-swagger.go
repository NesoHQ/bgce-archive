package swagger

import (
	"embed"
	"mime"
	"net/http"
	"path"
	"strings"

	"media/config"
	"media/rest/middlewares"
	"media/rest/utils"
)

//go:embed dist/*
var distFS embed.FS

//go:embed swagger.yaml
var swaggerFS embed.FS

func serveSwagger(w http.ResponseWriter, r *http.Request) {
	filePath := r.PathValue("path")

	// if file path not specified serve index file
	if filePath == "" || filePath == "/" {
		filePath = "index.html"
	}

	// for swagger yaml file
	if strings.HasSuffix(filePath, "swagger.yaml") || strings.HasSuffix(filePath, "swagger.yml") {
		data, err := swaggerFS.ReadFile("swagger.yaml")
		if err != nil {
			utils.SendError(w, http.StatusNotFound, "File not found", nil)
			return
		}
		w.Header().Add("Content-Type", "application/x-yaml")
		w.WriteHeader(http.StatusOK)
		w.Write(data)
		return
	}

	// for swagger json file (legacy support)
	if strings.HasSuffix(filePath, "swagger.json") {
		data, err := swaggerFS.ReadFile("swagger.yaml")
		if err != nil {
			utils.SendError(w, http.StatusNotFound, "File not found", nil)
			return
		}
		w.Header().Add("Content-Type", "application/x-yaml")
		w.WriteHeader(http.StatusOK)
		w.Write(data)
		return
	}

	// for static dist files
	data, err := distFS.ReadFile(path.Join("dist", filePath))
	if err != nil {
		utils.SendError(w, http.StatusNotFound, "File not found", nil)
		return
	}
	ext := path.Ext(filePath)
	mime := mime.TypeByExtension(ext)
	w.Header().Add("Content-Type", mime)
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func SetupSwagger(mux *http.ServeMux, manager *middlewares.Manager) {
	conf := config.GetConfig()

	if conf.Mode == config.ReleaseMode {
		return
	}

	mux.Handle("GET /swagger/{path...}",
		manager.With(
			http.HandlerFunc(serveSwagger),
		),
	)
}
