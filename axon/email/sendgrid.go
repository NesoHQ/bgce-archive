package email

import (
    "context"
    "fmt"
    "log"
    
    "github.com/sendgrid/sendgrid-go"
    "github.com/sendgrid/sendgrid-go/helpers/mail"
)

type sendgridProvider struct {
    apiKey    string
    fromEmail string
    fromName  string
}

// NewSendGridProvider creates a SendGrid email provider
func NewSendGridProvider(apiKey, fromEmail, fromName string) Provider {
    return &sendgridProvider{
        apiKey:    apiKey,
        fromEmail: fromEmail,
        fromName:  fromName,
    }
}

func (s *sendgridProvider) GetName() string {
    return "sendgrid"
}

// Send sends a basic email via SendGrid API
func (s *sendgridProvider) Send(ctx context.Context, to, subject, bodyHTML, bodyText string) error {
    from := mail.NewEmail(s.fromName, s.fromEmail)
    toAddr := mail.NewEmail("", to)
    
    // Create message
    message := mail.NewSingleEmail(from, subject, toAddr, bodyText, bodyHTML)
    
    // Send via SendGrid API
    client := sendgrid.NewSendClient(s.apiKey)
    response, err := client.Send(message)
    if err != nil {
        return fmt.Errorf("sendgrid send failed: %w", err)
    }
    
    // Log response (you might want to return this instead)
    log.Printf("[SendGrid] Status: %d, To: %s", response.StatusCode, to)
    
    if response.StatusCode >= 400 {
        return fmt.Errorf("sendgrid error: %s", response.Body)
    }
    
    return nil
}

// SendWithTemplate uses stored template from database
// This method fetches template from DB and sends
func (s *sendgridProvider) SendWithTemplate(ctx context.Context, to string, templateID uint, data map[string]interface{}) error {
    // NOTE: This implementation would need access to template repository
    // For now, return error - this should be implemented in the service layer
    // which has access to both email.Provider and template.Repository
    return fmt.Errorf("SendWithTemplate requires template repository - use service layer")
}

// SendWithSendGridTemplate uses SendGrid dynamic templates
func (s *sendgridProvider) SendWithSendGridTemplate(ctx context.Context, to, sendGridTemplateID string, data map[string]interface{}) error {
    from := mail.NewEmail(s.fromName, s.fromEmail)
    toAddr := mail.NewEmail("", to)
    
    // Create message with dynamic template
    message := mail.NewV3MailInit(from, "", toAddr)
    message.SetTemplateID(sendGridTemplateID)
    
    // Add dynamic data
    personalization := mail.NewPersonalization()
    for key, value := range data {
        personalization.SetDynamicTemplateData(key, value)
    }
    message.AddPersonalizations(personalization)
    
    // Send
    client := sendgrid.NewSendClient(s.apiKey)
    response, err := client.Send(message)
    if err != nil {
        return fmt.Errorf("sendgrid template send failed: %w", err)
    }
    
    log.Printf("[SendGrid Template] Status: %d, Template: %s", response.StatusCode, sendGridTemplateID)
    
    if response.StatusCode >= 400 {
        return fmt.Errorf("sendgrid template error: %s", response.Body)
    }
    
    return nil
}