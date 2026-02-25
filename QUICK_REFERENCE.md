# BGCE Archive - Quick Reference Card

## 📁 Generated Files

1. **database_schema.dbml** - Paste into [dbdiagram.io](https://dbdiagram.io/d) to visualize
2. **MICROSERVICES_ARCHITECTURE.md** - Complete microservices design
3. **DATABASE_IMPLEMENTATION_GUIDE.md** - Database setup guide
4. **PROJECT_COMPLETION_SUMMARY.md** - Project status and roadmap
5. **QUICK_REFERENCE.md** - This file

---

## 🗄️ Database Summary

**Total Tables:** 28  
**Normalization:** 1NF, 2NF, 3NF ✅  
**Database:** PostgreSQL 14+

### Table Categories
- **Core (6):** tenants, users, categories, posts, post_versions, tags
- **Community (7):** comments, discussions, discussion_replies, likes, bookmarks, follows, post_tags
- **Support (3):** support_tickets, support_ticket_replies, moderation_strategies
- **Learning (3):** courses, cheatsheets, projects
- **System (5):** notifications, activity_logs, post_views, tenant_stats, media_files
- **Search (2):** search_index, post_tags

---

## 🏗️ Microservices

### Existing (2)
1. **Cortex** (8080) - Users, Auth, Categories, Tenants
2. **Postal** (8081) - Posts, Versions, Tags

### Required (7)
3. **Community** (8082) - Comments, Discussions, Likes, Follows
4. **Learning** (8083) - Courses, Cheatsheets, Projects
5. **Support** (8084) - Tickets, Moderation
6. **Search** (8085) - Full-text Search, Recommendations
7. **Media** (8086) - File Uploads, Image Processing
8. **Analytics** (8087) - Tracking, Reporting
9. **Notification** (8088) - Emails, In-app Notifications

---

## 📊 Project Status

**Overall Completion:** 35%

- Frontend: 60% ✅
- Admin Panel: 70% ✅
- Backend: 25% ⚠️
- Database: 20% ⚠️

---

## 🎯 Priority Features

### HIGH PRIORITY
1. 🔴 Comments system (backend + frontend integration)
2. 🔴 Media upload service
3. 🔴 Email notifications
4. 🔴 User follow system
5. 🔴 Full-text search

### MEDIUM PRIORITY
6. 🔴 Discussions/forums
7. 🔴 Courses backend
8. 🔴 Support tickets backend
9. 🔴 Likes/reactions
10. 🔴 Bookmarks

### LOW PRIORITY
11. 🔴 Analytics service
12. 🔴 Advanced search
13. 🔴 Recommendations
14. 🔴 Practice challenges
15. 🔴 Certifications

---

## 🚀 Quick Start

### 1. View Database Schema
```bash
# Open database_schema.dbml in dbdiagram.io
# Or use any DBML viewer
```

### 2. Create Database
```sql
-- Create database
CREATE DATABASE bgce_archive;

-- Run migrations (generate from DBML)
psql -U postgres -d bgce_archive -f migrations.sql
```

### 3. Start Services
```bash
# Cortex (existing)
cd cortex && make run

# Postal (existing)
cd postal && make run

# Frontend
cd archive-client && pnpm dev

# Admin
cd archive-admin && pnpm dev
```

### 4. Build New Services
Follow MICROSERVICES_ARCHITECTURE.md for each service

---

## 📋 Development Checklist

### Phase 1: Foundation (Weeks 1-4)
- [ ] Create all 28 database tables
- [ ] Set up migrations and seeds
- [ ] Enhance Cortex (follows, OAuth)
- [ ] Enhance Postal (likes, bookmarks)
- [ ] Build Media Service

### Phase 2: Community (Weeks 5-8)
- [ ] Build Community Service
- [ ] Implement comments API
- [ ] Create discussions API
- [ ] Add notifications
- [ ] Build Search Service

### Phase 3: Learning (Weeks 9-12)
- [ ] Build Learning Service
- [ ] Implement courses API
- [ ] Create cheatsheets API
- [ ] Build Support Service
- [ ] Add email integration

### Phase 4: Polish (Weeks 13-16)
- [ ] Build Analytics Service
- [ ] Add monitoring
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment

---

## 🔑 Key Relationships

### User-Centric
```
User → Posts (created_by)
User → Comments (user_id)
User → Discussions (user_id)
User → Follows (follower_id, following_id)
User → Bookmarks (user_id)
User → Likes (user_id)
```

### Content-Centric
```
Post → Category (category_id)
Post → Comments (post_id)
Post → Versions (post_id)
Post → Tags (post_tags)
Post → Likes (polymorphic)
```

### Tenant-Centric
```
Tenant → Users (tenant_id)
Tenant → Posts (tenant_id)
Tenant → Categories (tenant_id)
Tenant → All Content (multi-tenant)
```

---

## 🔧 Tech Stack

### Frontend
- **Client:** Next.js 14+, React 18+, TypeScript
- **Admin:** Vue 3, TypeScript, Pinia
- **Styling:** Tailwind CSS
- **UI:** Radix UI, Shadcn

### Backend
- **Language:** Go 1.21+
- **Frameworks:** Standard library, Ent, GORM
- **Auth:** JWT
- **API:** REST

### Infrastructure
- **Database:** PostgreSQL 14+
- **Cache:** Redis
- **Queue:** RabbitMQ
- **Storage:** MinIO/S3
- **Search:** PostgreSQL FTS or Elasticsearch

---

## 📞 API Endpoints Summary

### Cortex (8080)
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/users/profile
GET    /api/v1/categories
POST   /api/v1/categories
GET    /api/v1/tenants
```

### Postal (8081)
```
GET    /api/v1/posts
GET    /api/v1/posts/{id}
POST   /api/v1/posts
PUT    /api/v1/posts/{id}
DELETE /api/v1/posts/{id}
POST   /api/v1/posts/{id}/publish
```

### Community (8082) - NEW
```
GET    /api/v1/comments
POST   /api/v1/comments
GET    /api/v1/discussions
POST   /api/v1/discussions
POST   /api/v1/likes
GET    /api/v1/notifications
```

### Learning (8083) - NEW
```
GET    /api/v1/courses
POST   /api/v1/courses
GET    /api/v1/cheatsheets
GET    /api/v1/projects
```

---

## 🎨 Frontend Pages

### Public (archive-client)
```
/                          - Homepage
/archive                   - All posts
/archive/{category}        - Category posts
/archive/post/{slug}       - Single post
/blogs                     - Blog listing
/discussion                - Discussions
/explore/courses           - Courses
/resources/cheatsheet      - Cheatsheets
/login                     - Login
/register                  - Register
/profile                   - User profile
```

### Admin (archive-admin)
```
/dashboard                 - Dashboard
/posts                     - Post management
/posts/create              - Create post
/comments                  - Comment moderation
/categories                - Category management
/tenants                   - Tenant management
/support                   - Support tickets
/profile                   - Admin profile
```

---

## 💾 Database Indexes

### Critical Indexes
```sql
-- Users
idx_users_email
idx_users_username
idx_users_tenant_id

-- Posts
idx_posts_slug
idx_posts_category_id
idx_posts_status
idx_posts_published_at

-- Categories
idx_categories_slug
idx_categories_parent_id

-- Comments
idx_comments_post_id
idx_comments_status

-- Full-text search
idx_search_vector (GIN)
```

---

## 🔒 Security Checklist

- [ ] JWT authentication
- [ ] Password hashing (bcrypt)
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] SSL/TLS encryption
- [ ] Input validation
- [ ] Output sanitization
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Secure file uploads
- [ ] API key management

---

## 📈 Performance Targets

### Response Times
- API endpoints: < 200ms (p95)
- Page load: < 2s (p95)
- Database queries: < 100ms (p95)

### Scalability
- Support 10,000+ concurrent users
- Handle 1M+ posts
- Process 100+ requests/second

### Availability
- 99.9% uptime
- < 1 hour downtime/month
- Automated failover

---

## 📚 Documentation Links

- **Database Schema:** database_schema.dbml
- **Architecture:** MICROSERVICES_ARCHITECTURE.md
- **Implementation:** DATABASE_IMPLEMENTATION_GUIDE.md
- **Status:** PROJECT_COMPLETION_SUMMARY.md

---

## 🆘 Common Commands

### Database
```bash
# Create database
createdb bgce_archive

# Run migrations
psql -d bgce_archive -f migrations.sql

# Backup
pg_dump bgce_archive > backup.sql

# Restore
psql bgce_archive < backup.sql
```

### Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development
```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

---

## 🎯 Success Metrics

### MVP Launch
- ✅ 100% core features
- ✅ 80% test coverage
- ✅ < 2s page load
- ✅ 99% uptime

### Full Launch
- ✅ 100% all features
- ✅ 90% test coverage
- ✅ < 1s page load
- ✅ 99.9% uptime
- ✅ 10K+ users
- ✅ 1M+ posts

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** Development (35% Complete)
