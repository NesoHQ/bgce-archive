// @d:\Codes\bgce-archive\axon\notification\service.go
package notification

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"axon/cache"
	"axon/domain"
	"axon/email"
	"axon/template"
)

type service struct {
	repo         Repository
	prefRepo     PreferenceRepository
	userRepo     UserRepository
	templateRepo template.Repository
	email        email.Provider
	cache        cache.Cache
}

func NewService(repo Repository, prefRepo PreferenceRepository, userRepo UserRepository, templateRepo template.Repository, email email.Provider, cache cache.Cache) Service {
	return &service{
		repo:         repo,
		prefRepo:     prefRepo,
		userRepo:     userRepo,
		templateRepo: templateRepo,
		email:        email,
		cache:        cache,
	}
}

// SendWelcomeEmail sends welcome email to new users
func (s *service) SendWelcomeEmail(ctx context.Context, userID uint, userEmail, userName string) error {
	tmpl, err := s.getTemplate(ctx, domain.TemplateWelcome)
	if err != nil {
		return fmt.Errorf("failed to get welcome template: %w", err)
	}

	data := map[string]interface{}{
		"Name":     userName,
		"LoginURL": "https://bgcearchive.com/login",
	}

	if tmpl.SendGridID != "" {
		err = s.email.SendWithSendGridTemplate(ctx, userEmail, tmpl.SendGridID, data)
	} else {
		bodyHTML := s.renderTemplate(tmpl.BodyHTML, data)
		bodyText := s.renderTemplate(tmpl.BodyText, data)
		subject := s.renderTemplate(tmpl.Subject, data)
		err = s.email.Send(ctx, userEmail, subject, bodyHTML, bodyText)
	}

	if err != nil {
		return fmt.Errorf("failed to send welcome email: %w", err)
	}

	notification := &domain.Notification{
		UserID:    userID,
		Type:      domain.NotificationTypeWelcome,
		Subject:   tmpl.Subject,
		Recipient: userEmail,
		Status:    domain.StatusSent,
		SentAt:    ptrTime(time.Now()),
	}

	return s.repo.Create(ctx, notification)
}

// SendPasswordReset sends password reset email
func (s *service) SendPasswordReset(ctx context.Context, userEmail, resetToken string) error {
	tmpl, err := s.getTemplate(ctx, domain.TemplatePasswordReset)
	if err != nil {
		return err
	}

	resetURL := fmt.Sprintf("https://bgcearchive.com/reset-password?token=%s", resetToken)
	data := map[string]interface{}{
		"ResetURL":  resetURL,
		"ExpiresIn": "1 hour",
	}

	bodyHTML := s.renderTemplate(tmpl.BodyHTML, data)
	bodyText := s.renderTemplate(tmpl.BodyText, data)

	return s.email.Send(ctx, userEmail, tmpl.Subject, bodyHTML, bodyText)
}

// SendEmailVerification sends email verification
func (s *service) SendEmailVerification(ctx context.Context, userID uint, userEmail, verifyToken string) error {
	tmpl, err := s.getTemplate(ctx, domain.TemplateEmailVerify)
	if err != nil {
		return err
	}

	verifyURL := fmt.Sprintf("https://bgcearchive.com/verify-email?token=%s", verifyToken)
	data := map[string]interface{}{
		"VerifyURL": verifyURL,
	}

	bodyHTML := s.renderTemplate(tmpl.BodyHTML, data)
	bodyText := s.renderTemplate(tmpl.BodyText, data)

	if err := s.email.Send(ctx, userEmail, tmpl.Subject, bodyHTML, bodyText); err != nil {
		return err
	}

	notification := &domain.Notification{
		UserID:    userID,
		Type:      domain.NotificationTypeEmailVerify,
		Subject:   tmpl.Subject,
		Recipient: userEmail,
		Status:    domain.StatusSent,
		SentAt:    ptrTime(time.Now()),
	}

	return s.repo.Create(ctx, notification)
}

