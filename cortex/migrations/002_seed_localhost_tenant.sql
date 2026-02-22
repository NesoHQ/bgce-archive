-- Insert default localhost tenant for development
INSERT INTO tenants (uuid, name, slug, domain, status, plan, settings, meta, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Local Development',
    'localhost',
    'localhost',
    'active',
    'enterprise',
    '{}',
    '{}',
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO NOTHING;
