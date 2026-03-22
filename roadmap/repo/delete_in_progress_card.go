package repo

import (
	"context"
	"time"

	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) DeleteInProgressCard(ctx context.Context, cardID string) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	result, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{"inProgressCards._id": cardID},
		bson.M{"$pull": bson.M{"inProgressCards": bson.M{"_id": cardID}}},
	)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return roadmap.ErrCardNotFound
	}

	return nil
}