// SendCommentReplyNotification notifies post author of reply
func (s *service) SendCommentReplyNotification(ctx context.Context, postAuthorID uint, postAuthorEmail, commenterName, postTitle, comment string) error {
	tmpl, err := s.getTemplate(ctx, domain.TemplateCommentReply)
	if err != nil {
		return err
	}

	data := map[string]interface{}{
		"CommenterName": commenterName,
		"PostTitle":     postTitle,
		"Comment":       comment,
	}

	bodyHTML := s.renderTemplate(tmpl.BodyHTML, data)
	bodyText := s.renderTemplate(tmpl.BodyText, data)
	subject := s.renderTemplate(tmpl.Subject, data)

	if err := s.email.Send(ctx, postAuthorEmail, subject, bodyHTML, bodyText); err != nil {
		return err
	}

	notification := &domain.Notification{
		UserID:    postAuthorID,
		Type:      domain.NotificationTypeCommentReply,
		Subject:   tmpl.Subject,
		Recipient: postAuthorEmail,
		Status:    domain.StatusSent,
		SentAt:    ptrTime(time.Now()),
	}

	return s.repo.Create(ctx, notification)
}

// SendPostPublishedNotification notifies followers of new post (NEW)
func (s *service) SendPostPublishedNotification(ctx context.Context, followerID uint, followerEmail, authorName, postTitle, postSlug string) error {
	// Check user preferences
	pref, err := s.prefRepo.GetByUserID(ctx, followerID)
	if err == nil && !pref.PostUpdates {
		return nil // User opted out of post updates
	}

	tmpl, err := s.getTemplate(ctx, domain.TemplatePostPublished)
	if err != nil {
		return err
	}

	postURL := fmt.Sprintf("https://bgcearchive.com/posts/%s", postSlug)
	data := map[string]interface{}{
		"AuthorName": authorName,
		"PostTitle":  postTitle,
		"PostURL":    postURL,
	}

	bodyHTML := s.renderTemplate(tmpl.BodyHTML, data)
	bodyText := s.renderTemplate(tmpl.BodyText, data)
	subject := s.renderTemplate(tmpl.Subject, data)

	if err := s.email.Send(ctx, followerEmail, subject, bodyHTML, bodyText); err != nil {
		return err
	}

	notification := &domain.Notification{
		UserID:    followerID,
		Type:      domain.NotificationTypePostPublished,
		Subject:   tmpl.Subject,
		Recipient: followerEmail,
		Status:    domain.StatusSent,
		SentAt:    ptrTime(time.Now()),
	}

	return s.repo.Create(ctx, notification)
}

// SendCourseEnrolledNotification sends course enrollment confirmation (NEW)
func (s *service) SendCourseEnrolledNotification(ctx context.Context, userID uint, userEmail, courseName string) error {
	tmpl, err := s.getTemplate(ctx, domain.TemplateCourseEnrolled)
	if err != nil {
		return err
	}

	courseURL := fmt.Sprintf("https://bgcearchive.com/courses/%s", courseName)
	data := map[string]interface{}{
		"CourseName": courseName,
		"CourseURL":  courseURL,
	}

	bodyHTML := s.renderTemplate(tmpl.BodyHTML, data)
	bodyText := s.renderTemplate(tmpl.BodyText, data)
	subject := s.renderTemplate(tmpl.Subject, data)

	if err := s.email.Send(ctx, userEmail, subject, bodyHTML, bodyText); err != nil {
		return err
	}

	notification := &domain.Notification{
		UserID:    userID,
		Type:      domain.NotificationTypeCourseEnrolled,
		Subject:   tmpl.Subject,
		Recipient: userEmail,
		Status:    domain.StatusSent,
		SentAt:    ptrTime(time.Now()),
	}

	return s.repo.Create(ctx, notification)
}

// Send sends a generic notification (NEW)
func (s *service) Send(ctx context.Context, req *domain.SendRequest) error {
	// Validate user exists
	exists, err := s.userRepo.Exists(ctx, req.UserID)
	if err != nil {
		return fmt.Errorf("failed to validate user: %w", err)
	}
	if !exists {
		return fmt.Errorf("user not found: %d", req.UserID)
	}

	tmpl, err := s.templateRepo.GetByType(ctx, domain.TemplateType(req.Type))
	if err != nil {
		// If no template, send direct email
		return s.email.Send(ctx, req.Recipient, req.Subject, "", "")
	}

	bodyHTML := s.renderTemplate(tmpl.BodyHTML, req.TemplateData)
	bodyText := s.renderTemplate(tmpl.BodyText, req.TemplateData)

	if err := s.email.Send(ctx, req.Recipient, tmpl.Subject, bodyHTML, bodyText); err != nil {
		return err
	}

	notification := &domain.Notification{
		UserID:    req.UserID,
		Type:      req.Type,
		Subject:   tmpl.Subject,
		Recipient: req.Recipient,
		Status:    domain.StatusSent,
		SentAt:    ptrTime(time.Now()),
	}

	return s.repo.Create(ctx, notification)
}

