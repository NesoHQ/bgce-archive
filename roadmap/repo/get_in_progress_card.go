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

func (r *RoadmapRepository) GetInProgressCard(ctx context.Context, cardID string) (domain.InProgressCard, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	var result struct {
		InProgressCards []domain.InProgressCard `bson:"inProgressCards"`
	}

	err := r.db.Collection("roadmap").FindOne(
		ctx,
		bson.M{"inProgressCards._id": cardID},
		options.FindOne().SetProjection(bson.M{
			"inProgressCards": bson.M{"$elemMatch": bson.M{"_id": cardID}},
		}),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return domain.InProgressCard{}, roadmap.ErrCardNotFound
		}
		return domain.InProgressCard{}, err
	}

	if len(result.InProgressCards) == 0 {
		return domain.InProgressCard{}, roadmap.ErrCardNotFound
	}

	return result.InProgressCards[0], nil
}
