package email

import (
	"context"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strconv"
	"strings"
)

type smtpProvider struct {
	host       string
	port       int
	username   string
	password   string
	fromEmail  string
	fromName   string
	authMethod string
}

// NewSMTPProvider creates an SMTP email provider
func NewSMTPProvider(host string, port int, username, password, fromEmail, fromName, authMethod string) Provider {
	return &smtpProvider{
		host:       host,
		port:       port,
		username:   username,
		password:   password,
		fromEmail:  fromEmail,
		fromName:   fromName,
		authMethod: authMethod,
	}
}

func (s *smtpProvider) GetName() string {
	return "smtp"
}

// Send sends a basic email via SMTP
func (s *smtpProvider) Send(ctx context.Context, to, subject, bodyHTML, bodyText string) error {
	addr := fmt.Sprintf("%s:%d", s.host, s.port)

	// Build message
	from := fmt.Sprintf("%s <%s>", s.fromName, s.fromEmail)
	msg := buildMessage(from, to, subject, bodyHTML, bodyText)

	// Authenticate
	var auth smtp.Auth
	if s.username != "" && s.password != "" {
		auth = smtp.PlainAuth("", s.username, s.password, s.host)
	}

	// Send
	err := smtp.SendMail(addr, auth, s.fromEmail, []string{to}, []byte(msg))
	if err != nil {
		return fmt.Errorf("smtp send failed: %w", err)
	}

	log.Printf("[SMTP] Sent to: %s, Subject: %s", to, subject)
	return nil
}

// SendWithTemplate uses stored template from database
func (s *smtpProvider) SendWithTemplate(ctx context.Context, to string, templateID uint, data map[string]interface{}) error {
	// NOTE: This requires template repository access
	// Should be implemented in service layer
	return fmt.Errorf("SendWithTemplate requires template repository - use service layer")
}

// SendWithSendGridTemplate not supported for SMTP
func (s *smtpProvider) SendWithSendGridTemplate(ctx context.Context, to, sendGridTemplateID string, data map[string]interface{}) error {
	return fmt.Errorf("SendGrid templates not supported with SMTP provider")
}

func buildMessage(from, to, subject, bodyHTML, bodyText string) string {
	var msg strings.Builder
	
	msg.WriteString(fmt.Sprintf("From: %s\r\n", from))
	msg.WriteString(fmt.Sprintf("To: %s\r\n", to))
	msg.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	msg.WriteString("MIME-Version: 1.0\r\n")
	
	if bodyHTML != "" && bodyText != "" {
		// Multipart message
		boundary := "boundary-string"
		msg.WriteString(fmt.Sprintf("Content-Type: multipart/alternative; boundary=%q\r\n\r\n", boundary))
		msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
		msg.WriteString("Content-Type: text/plain; charset=utf-8\r\n\r\n")
		msg.WriteString(bodyText + "\r\n\r\n")
		msg.WriteString(fmt.Sprintf("--%s\r\n", boundary))
		msg.WriteString("Content-Type: text/html; charset=utf-8\r\n\r\n")
		msg.WriteString(bodyHTML + "\r\n\r\n")
		msg.WriteString(fmt.Sprintf("--%s--\r\n", boundary))
	} else if bodyHTML != "" {
		msg.WriteString("Content-Type: text/html; charset=utf-8\r\n\r\n")
		msg.WriteString(bodyHTML)
	} else {
		msg.WriteString("Content-Type: text/plain; charset=utf-8\r\n\r\n")
		msg.WriteString(bodyText)
	}
	
	return msg.String()
}

// NewSMTPProviderFromEnv creates SMTP provider from environment variables
func NewSMTPProviderFromEnv() (Provider, error) {
	host := os.Getenv("SMTP_HOST")
	if host == "" {
		host = "localhost"
	}

	portStr := os.Getenv("SMTP_PORT")
	if portStr == "" {
		portStr = "1025"
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid SMTP_PORT: %w", err)
	}

	username := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")
	fromEmail := os.Getenv("EMAIL_FROM")
	if fromEmail == "" {
		fromEmail = "noreply@example.com"
	}
	fromName := os.Getenv("EMAIL_FROM_NAME")
	if fromName == "" {
		fromName = "Axon"
	}
	authMethod := os.Getenv("SMTP_AUTH_METHOD")
	if authMethod == "" {
		authMethod = "plain"
	}

	return NewSMTPProvider(host, port, username, password, fromEmail, fromName, authMethod), nil
}
