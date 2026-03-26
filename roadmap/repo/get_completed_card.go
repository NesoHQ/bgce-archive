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

func (r *RoadmapRepository) GetCompletedCard(ctx context.Context, cardID string) (domain.CompletedCard, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	var result struct {
		CompletedCards []domain.CompletedCard `bson:"completedCards"`
	}

	err := r.db.Collection("roadmap").FindOne(
		ctx,
		bson.M{"completedCards._id": cardID},
		options.FindOne().SetProjection(bson.M{
			"completedCards": bson.M{"$elemMatch": bson.M{"_id": cardID}},
		}),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return domain.CompletedCard{}, roadmap.ErrCardNotFound
		}
		return domain.CompletedCard{}, err
	}

	if len(result.CompletedCards) == 0 {
		return domain.CompletedCard{}, roadmap.ErrCardNotFound
	}

	return result.CompletedCards[0], nil
}
