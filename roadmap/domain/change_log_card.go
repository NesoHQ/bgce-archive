package domain

import "time"

type ChangeLogCard struct {
	ID          string    `json:"id" bson:"_id"`
	Title       string    `json:"title" bson:"title"`
	Items       []string  `json:"items" bson:"items"`
	CompletedAt time.Time `json:"completedAt" bson:"completedAt"`
	CreatedBy   int64     `json:"createdBy" bson:"createdBy"`
	CreatedAt   time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedBy   int64     `json:"updatedBy" bson:"updatedBy"`
	UpdatedAt   time.Time `json:"updatedAt" bson:"updatedAt"`
}
