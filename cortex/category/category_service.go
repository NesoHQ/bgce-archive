package category

import (
	"context"
	"errors"

	"cortex/ent"
	"cortex/ent/category"

	"github.com/google/uuid"
)

func (s *service) FindCategoryByID(ctx context.Context, id int) (*ent.Category, error) {
	category, err := s.ent.Category.Query().Where(
		category.IDEQ(id),
	).First(ctx)
	if err != nil {
		return nil, errors.New("ent: category not found")
	}
	return category, nil
}

func (s *service) FindCategoryByUUID(ctx context.Context, uid uuid.UUID) (*ent.Category, error) {
	category, err := s.ent.Category.Query().Where(
		category.UUIDEQ(uid.String()),
	).First(ctx)
	if err != nil {
		return nil, errors.New("ent: category not found")
	}
	return category, nil
}

func (s *service) FindCategoryBySlug(ctx context.Context, slug string) (*ent.Category, error) {
	category, err := s.ent.Category.Query().Where(
		category.SlugEQ(slug),
	).First(ctx)
	if err != nil {
		return nil, errors.New("ent: category not found")
	}
	return category, nil
}

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
		SetMeta(params.Meta).
		Save(ctx)
	if err != nil {
		return errors.New("ent: category creation failed")
	}
	return nil
}

func (s *service) DeleteCategoryByUUID(ctx context.Context, uuid uuid.UUID) error {
	category, err := s.FindCategoryByUUID(ctx, uuid)
	if err != nil {
		return err
	}
	err = s.ent.Category.DeleteOne(category).Exec(ctx)
	if err != nil {
		return errors.New("ent: category deletion failed")
	}
	return nil
}
