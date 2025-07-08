package classnotes

import (
	"fmt"
	"net/http"
)

func ClassnotesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Showing all Class Notes")
}

func GetClassnoteByID(w http.ResponseWriter, r *http.Request) {
	noteID := r.PathValue("id")

	fmt.Fprintf(w, "Showing class note %v\n", noteID)
}

func PostNewClassnote(w http.ResponseWriter, r *http.Request) {
	// TODO: Parse request body and save to DB

	fmt.Fprintf(w, "Classnote Added")
}
