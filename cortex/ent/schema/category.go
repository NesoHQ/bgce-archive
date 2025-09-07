package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Category holds the schema definition for the Category entity.
type Category struct {
	ent.Schema
}

func (Category) Mixin() []ent.Mixin {
	return []ent.Mixin{
		// This BaseMixin Automatically adds id, uuid, created_at, and updated_at fields. // this comment should be removed
		BaseMixin{},
	}
}

// Fields of the Category.
func (Category) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("uuid", uuid.UUID{}).
			Default(uuid.New),
		field.String("slug").
			Unique().
			NotEmpty(),
		field.String("label").
			NotEmpty(),
		field.Text("description").
			Optional(),
		field.Int("creator_id").
			NonNegative().Optional(), // This can't be optional. its okay for now cause we have no other entity for now
		field.Int("approver_id").
			Optional(),
		field.Int("updater_id").
			Optional(),
		field.Int("deleter_id").
			Optional(),
		field.Time("approved_at").
			Optional(),
		field.Time("deleted_at").
			Optional(),
		field.Enum("status").Values("approved", "rejected", "deleted", "pending").Default("pending"),
		field.JSON("meta", map[string]any{}).
			Optional(),
	}
}

// Edges of the Category.
func (Category) Edges() []ent.Edge {
	return nil
	// All Relations should be defined here like approver_id, updater_id, deleter_id, creator_id
}
