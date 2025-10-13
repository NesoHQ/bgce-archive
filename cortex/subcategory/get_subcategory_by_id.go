package subcategory

import (
	"context"
	"errors"

	"cortex/ent/category"
	customerrors "cortex/pkg/custom_errors"

	"github.com/google/uuid"
)

func (s *service) GetSubcategoryByID(ctx context.Context, id int) (*Subcategory, error) {
	sc, err := s.ent.Category.Query().
		Where(category.IDEQ(id)).
		First(ctx)
	if err != nil {
		return nil, customerrors.ErrCategoryNotFound
	}

	// Check if it's actually a subcategory (has a parent)
	if sc.ParentID == 0 {
		return nil, errors.New("category is not a subcategory")
	}

	parsedUUID, err := uuid.Parse(sc.UUID)
	if err != nil {
		return nil, errors.New("invalid subcategory UUID")
	}

	return &Subcategory{
		ID:          sc.ID,
		ParentID:    sc.ParentID,
		UUID:        parsedUUID,
		Slug:        sc.Slug,
		Label:       sc.Label,
		Description: sc.Description,
		CreatedBy:   sc.CreatedBy,
		UpdatedBy:   &sc.UpdatedBy,
		ApprovedBy:  &sc.ApprovedBy,
		DeletedBy:   &sc.DeletedBy,
		CreatedAt:   sc.CreatedAt,
		UpdatedAt:   sc.UpdatedAt,
		ApprovedAt:  &sc.ApprovedAt,
		DeletedAt:   &sc.DeletedAt,
		Status:      string(sc.Status),
		Meta:        sc.Meta,
	}, nil
}

func (s *service) GetSubcategoryByUUID(ctx context.Context, subcategoryUUID uuid.UUID) (*Subcategory, error) {
	sc, err := s.ent.Category.Query().
		Where(category.UUIDEQ(subcategoryUUID.String())).
		First(ctx)
	if err != nil {
		return nil, customerrors.ErrCategoryNotFound
	}

	// Check if it's actually a subcategory (has a parent)
	if sc.ParentID == 0 {
		return nil, errors.New("category is not a subcategory")
	}

	parsedUUID, err := uuid.Parse(sc.UUID)
	if err != nil {
		return nil, errors.New("invalid subcategory UUID")
	}

	return &Subcategory{
		ID:          sc.ID,
		ParentID:    sc.ParentID,
		UUID:        parsedUUID,
		Slug:        sc.Slug,
		Label:       sc.Label,
		Description: sc.Description,
		CreatedBy:   sc.CreatedBy,
		UpdatedBy:   &sc.UpdatedBy,
		ApprovedBy:  &sc.ApprovedBy,
		DeletedBy:   &sc.DeletedBy,
		CreatedAt:   sc.CreatedAt,
		UpdatedAt:   sc.UpdatedAt,
		ApprovedAt:  &sc.ApprovedAt,
		DeletedAt:   &sc.DeletedAt,
		Status:      string(sc.Status),
		Meta:        sc.Meta,
	}, nil
}