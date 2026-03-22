package repo

import (
	"context"
	"time"

	"roadmap/domain"
	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) UpdateInProgressCard(ctx context.Context, cardID string, card domain.InProgressCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	result, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{"inProgressCards._id": cardID},
		bson.M{"$set": bson.M{
			"inProgressCards.$.title":                card.Title,
			"inProgressCards.$.items":                card.Items,
			"inProgressCards.$.completionPercentage": card.CompletionPercentage,
			"inProgressCards.$.updatedBy":            card.UpdatedBy,
			"inProgressCards.$.updatedAt":            card.UpdatedAt,
		}},
	)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return roadmap.ErrCardNotFound
	}

	return nil
}
