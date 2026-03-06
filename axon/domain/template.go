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
    TemplatePostPublished  TemplateType = "post_published"    // NEW
    TemplateCourseEnrolled TemplateType = "course_enrolled"  // NEW
    TemplateDigest         TemplateType = "digest"
)

// Template stores email templates
type Template struct {
    ID          uint
    Name        string
    Type        TemplateType
    Subject     string      // Subject line with {{.Variable}} support
    BodyHTML    string      // HTML body
    BodyText    string      // Plain text body
    SendGridID  string      // SendGrid dynamic template ID (optional)
    IsActive    bool
    CreatedAt   time.Time
    UpdatedAt   time.Time
}