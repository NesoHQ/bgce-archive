package repo

import (
	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/mongo"
)

type RoadmapRepository struct {
	db *mongo.Database
}

func NewRoadmapRepository(db *mongo.Database) roadmap.Repository {
	return &RoadmapRepository{db: db}
}
