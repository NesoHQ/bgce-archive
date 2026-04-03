// @d:\Codes\bgce-archive\axon\domain\template.go
package domain

import "time"

// TemplateType matches notification types
type TemplateType string

const (
	TemplateWelcome        TemplateType = "welcome"
	TemplatePasswordReset  TemplateType = "password_reset"
	TemplateEmailVerify    TemplateType = "email_verify"
	TemplateCommentReply   TemplateType = "comment_reply"
	TemplatePostPublished  TemplateType = "post_published"
	TemplateCourseEnrolled TemplateType = "course_enrolled"
	TemplateDigest         TemplateType = "digest"
)

// Template stores email templates
type Template struct {
	ID         uint         `json:"ID"`
	Name       string       `json:"Name"`
	Type       TemplateType `json:"Type"`
	Subject    string       `json:"Subject"`
	BodyHTML   string       `json:"BodyHTML,omitempty"`
	BodyText   string       `json:"BodyText,omitempty"`
	SendGridID string       `json:"SendGridID,omitempty"`
	IsActive   bool         `json:"IsActive"`
	CreatedAt  time.Time    `json:"CreatedAt"`
	UpdatedAt  time.Time    `json:"UpdatedAt"`
}

// TableName sets the table name to email_templates for clarity
func (Template) TableName() string {
	return "email_templates"
}
