package domain

import "time"

type ChangeLogCard struct {
	ID        string    `json:"id" bson:"_id"`
	Title     string    `json:"title" bson:"title"`
	Items     []string  `json:"items" bson:"items"`
	Month     string    `json:"month" bson:"month"`
	Year      int64     `json:"year" bson:"year"`
	CreatedBy int64     `json:"createdBy" bson:"createdBy"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedBy int64     `json:"updatedBy" bson:"updatedBy"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}
