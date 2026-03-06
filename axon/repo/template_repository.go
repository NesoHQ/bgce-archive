package repo

import (
    "context"
    "errors"
    "fmt"
    
    "axon/domain"
    "axon/template"
    
    "gorm.io/gorm"
)

type templateRepository struct {
    db *gorm.DB
}

func NewTemplateRepository(db *gorm.DB) template.Repository {
    return &templateRepository{db: db}
}

func (r *templateRepository) GetByType(ctx context.Context, templateType domain.TemplateType) (*domain.Template, error) {
    var template domain.Template
    err := r.db.WithContext(ctx).
        Where("type = ? AND is_active = ?", templateType, true).
        First(&template).Error
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, fmt.Errorf("template not found for type: %s", templateType)
        }
        return nil, err
    }
    return &template, nil
}

func (r *templateRepository) GetByID(ctx context.Context, id uint) (*domain.Template, error) {
    var template domain.Template
    err := r.db.WithContext(ctx).First(&template, id).Error
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, fmt.Errorf("template not found")
        }
        return nil, err
    }
    return &template, nil
}

func (r *templateRepository) Create(ctx context.Context, template *domain.Template) error {
    return r.db.WithContext(ctx).Create(template).Error
}

func (r *templateRepository) Update(ctx context.Context, template *domain.Template) error {
    return r.db.WithContext(ctx).Save(template).Error
}

func (r *templateRepository) Delete(ctx context.Context, id uint) error {
    return r.db.WithContext(ctx).Delete(&domain.Template{}, id).Error
}

func (r *templateRepository) List(ctx context.Context) ([]*domain.Template, error) {
    var templates []*domain.Template
    err := r.db.WithContext(ctx).Order("type ASC").Find(&templates).Error
    return templates, err
}

func (r *templateRepository) SetActive(ctx context.Context, id uint, isActive bool) error {
    return r.db.WithContext(ctx).
        Model(&domain.Template{}).
        Where("id = ?", id).
        Update("is_active", isActive).Error
}