// SendEmail sends a direct email (NEW)
func (s *service) SendEmail(ctx context.Context, req *domain.EmailRequest) error {
	return s.email.Send(ctx, req.To, req.Subject, req.BodyHTML, req.BodyText)
}

// SendWeeklyDigest sends weekly digest to user
func (s *service) SendWeeklyDigest(ctx context.Context, userID uint, userEmail string) error {
	tmpl, err := s.getTemplate(ctx, domain.TemplateDigest)
	if err != nil {
		return err
	}

	// Get pending notifications for digest
	pending, err := s.repo.GetPendingDigest(ctx, userID)
	if err != nil {
		return err
	}

	if len(pending) == 0 {
		return nil // Nothing to send
	}

	// Build digest content
	content := s.buildDigestContent(pending)
	data := map[string]interface{}{
		"Content": content,
	}

	bodyHTML := s.renderTemplate(tmpl.BodyHTML, data)
	bodyText := s.renderTemplate(tmpl.BodyText, data)

	if err := s.email.Send(ctx, userEmail, tmpl.Subject, bodyHTML, bodyText); err != nil {
		return err
	}

	// Mark notifications as included in digest
	var ids []uint
	for _, n := range pending {
		ids = append(ids, n.ID)
	}
	return s.repo.MarkDigestSent(ctx, ids)
}

// GetUserPreferences gets notification preferences
func (s *service) GetUserPreferences(ctx context.Context, userID uint) (*domain.UserPreference, error) {
	return s.prefRepo.GetByUserID(ctx, userID)
}

// UpdateUserPreferences updates notification preferences
func (s *service) UpdateUserPreferences(ctx context.Context, preference *domain.UserPreference) error {
	return s.prefRepo.Update(ctx, preference)
}

// GetNotificationHistory gets user's notification history
func (s *service) GetNotificationHistory(ctx context.Context, userID uint, limit, offset int) ([]*domain.Notification, int64, error) {
	return s.repo.GetByUserID(ctx, userID, limit, offset)
}

// getTemplate fetches template from cache or database
func (s *service) getTemplate(ctx context.Context, templateType domain.TemplateType) (*domain.Template, error) {
	cacheKey := fmt.Sprintf("template:%s", templateType)

	// Try cache first
	cached, _ := s.cache.Get(ctx, cacheKey)
	if cached != "" {
		var tmpl domain.Template
		if err := json.Unmarshal([]byte(cached), &tmpl); err == nil {
			return &tmpl, nil
		}
	}

	// Fetch from database
	tmpl, err := s.templateRepo.GetByType(ctx, templateType)
	if err != nil {
		return nil, err
	}

	// Cache for 24 hours
	data, _ := json.Marshal(tmpl)
	s.cache.Set(ctx, cacheKey, string(data), 24*time.Hour)

	return tmpl, nil
}

// renderTemplate renders template with data
func (s *service) renderTemplate(tmpl string, data map[string]interface{}) string {
	result := tmpl
	for key, value := range data {
		placeholder := fmt.Sprintf("{{.%s}}", key)
		result = replaceAll(result, placeholder, fmt.Sprintf("%v", value))
	}
	return result
}

// buildDigestContent builds digest content from notifications
func (s *service) buildDigestContent(notifications []*domain.Notification) string {
	var content string
	for _, n := range notifications {
		content += fmt.Sprintf("- %s\n", n.Subject)
	}
	return content
}

func ptrTime(t time.Time) *time.Time {
	return &t
}

func replaceAll(s, old, new string) string {
	result := ""
	for i := 0; i < len(s); i++ {
		if i <= len(s)-len(old) && s[i:i+len(old)] == old {
			result += new
			i += len(old) - 1
		} else {
			result += string(s[i])
		}
	}
	return result
}
