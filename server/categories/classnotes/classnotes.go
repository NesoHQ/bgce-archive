package classnotes

import (
	"fmt"
	"net/http"
)

func ClassnotesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Showing all Class Notes")
}

func GetClassNote(w http.ResponseWriter, r *http.Request) {
	noteID := r.PathValue("noteID")

	fmt.Fprintf(w, "Showing class note %v\n", noteID)
}

func PostClassNote(w http.ResponseWriter, r *http.Request) {
	// read from r.body and add classnote to database

	fmt.Fprintf(w, "Classnote Added")
}
