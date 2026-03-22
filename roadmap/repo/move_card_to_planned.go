package repo

import (
	"context"
	"time"

	"roadmap/domain"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) MoveCardToPlanned(ctx context.Context, cardID string, plannedCard domain.PlannedCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	_, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{
			"$or": []bson.M{
				{"inProgressCards._id": cardID},
				{"completedCards._id": cardID},
			},
		},
		bson.M{
			"$pull": bson.M{
				"inProgressCards": bson.M{"_id": cardID},
				"completedCards":  bson.M{"_id": cardID},
			},
			"$push": bson.M{"plannedCards": plannedCard},
		},
	)

	return err
}
