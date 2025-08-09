package repo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"cortex/category"
	customerrors "cortex/pkg/custom_errors"
)

type CtgryRepo interface {
	category.CtgryRepo
}

type ctgryRepo struct {
	tableName string
	readDb    *sqlx.DB
	writeDb   *sqlx.DB
	psql      sq.StatementBuilderType
}

func NewCtgryRepo(readDb, writeDb *sqlx.DB, psql sq.StatementBuilderType) CtgryRepo {
	return &ctgryRepo{
		tableName: "categories",
		readDb:    readDb,
		writeDb:   writeDb,
		psql:      psql,
	}
}

func (r *ctgryRepo) Insert(ctx context.Context, cat category.Category) error {
	query := r.psql.
		Insert(r.tableName).
		Columns("slug", "label", "description", "created_by", "created_at", "updated_at", "status", "meta").
		Values(
			cat.Slug,
			cat.Label,
			cat.Description,
			cat.CreatedBy,
			cat.CreatedAt,
			cat.UpdatedAt,
			cat.Status,
			cat.Meta,
		).
		Suffix("RETURNING id, uuid")

	sqlStr, args, err := query.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build insert SQL: %w", err)
	}

	err = r.writeDb.QueryRowContext(ctx, sqlStr, args...).Scan(&cat.ID, &cat.UUID)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			switch pqErr.Code {
			case "23505":
				if pqErr.Constraint == "categories_slug_key" {
					return customerrors.ErrSlugExists
				}
				return fmt.Errorf("unique constraint violation: %w", err)
			case "23502":
				return fmt.Errorf("missing required field: %w", err)
			default:
				return fmt.Errorf("database insert error: %w", err)
			}
		}
		return fmt.Errorf("failed to insert category: %w", err)
	}

	return nil
}

func (r *ctgryRepo) Get(ctx context.Context, categoryUUID uuid.UUID) (*category.Category, error) {
	var cat category.Category

	query := r.psql.
		Select(
			"id",
			"uuid",
			"slug",
			"label",
			"description",
			"created_by",
			"updated_by",
			"approved_by",
			"deleted_by",
			"created_at",
			"updated_at",
			"approved_at",
			"deleted_at",
			"status",
			"meta",
		).
		From(r.tableName).
		Where(sq.Eq{"uuid": categoryUUID})

	sqlStr, args, err := query.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build get SQL: %w", err)
	}

	err = r.readDb.QueryRowContext(ctx, sqlStr, args...).Scan(
		&cat.ID,
		&cat.UUID,
		&cat.Slug,
		&cat.Label,
		&cat.Description,
		&cat.CreatedBy,
		&cat.UpdatedBy,
		&cat.ApprovedBy,
		&cat.DeletedBy,
		&cat.CreatedAt,
		&cat.UpdatedAt,
		&cat.ApprovedAt,
		&cat.DeletedAt,
		&cat.Status,
		&cat.Meta,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("category not found: %w", err)
		}
		return nil, fmt.Errorf("failed to fetch category: %w", err)
	}

	return &cat, nil
}
