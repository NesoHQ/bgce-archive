package repo

import (
	"context"
	"errors"
	"fmt"
	"time"

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

func (r *ctgryRepo) Insert(ctx context.Context, cat category.Category) (*category.Category, error) {
	query := r.psql.
		Insert(r.tableName).
		Columns(
			"slug", "label", "description", "created_by", "updated_by", "approved_by", "deleted_by",
			"created_at", "updated_at", "approved_at", "deleted_at", "status", "meta",
		).
		Values(
			cat.Slug,
			cat.Label,
			cat.Description,
			cat.CreatedBy,
			cat.UpdatedBy,
			cat.ApprovedBy,
			cat.DeletedBy,
			cat.CreatedAt,
			cat.UpdatedAt,
			cat.ApprovedAt,
			cat.DeletedAt,
			cat.Status,
			cat.Meta,
		).
		Suffix("RETURNING *")

	sqlStr, args, err := query.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build insert SQL: %w", err)
	}

	var inserted category.Category
	err = r.writeDb.QueryRowContext(ctx, sqlStr, args...).Scan(
		&inserted.ID,
		&inserted.UUID,
		&inserted.Slug,
		&inserted.Label,
		&inserted.Description,
		&inserted.CreatedBy,
		&inserted.UpdatedBy,
		&inserted.ApprovedBy,
		&inserted.DeletedBy,
		&inserted.CreatedAt,
		&inserted.UpdatedAt,
		&inserted.ApprovedAt,
		&inserted.DeletedAt,
		&inserted.Status,
		&inserted.Meta,
	)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			switch pqErr.Code {
			case "23505":
				if pqErr.Constraint == "categories_slug_key" {
					return nil, customerrors.ErrSlugExists
				}
				return nil, fmt.Errorf("unique constraint violation: %w", err)
			case "23502":
				return nil, fmt.Errorf("missing required field: %w", err)
			default:
				return nil, fmt.Errorf("database insert error: %w", err)
			}
		}
		return nil, fmt.Errorf("failed to insert category: %w", err)
	}

	return &inserted, nil
}

func (r *ctgryRepo) Delete(ctx context.Context, uuid string) error {
	query := r.psql.Update(r.tableName).Set("deleted_at", time.Now()).Set("status", "deleted").Where(sq.Eq{"uuid": uuid})

	sqlStr, args, err := query.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build delete SQL: %w", err)
	}

	result, err := r.writeDb.ExecContext(ctx, sqlStr, args...)
	if err != nil {
		return fmt.Errorf("failed to execute delete query: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return customerrors.ErrCategoryNotFound
	}

	return nil
}
