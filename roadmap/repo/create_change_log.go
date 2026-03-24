package repo

import (
	"context"
	"time"

	"roadmap/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (r *RoadmapRepository) CreateChangeLog(ctx context.Context, card domain.ChangeLogCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	_, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{},
		bson.M{"$push": bson.M{"changeLogCards": card}},
		options.Update().SetUpsert(true),
	)
	return err
}
