package repo

import (
	"time"

	sq "github.com/Masterminds/squirrel"
)

func GetQueryBuilder() sq.StatementBuilderType {
	return sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
}

type buildQuery func() sq.SelectBuilder

type queryBuilder struct {
	query sq.SelectBuilder
}

func newQueryBuilder(buildQuery buildQuery) *queryBuilder {
	return &queryBuilder{
		query: buildQuery(),
	}
}

func (q *queryBuilder) filterByPrefix(key, val string) *queryBuilder {
	if val != "" {
		q.query = q.query.Where(sq.ILike{key: val + "%"})
	}
	return q
}

func (q *queryBuilder) Where(condition interface{}) *queryBuilder {
	q.query = q.query.Where(condition)
	return q
}

func (q *queryBuilder) filterByFullText(key, val string) *queryBuilder {
	if val != "" {
		q.query = q.query.Where(sq.ILike{key: "%" + val + "%"})
	}
	return q
}

func (q *queryBuilder) filterByIntEq(key string, val int) *queryBuilder {
	if val != 0 {
		q.query = q.query.Where(sq.Eq{key: val})
	}
	return q
}

func (q *queryBuilder) filterByStrEq(key string, val string) *queryBuilder {
	if val != "" {
		q.query = q.query.Where(sq.Eq{key: val})
	}
	return q
}

func (q *queryBuilder) filterByBoolEq(key string, val *bool) *queryBuilder {
	if val != nil {
		q.query = q.query.Where(sq.Eq{key: *val})
	}
	return q
}

func (q *queryBuilder) filterByTimeRange(key string, from, to *time.Time) *queryBuilder {
	if from != nil && to != nil {
		q.query = q.query.Where(sq.GtOrEq{key: from})
		q.query = q.query.Where(sq.LtOrEq{key: to})
	}
	return q
}

func (q *queryBuilder) filterByIntRange(key string, from, to *int) *queryBuilder {
	if from != nil && to != nil {
		q.query = q.query.Where(sq.GtOrEq{key: from})
		q.query = q.query.Where(sq.LtOrEq{key: to})
	}
	return q
}

func (q *queryBuilder) limit(limit int) *queryBuilder {
	q.query = q.query.Limit(uint64(limit))
	return q
}

func (q *queryBuilder) offset(offset int) *queryBuilder {
	q.query = q.query.Offset(uint64(offset))
	return q
}

func (q *queryBuilder) orderBy(sortBy, sortOrder string) *queryBuilder {
	if sortBy != "" && sortOrder != "" {
		q.query = q.query.OrderBy(sortBy + " " + sortOrder)
	}
	return q
}

func (q *queryBuilder) groupBy(groupBy ...string) *queryBuilder {
	q.query = q.query.GroupBy(groupBy...)
	return q
}
