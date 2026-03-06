package email

import "context"

// Provider defines generic email operations
// Services use this interface, NOT provider-specific methods
type Provider interface {
    // Send sends a simple email
    Send(ctx context.Context, to, subject, bodyHTML, bodyText string) error
    
    // SendWithTemplate sends using stored template with data
    SendWithTemplate(ctx context.Context, to string, templateID uint, data map[string]interface{}) error
    
    // SendWithSendGridTemplate sends using SendGrid dynamic template
    // Only works when EMAIL_PROVIDER=sendgrid
    SendWithSendGridTemplate(ctx context.Context, to, sendGridTemplateID string, data map[string]interface{}) error
    
    // GetName returns provider name for logging
    GetName() string
}