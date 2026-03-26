package repo

import (
	"context"
	"time"

	"roadmap/domain"
	"roadmap/roadmap"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *RoadmapRepository) UpdateChangeLog(ctx context.Context, cardID string, card domain.ChangeLogCard) error {
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	result, err := r.db.Collection("roadmap").UpdateOne(
		ctx,
		bson.M{"changeLogCards._id": cardID},
		bson.M{"$set": bson.M{
			"changeLogCards.$.title":     card.Title,
			"changeLogCards.$.items":     card.Items,
			"changeLogCards.$.month":     card.Month,
			"changeLogCards.$.year":      card.Year,
			"changeLogCards.$.updatedBy": card.UpdatedBy,
			"changeLogCards.$.updatedAt": card.UpdatedAt,
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
