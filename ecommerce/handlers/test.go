package handlers
import (
	"net/http"
	"log"
)


func Test(w http.ResponseWriter, r *http.Request) {
	log.Println("ami handler: middle e print hobo")
}

