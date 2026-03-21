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

type RoadmapRepository struct {
	db *mongo.Database
}

func NewRoadmapRepository(db *mongo.Database) roadmap.Repository {
	return &RoadmapRepository{db: db}
}

func (r *RoadmapRepository) AddPlannedCard(ctx context.Context, card domain.PlannedCard) error {
	// Set a timeout for the database operation
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	_, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{},
		bson.M{"$push": bson.M{"plannedCards": card}},
		options.Update().SetUpsert(true),
	)
	return err
}

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

func (r *RoadmapRepository) MoveCardToInProgress(ctx context.Context, cardID string, inProgressCard domain.InProgressCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	_, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{"plannedCards._id": cardID},
		bson.M{
			"$pull": bson.M{"plannedCards": bson.M{"_id": cardID}},
			"$push": bson.M{"inProgressCards": inProgressCard},
		},
	)

	return err
}
