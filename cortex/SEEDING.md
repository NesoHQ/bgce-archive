# Database Seeding Guide

## Overview

The seeding system populates the database with initial users for development and testing purposes.

---

## Default Seed Users

The system creates 4 default users with different roles:

### 1. Admin User
- **Email**: `admin@bgce.com`
- **Username**: `admin`
- **Password**: `Admin@123`
- **Role**: `admin`
- **Full Name**: System Administrator

### 2. Editor User
- **Email**: `editor@bgce.com`
- **Username**: `editor`
- **Password**: `Editor@123`
- **Role**: `editor`
- **Full Name**: Content Editor

### 3. Viewer User
- **Email**: `viewer@bgce.com`
- **Username**: `viewer`
- **Password**: `Viewer@123`
- **Role**: `viewer`
- **Full Name**: Content Viewer

### 4. Test User
- **Email**: `test@example.com`
- **Username**: `testuser`
- **Password**: `Test@123`
- **Role**: `viewer`
- **Full Name**: Test User

---

## How to Seed

### Method 1: Using Make (Recommended)

```bash
# Build and seed locally
make seed

# Seed in Docker container
make seed-docker
```

### Method 2: Using Binary Directly

```bash
# Build first
go build -o cortex main.go

# Run seed command
./cortex seed
```

### Method 3: Using Docker Compose

```bash
# Start services
docker compose up -d

# Execute seed command in container
docker compose exec bgce_cortex /app/main seed
```

---

## Seed Command Features

### Automatic Migration
The seed command automatically runs database migrations before seeding, ensuring the schema is up to date.

### Idempotent Operation
The seed command is safe to run multiple times. It checks if users already exist and skips them:

```
✓ User already exists, skipping: admin@bgce.com
✓ User created successfully: editor@bgce.com
```

### Password Security
All passwords are hashed using bcrypt with cost factor 12 before storage.

### Credential Display
After seeding, the command displays all credentials in a formatted table for easy reference.

---

## Usage Examples

### Quick Start (Docker)

```bash
# Start all services
cd cortex
make docker-up

# Wait for services to be healthy (30 seconds)

# Seed the database
make seed-docker

# Test login with admin user
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bgce.com",
    "password": "Admin@123"
  }'
```

### Local Development

```bash
# Ensure PostgreSQL is running
# Update .env with correct database credentials

# Build and seed
make seed

# Start server
make start
```

---

## Customizing Seed Data

### Adding Custom Users

Edit `cortex/user/seed.go` and modify the `DefaultSeedUsers()` function:

```go
func DefaultSeedUsers() []SeedUser {
    return []SeedUser{
        {
            Username: "myuser",
            Email:    "myuser@example.com",
            Password: "MyPassword@123",
            FullName: "My Custom User",
            Role:     entuser.RoleEditor,
            Status:   entuser.StatusActive,
        },
        // ... existing users
    }
}
```

### Programmatic Seeding

You can also seed users programmatically:

```go
import (
    "context"
    "cortex/user"
    "cortex/ent"
)

func seedCustomUsers(ctx context.Context, client *ent.Client) error {
    customUsers := []user.SeedUser{
        {
            Username: "custom",
            Email:    "custom@example.com",
            Password: "Custom@123",
            FullName: "Custom User",
            Role:     entuser.RoleViewer,
            Status:   entuser.StatusActive,
        },
    }
    
    return user.SeedUsers(ctx, client, customUsers)
}
```

---

## Security Considerations

### ⚠️ Production Warning

**NEVER use these default credentials in production!**

The seed command is designed for:
- Local development
- Testing environments
- CI/CD pipelines
- Demo instances

### Production Setup

For production:

1. **Disable Seeding**: Don't run the seed command
2. **Create Admin Manually**: Use a secure password
3. **Use Environment Variables**: Store credentials securely
4. **Enable 2FA**: Add two-factor authentication
5. **Rotate Passwords**: Change default passwords immediately

### Password Requirements

Default passwords follow these rules:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Troubleshooting

### Database Connection Error

```
Error: Failed to connect to database
```

**Solution**: Check your database connection string in `.env`:
```env
BGCE_DB_DSN=postgres://postgres:postgres@localhost:5432/bgce?sslmode=disable
```

### User Already Exists

```
User already exists, skipping: admin@bgce.com
```

**This is normal!** The seed command is idempotent and skips existing users.

### Migration Failed

```
Error: Failed to run migrations
```

**Solution**: Ensure the database exists and you have proper permissions:
```bash
# Create database if it doesn't exist
psql -U postgres -c "CREATE DATABASE bgce;"
```

### Permission Denied

```
Error: permission denied for table users
```

**Solution**: Grant proper permissions to your database user:
```sql
GRANT ALL PRIVILEGES ON DATABASE bgce TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

---

## Integration with Frontend

After seeding, you can use these credentials in the archive-admin frontend:

1. Navigate to `http://localhost:5173/login`
2. Use any of the seeded credentials
3. Test different role-based features

### Testing Different Roles

**Admin User** (full access):
```
Email: admin@bgce.com
Password: Admin@123
```

**Editor User** (can create/edit):
```
Email: editor@bgce.com
Password: Editor@123
```

**Viewer User** (read-only):
```
Email: viewer@bgce.com
Password: Viewer@123
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Seed Database
  run: |
    cd cortex
    make docker-up
    sleep 30
    make seed-docker
```

### GitLab CI Example

```yaml
seed_database:
  script:
    - cd cortex
    - make docker-up
    - sleep 30
    - make seed-docker
```

---

## Advanced Usage

### Seed Specific Users Only

Create a custom seed command:

```go
// cmd/seed_admin.go
func SeedAdminCommand() *cobra.Command {
    return &cobra.Command{
        Use:   "seed-admin",
        Short: "Seed only admin user",
        RunE: func(cmd *cobra.Command, args []string) error {
            // ... setup code ...
            
            adminUsers := []user.SeedUser{
                user.DefaultSeedUsers()[0], // Only admin
            }
            
            return user.SeedUsers(ctx, entClient, adminUsers)
        },
    }
}
```

### Seed from JSON File

```go
func SeedFromFile(ctx context.Context, client *ent.Client, filename string) error {
    data, err := os.ReadFile(filename)
    if err != nil {
        return err
    }
    
    var users []user.SeedUser
    if err := json.Unmarshal(data, &users); err != nil {
        return err
    }
    
    return user.SeedUsers(ctx, client, users)
}
```

---

## Best Practices

1. **Always Seed After Schema Changes**: Run `make seed` after modifying the User schema
2. **Use Different Passwords**: Change passwords for each environment
3. **Document Custom Seeds**: If you add custom users, document them
4. **Test Role Permissions**: Use different seeded users to test RBAC
5. **Clean Seed Data**: Remove seed data before production deployment

---

## Related Commands

```bash
# Database operations
make ent-gen          # Generate Ent code
make db-migrate       # Run migrations only
make seed             # Seed database

# Docker operations
make docker-up        # Start services
make seed-docker      # Seed in Docker
make docker-clean     # Clean everything

# Development
make dev              # Run with hot reload
make test             # Run tests
```

---

## Summary

The seeding system provides a quick and reliable way to populate your database with test users. It's:

- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Secure**: Uses bcrypt password hashing
- ✅ **Flexible**: Easy to customize
- ✅ **Documented**: Clear credential display
- ✅ **Production-Safe**: Warns about security

Use it for development and testing, but always create secure users manually in production!
