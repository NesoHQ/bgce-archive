package repo

import (
	"context"
	"time"

	"roadmap/domain"
	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (r *RoadmapRepository) GetPlannedCard(ctx context.Context, cardID string) (domain.PlannedCard, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	var result struct {
		PlannedCards []domain.PlannedCard `bson:"plannedCards"`
	}

	err := r.db.Collection("roadmap").FindOne(
		ctx,
		bson.M{"plannedCards._id": cardID},
		options.FindOne().SetProjection(bson.M{
			"plannedCards": bson.M{"$elemMatch": bson.M{"_id": cardID}},
		}),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return domain.PlannedCard{}, roadmap.ErrCardNotFound
		}
		return domain.PlannedCard{}, err
	}

	if len(result.PlannedCards) == 0 {
		return domain.PlannedCard{}, roadmap.ErrCardNotFound
	}

	return result.PlannedCards[0], nil
}
