package repo

import (
	"context"
	"time"

	"roadmap/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (r *RoadmapRepository) GetPlannedCards(ctx context.Context, page, limit int) ([]domain.PlannedCard, int, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	pipeline := mongo.Pipeline{
		{{Key: "$project", Value: bson.M{
			"totalCards": bson.M{
				"$cond": bson.M{
					"if":   bson.M{"$isArray": "$plannedCards"},
					"then": bson.M{"$size": "$plannedCards"},
					"else": 0,
				},
			},
		}}},
	}

	cursor, err := r.db.Collection("roadmap").Aggregate(ctx, pipeline)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	totalCount := 0
	var countResult struct {
		TotalCards int `bson:"totalCards"`
	}

	if cursor.Next(ctx) {
		if err := cursor.Decode(&countResult); err == nil {
			totalCount = countResult.TotalCards
		}
	}

	if totalCount == 0 {
		return make([]domain.PlannedCard, 0), 0, nil
	}

	skip := (page - 1) * limit
	var result struct {
		PlannedCards []domain.PlannedCard `bson:"plannedCards"`
	}

	err = r.db.Collection("roadmap").FindOne(
		ctx,
		bson.M{}, // Matches the single roadmap document
		options.FindOne().SetProjection(bson.M{
			"plannedCards": bson.M{"$slice": []int{skip, limit}},
		}),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return make([]domain.PlannedCard, 0), 0, nil
		}
		return nil, 0, err
	}

	if result.PlannedCards == nil {
		return make([]domain.PlannedCard, 0), 0, nil
	}

	return result.PlannedCards, totalCount, nil
}
