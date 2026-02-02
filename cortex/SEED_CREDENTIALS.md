# 🔑 Seed User Credentials

Quick reference for seeded user accounts.

---

## Default Users

| Role | Email | Username | Password | Access Level |
|------|-------|----------|----------|--------------|
| **Admin** | admin@bgce.com | admin | Admin@123 | Full access |
| **Editor** | editor@bgce.com | editor | Editor@123 | Create/Edit content |
| **Viewer** | viewer@bgce.com | viewer | Viewer@123 | Read-only |
| **Test** | test@example.com | testuser | Test@123 | Read-only |

---

## Quick Commands

```bash
# Seed database (local)
make seed

# Seed database (Docker)
make seed-docker

# Test login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bgce.com","password":"Admin@123"}'
```

---

## Frontend Login

Navigate to: `http://localhost:5173/login`

Use any of the credentials above.

---

## ⚠️ Security Warning

**DO NOT USE THESE CREDENTIALS IN PRODUCTION!**

These are for development and testing only.

---

## Role Permissions

### Admin
- ✅ Create categories
- ✅ Update categories
- ✅ Delete categories
- ✅ Manage users
- ✅ All operations

### Editor
- ✅ Create categories
- ✅ Update categories
- ✅ View all content
- ❌ Delete categories
- ❌ Manage users

### Viewer
- ✅ View all content
- ❌ Create content
- ❌ Update content
- ❌ Delete content
- ❌ Manage users

---

## Need Help?

See `SEEDING.md` for detailed documentation.
