package repo

import (
	"context"
	"time"

	"roadmap/domain"
	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) UpdateCompletedCard(ctx context.Context, cardID string, card domain.CompletedCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	result, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{"completedCards._id": cardID},
		bson.M{"$set": bson.M{
			"completedCards.$.title":     card.Title,
			"completedCards.$.items":     card.Items,
			"completedCards.$.updatedBy": card.UpdatedBy,
			"completedCards.$.updatedAt": card.UpdatedAt,
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
