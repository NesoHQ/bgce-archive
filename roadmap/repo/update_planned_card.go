package repo

import (
	"context"
	"time"

	"roadmap/domain"
	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) UpdatePlannedCard(ctx context.Context, cardID string, card domain.PlannedCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	result, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{"plannedCards._id": cardID},
		bson.M{"$set": bson.M{
			"plannedCards.$.title":     card.Title,
			"plannedCards.$.items":     card.Items,
			"plannedCards.$.updatedBy": card.UpdatedBy,
			"plannedCards.$.updatedAt": card.UpdatedAt,
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
