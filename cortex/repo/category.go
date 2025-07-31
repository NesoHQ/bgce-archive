package repo

import (
	"context"
	"errors"
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
