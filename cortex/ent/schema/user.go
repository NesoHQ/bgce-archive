package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		BaseMixin{},
	}
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("username").
			Unique().
			NotEmpty().
			MinLen(3).
			MaxLen(50),

		field.String("email").
			Unique().
			NotEmpty(),

		field.String("password_hash").
			Sensitive().
			NotEmpty(),

		field.String("full_name").
			Optional(),

		field.Enum("role").
			Values("admin", "editor", "viewer").
			Default("viewer"),

		field.Enum("status").
			Values("active", "inactive", "suspended").
			Default("active"),

		field.Time("last_login_at").
			Optional(),

		field.JSON("meta", map[string]any{}).
			Optional(),
	}
}

// Indexes of the User.
func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("email").Unique(),
		index.Fields("username").Unique(),
		index.Fields("status"),
	}
}
