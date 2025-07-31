package repo

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
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

func (r *ctgryRepo) Insert(ctx context.Context, category category.Category) error {
	query := r.psql.Insert(r.tableName).
		Columns("slug", "label", "description", "created_by", "created_at", "updated_at", "status", "meta").
		Values(
			category.Slug,
			category.Label,
			category.Description,
			category.CreatedBy,
			category.CreatedAt,
			category.UpdatedAt,
			category.Status,
			category.Meta,
		).
		Suffix("RETURNING id, uuid")

	stmt, args, err := query.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build insert SQL: %w", err)
	}

	err = r.writeDb.QueryRowContext(ctx, stmt, args...).Scan(&category.ID, &category.UUID)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23505":
				if pqErr.Constraint == "categories_slug_key" {
					return customerrors.ErrSlugExists
				}
				return fmt.Errorf("unique constraint violation on categories: %w", err)
			case "23502":
				return fmt.Errorf("missing required field: %w", err)
			default:
				return fmt.Errorf("database error during insert: %w", err)
			}
		}
		return fmt.Errorf("failed to insert category: %w", err)
	}

	return nil
}
