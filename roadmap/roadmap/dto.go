package roadmap

type AddPlannedCardRequest struct {
	Title string   `json:"title"`
	Items []string `json:"items"`
}
