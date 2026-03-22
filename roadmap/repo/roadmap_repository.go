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

func (r *RoadmapRepository) GetPlannedCards(ctx context.Context, page, limit int) ([]domain.PlannedCard, int, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	// 1. First find the total size of the array
	// Using basic aggregation to get the array length safely
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

	// 2. Fetch the paginated slice
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

func (r *RoadmapRepository) MoveCardToCompleted(ctx context.Context, cardID string, completedCard domain.CompletedCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	_, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{"inProgressCards._id": cardID},
		bson.M{
			"$pull": bson.M{"inProgressCards": bson.M{"_id": cardID}},
			"$push": bson.M{"completedCards": completedCard},
		},
	)

	return err
}

func (r *RoadmapRepository) GetInProgressCards(ctx context.Context, page, limit int) ([]domain.InProgressCard, int, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	pipeline := mongo.Pipeline{
		{{Key: "$project", Value: bson.M{
			"totalCards": bson.M{
				"$cond": bson.M{
					"if":   bson.M{"$isArray": "$inProgressCards"},
					"then": bson.M{"$size": "$inProgressCards"},
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
		return make([]domain.InProgressCard, 0), 0, nil
	}

	skip := (page - 1) * limit
	var result struct {
		InProgressCards []domain.InProgressCard `bson:"inProgressCards"`
	}

	err = r.db.Collection("roadmap").FindOne(
		ctx,
		bson.M{},
		options.FindOne().SetProjection(bson.M{
			"inProgressCards": bson.M{"$slice": []int{skip, limit}},
		}),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return make([]domain.InProgressCard, 0), 0, nil
		}
		return nil, 0, err
	}

	if result.InProgressCards == nil {
		return make([]domain.InProgressCard, 0), 0, nil
	}

	return result.InProgressCards, totalCount, nil
}

func (r *RoadmapRepository) GetCompletedCards(ctx context.Context, page, limit int) ([]domain.CompletedCard, int, error) {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	pipeline := mongo.Pipeline{
		{{Key: "$project", Value: bson.M{
			"totalCards": bson.M{
				"$cond": bson.M{
					"if":   bson.M{"$isArray": "$completedCards"},
					"then": bson.M{"$size": "$completedCards"},
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
		return make([]domain.CompletedCard, 0), 0, nil
	}

	skip := (page - 1) * limit
	var result struct {
		CompletedCards []domain.CompletedCard `bson:"completedCards"`
	}

	err = r.db.Collection("roadmap").FindOne(
		ctx,
		bson.M{},
		options.FindOne().SetProjection(bson.M{
			"completedCards": bson.M{"$slice": []int{skip, limit}},
		}),
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return make([]domain.CompletedCard, 0), 0, nil
		}
		return nil, 0, err
	}

	if result.CompletedCards == nil {
		return make([]domain.CompletedCard, 0), 0, nil
	}

	return result.CompletedCards, totalCount, nil
}
