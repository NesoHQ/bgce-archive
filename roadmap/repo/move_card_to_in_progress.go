package repo

import (
	"context"
	"time"

	"roadmap/domain"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) MoveCardToInProgress(ctx context.Context, cardID string, inProgressCard domain.InProgressCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	_, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{
			"$or": []bson.M{
				{"plannedCards._id": cardID},
				{"completedCards._id": cardID},
			},
		},
		bson.M{
			"$pull": bson.M{
				"plannedCards":   bson.M{"_id": cardID},
				"completedCards": bson.M{"_id": cardID},
			},
			"$push": bson.M{"inProgressCards": inProgressCard},
		},
	)

	return err
}
