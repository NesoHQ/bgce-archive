package domain

import "time"

type PlannedCard struct {
	ID        string    `json:"id" bson:"_id"`
	Title     string    `json:"title" bson:"title"`
	Items     []string  `json:"items" bson:"items"`
	PlannedAt Period    `json:"plannedAt" bson:"plannedAt"`
	CreatedBy int64     `json:"createdBy" bson:"createdBy"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedBy int64     `json:"updatedBy" bson:"updatedBy"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}
