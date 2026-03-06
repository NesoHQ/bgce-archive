package template

import (
    "context"
    
    "axon/domain"
)

// Repository defines template data access operations
type Repository interface {
    // GetByType fetches template by type (welcome, password_reset, etc.)
    GetByType(ctx context.Context, templateType domain.TemplateType) (*domain.Template, error)
    
    // GetByID fetches template by ID
    GetByID(ctx context.Context, id uint) (*domain.Template, error)
    
    // Create creates a new template
    Create(ctx context.Context, template *domain.Template) error
    
    // Update updates an existing template
    Update(ctx context.Context, template *domain.Template) error
    
    // Delete soft deletes a template
    Delete(ctx context.Context, id uint) error
    
    // List lists all templates
    List(ctx context.Context) ([]*domain.Template, error)
    
    // SetActive sets a template as active/inactive
    SetActive(ctx context.Context, id uint, isActive bool) error
}