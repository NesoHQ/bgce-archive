# Database Seeding - Quick Summary

## ✅ What Was Created

### 1. Seed System Files
- `user/seed.go` - Seeding logic and default users
- `cmd/seed.go` - CLI command for seeding
- `SEEDING.md` - Comprehensive documentation
- `SEED_CREDENTIALS.md` - Quick reference card

### 2. Makefile Targets
- `make seed` - Seed database locally
- `make seed-docker` - Seed database in Docker

### 3. Default Users (4 accounts)
- **Admin**: Full system access
- **Editor**: Content creation/editing
- **Viewer**: Read-only access
- **Test**: Testing account

---

## 🚀 Quick Start

```bash
# Start services
cd cortex
make docker-up

# Seed database
make seed-docker

# Output shows credentials:
# ======================================================================
# SEEDED USER CREDENTIALS
# ======================================================================
# 
# Role: admin
#   Email:    admin@bgce.com
#   Username: admin
#   Password: Admin@123
#   Name:     System Administrator
# 
# ... (more users)
```

---

## 🔑 Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@bgce.com | Admin@123 | admin |
| editor@bgce.com | Editor@123 | editor |
| viewer@bgce.com | Viewer@123 | viewer |
| test@example.com | Test@123 | viewer |

---

## 📝 Usage

### Local Development
```bash
make seed
```

### Docker
```bash
make seed-docker
```

### Direct Binary
```bash
./cortex seed
```

---

## ✨ Features

- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Auto-Migration**: Runs migrations before seeding
- ✅ **Secure**: Bcrypt password hashing
- ✅ **Clear Output**: Displays all credentials
- ✅ **Skip Existing**: Won't duplicate users

---

## 🧪 Testing

```bash
# Test login with admin
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bgce.com","password":"Admin@123"}'

# Test with editor
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@bgce.com","password":"Editor@123"}'
```

---

## 📚 Documentation

- **Full Guide**: `SEEDING.md`
- **Quick Reference**: `SEED_CREDENTIALS.md`
- **Quick Start**: `../QUICK_START.md`

---

## ⚠️ Security

**NEVER use these credentials in production!**

For production:
1. Don't run seed command
2. Create admin manually with secure password
3. Use environment variables for secrets
4. Enable 2FA
5. Rotate passwords regularly

---

## 🎯 Next Steps

1. **Start Services**: `make docker-up`
2. **Seed Database**: `make seed-docker`
3. **Test Login**: Use any seeded credential
4. **Frontend**: Login at `http://localhost:5173`
5. **Test APIs**: Use the test script

---

## 💡 Tips

- Run `make seed` after schema changes
- Use different users to test role permissions
- Check logs if seeding fails: `make docker-logs`
- Credentials are displayed after seeding
- Safe to run multiple times

---

**Ready to use! 🎉**
