package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Tenant holds the schema definition for the Tenant entity.
type Tenant struct {
	ent.Schema
}

// Fields of the Tenant.
func (Tenant) Fields() []ent.Field {
	return []ent.Field{
		field.Int("id").
			Positive().
			Unique(),
		field.UUID("uuid", uuid.UUID{}).
			Default(uuid.New).
			Unique().
			Immutable(),
		field.String("name").
			NotEmpty().
			MaxLen(255),
		field.String("slug").
			NotEmpty().
			Unique().
			MaxLen(255),
		field.String("domain").
			Optional().
			MaxLen(255),
		field.Enum("status").
			Values("active", "inactive", "suspended").
			Default("active"),
		field.Enum("plan").
			Values("free", "starter", "professional", "enterprise").
			Default("free"),
		field.JSON("settings", map[string]interface{}{}).
			Optional(),
		field.JSON("meta", map[string]interface{}{}).
			Optional(),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Tenant.
func (Tenant) Edges() []ent.Edge {
	return nil
}
