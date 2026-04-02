package repo

import (
	"context"
	"time"

	"roadmap/domain"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) MoveCardToCompleted(ctx context.Context, cardID string, completedCard domain.CompletedCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	_, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{
			"$or": []bson.M{
				{"inProgressCards._id": cardID},
				{"plannedCards._id": cardID},
			},
		},
		bson.M{
			"$pull": bson.M{
				"inProgressCards": bson.M{"_id": cardID},
				"plannedCards":    bson.M{"_id": cardID},
			},
			"$push": bson.M{"completedCards": completedCard},
		},
	)

	return err
}
