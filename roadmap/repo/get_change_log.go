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

func (r *RoadmapRepository) GetChangeLog(ctx context.Context, cardID string) (domain.ChangeLogCard, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	var result struct {
		ChangeLogCards []domain.ChangeLogCard `bson:"changeLogCards"`
	}

	err := r.db.Collection("roadmap").FindOne(
		ctx,
		bson.M{"changeLogCards._id": cardID},
		options.FindOne().SetProjection(bson.M{
			"changeLogCards": bson.M{"$elemMatch": bson.M{"_id": cardID}},
		}),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return domain.ChangeLogCard{}, roadmap.ErrCardNotFound
		}
		return domain.ChangeLogCard{}, err
	}

	if len(result.ChangeLogCards) == 0 {
		return domain.ChangeLogCard{}, roadmap.ErrCardNotFound
	}

	return result.ChangeLogCards[0], nil
}
