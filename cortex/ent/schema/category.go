package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Category holds the schema definition for the Category entity.
type Category struct {
	ent.Schema
}

func (Category) Mixin() []ent.Mixin {
	return []ent.Mixin{
		BaseMixin{},
	}
}

// Fields of the Category.
func (Category) Fields() []ent.Field {
	return []ent.Field{
		field.Int("parent_id").
			Optional(),

		field.String("slug").
			Unique().
			NotEmpty(),

		field.String("label").
			NotEmpty(),
		field.Int("creator_id").
			NonNegative().Optional(), // This can't be optional. its okay for now cause we have no other entity for now
		field.Text("description").
			Optional(),

		field.Int("created_by"),

		field.Int("updated_by").
			Optional(),

		field.Int("approved_by").
			Optional(),

		field.Int("deleted_by").
			Optional(),

		field.Time("approved_at").
			Optional(),

		field.Time("deleted_at").
			Optional(),

		field.Enum("status").
			Values("pending", "approved", "rejected", "deleted").
			Default("pending"),

		field.JSON("meta", map[string]any{}).
			Optional(),
	}
}

// Edges of the Category.
func (Category) Edges() []ent.Edge {
	return nil
	// Relations can be added later if needed
}
