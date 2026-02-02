# Quick Start Guide

## 🚀 Get Everything Running in 5 Minutes

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ and Yarn installed
- Go 1.23+ installed (for local development)

---

## Step 1: Start Backend Services

```bash
cd cortex

# Start PostgreSQL, Redis, RabbitMQ, and Cortex API
make docker-up

# Wait for services to be healthy (about 30 seconds)
# Check logs
make docker-logs
```

The API will be available at `http://localhost:5000`

---

## Step 2: Seed the Database

```bash
# Seed with default users
make seed-docker

# This creates 4 users:
# - admin@bgce.com (Admin@123)
# - editor@bgce.com (Editor@123)
# - viewer@bgce.com (Viewer@123)
# - test@example.com (Test@123)
```

See `SEED_CREDENTIALS.md` for all credentials.

---

## Step 3: Start Frontend

```bash
cd archive-admin

# Install dependencies (first time only)
yarn install

# Start development server
yarn dev
```

The frontend will be available at `http://localhost:5173`

---

## Step 4: Login and Test

1. Open browser to `http://localhost:5173/login`
2. Enter credentials:
   - Email: `admin@bgce.com`
   - Password: `Admin@123`
3. Click "Login to Archive"
4. You'll be redirected to the dashboard
5. Navigate to Categories to test CRUD operations

**Other test accounts**:
- Editor: `editor@bgce.com` / `Editor@123`
- Viewer: `viewer@bgce.com` / `Viewer@123`

---

## 🧪 Quick API Test

Run the automated test script:

```bash
cd cortex
./test_auth_api.sh
```

This will test:
- ✅ User registration
- ✅ User login
- ✅ Get profile (protected)
- ✅ Update profile (protected)
- ✅ Create category (protected)
- ✅ Unauthorized access (should fail)

---

## 📋 Available Commands

### Backend (Cortex)

```bash
# Docker commands
make docker-up          # Start all services
make docker-down        # Stop all services
make docker-logs        # View logs
make docker-restart     # Restart services
make docker-clean       # Clean everything

# Database
make seed               # Seed database (local)
make seed-docker        # Seed database (Docker)
make ent-gen            # Generate Ent code
make ent-schema NAME=X  # Create new entity

# Local development
make build              # Build binary
make start              # Build and run
make dev                # Run with hot reload (requires air)
make test               # Run tests
```

### Frontend (Archive-Admin)

```bash
yarn dev                # Start dev server
yarn build              # Build for production
yarn preview            # Preview production build
yarn lint               # Lint code
yarn type-check         # Check TypeScript types
```

---

## 🔑 Default Credentials

After seeding, use these credentials:
- **Admin**: admin@bgce.com / Admin@123
- **Editor**: editor@bgce.com / Editor@123
- **Viewer**: viewer@bgce.com / Viewer@123

See `cortex/SEED_CREDENTIALS.md` for details.

---

## 🌐 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | - |
| Backend API | http://localhost:5000 | - |
| Swagger Docs | http://localhost:5000/swagger/ | - |
| PostgreSQL | localhost:5432 | postgres/postgres |
| Redis | localhost:6379 | - |
| RabbitMQ | localhost:5672 | admin/admin |
| RabbitMQ Management | http://localhost:15672 | admin/admin |

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if ports are in use
lsof -i :5000
lsof -i :5432

# Clean and restart
cd cortex
make docker-clean
make docker-up
```

### Frontend can't connect to API
```bash
# Check .env file
cat archive-admin/.env

# Should contain:
# VITE_API_BASE_URL=http://localhost:5000/api/v1

# Restart frontend
cd archive-admin
yarn dev
```

### Database migration issues
```bash
# Regenerate Ent code
cd cortex
make ent-gen

# Rebuild and restart
make docker-clean
make docker-up
```

### Token expired or invalid
- Clear browser localStorage
- Login again
- Token expires after 24 hours

---

## 📚 Next Steps

1. **Read the Documentation**:
   - `AUTHENTICATION_IMPLEMENTATION.md` - Detailed implementation guide
   - `IMPLEMENTATION_SUMMARY.md` - Complete feature list

2. **Explore the Code**:
   - Backend: `cortex/user/` and `cortex/auth/`
   - Frontend: `archive-admin/src/services/` and `archive-admin/src/stores/`

3. **Test the APIs**:
   - Use the test script: `cortex/test_auth_api.sh`
   - Import Postman collection (if available)
   - Check Swagger docs at http://localhost:5000/swagger/

4. **Customize**:
   - Update JWT secret in `.env`
   - Modify user roles and permissions
   - Add custom fields to User entity
   - Extend API with new endpoints

---

## 💡 Tips

- **Development**: Use `make dev` for backend hot reload
- **Debugging**: Check `make docker-logs` for backend errors
- **Testing**: Run `./test_auth_api.sh` after changes
- **Database**: Use TablePlus or pgAdmin to inspect data
- **API Testing**: Use Postman or Thunder Client

---

## 🎯 Common Tasks

### Add a New User Field

1. Update `cortex/ent/schema/user.go`
2. Run `make ent-gen`
3. Update `cortex/user/dto.go`
4. Update `archive-admin/src/types/api.ts`
5. Restart services

### Add a New API Endpoint

1. Create handler in `cortex/rest/handlers/`
2. Add route in `cortex/rest/server.go`
3. Create service method in frontend
4. Update TypeScript types
5. Use in components

### Change JWT Expiration

1. Update `cortex/auth/token.go`
2. Change `ExpiresAt` duration
3. Rebuild: `make docker-clean && make docker-up`

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can access protected routes
- [ ] Can create/update/delete categories
- [ ] Token persists after page refresh
- [ ] Logout works correctly

---

## 🆘 Need Help?

1. Check the logs: `make docker-logs`
2. Review documentation files
3. Check environment variables
4. Verify all services are running
5. Clear browser cache and localStorage

---

**Happy Coding! 🎉**
