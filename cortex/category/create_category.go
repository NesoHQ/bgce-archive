package category

import (
	"context"
	"errors"
)

func (s *service) CreateCategory(ctx context.Context, params CreateCategoryParams) error {
	exists, _ := s.FindCategoryBySlug(ctx, params.Slug)
	if exists != nil {
		return errors.New("ent: category already exists")
	}
	_, err := s.ent.Category.Create().
		SetSlug(params.Slug).
		SetLabel(params.Label).
		SetDescription(params.Description).
		SetCreatorID(params.CreatorID).
		SetCreatedBy(params.CreatorID).
		SetMeta(params.Meta).
		Save(ctx)
	if err != nil {
		return errors.New("ent: category creation failed")
	}
	return nil
}
