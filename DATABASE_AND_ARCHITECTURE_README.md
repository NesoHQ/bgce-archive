# 🗄️ BGCE Archive - Complete Database Schema & Microservices Architecture

> **Comprehensive database design and microservices architecture for the BGCE Archive platform**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Microservices Architecture](#microservices-architecture)
4. [Quick Start](#quick-start)
5. [Project Status](#project-status)
6. [Documentation](#documentation)

---

## 🎯 Overview

This repository contains the complete database schema and microservices architecture for the BGCE Archive platform - a multi-tenant, community-driven knowledge preservation platform for the Go ecosystem.

### Key Features
- ✅ Multi-tenant architecture with domain-based detection
- ✅ Hierarchical content categorization
- ✅ Post versioning and approval workflows
- ✅ Community features (comments, discussions, likes)
- ✅ Learning resources (courses, cheatsheets, projects)
- ✅ Support ticket system
- ✅ Full-text search
- ✅ Analytics and reporting

---

## 🗄️ Database Schema

### 📊 Statistics
- **Total Tables:** 28
- **Normalization:** 1NF, 2NF, 3NF compliant
- **Database Engine:** PostgreSQL 14+
- **Relationships:** 50+ foreign keys
- **Indexes:** 80+ strategic indexes

### 📁 Table Categories

#### Core Tables (6)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `tenants` | Multi-tenant support | id, uuid, domain, plan |
| `users` | User accounts | id, uuid, email, role |
| `categories` | Content hierarchy | id, slug, parent_id |
| `posts` | Blog posts/articles | id, slug, content, status |
| `post_versions` | Version history | id, post_id, version_no |
| `tags` | Content tagging | id, name, slug |

#### Community Tables (7)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `comments` | Post comments | id, post_id, user_id, status |
| `discussions` | Forum discussions | id, title, slug, user_id |
| `discussion_replies` | Discussion responses | id, discussion_id, user_id |
| `likes` | Universal likes | id, user_id, likeable_type |
| `bookmarks` | User bookmarks | id, user_id, post_id |
| `follows` | User relationships | id, follower_id, following_id |
| `post_tags` | Post-tag mapping | id, post_id, tag_id |

#### Support & Moderation (3)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `support_tickets` | Customer support | id, subject, status, priority |
| `support_ticket_replies` | Ticket responses | id, ticket_id, message |
| `moderation_strategies` | Content moderation | id, type, config |

#### Learning Resources (3)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `courses` | Educational courses | id, title, level, rating |
| `cheatsheets` | Quick references | id, title, category |
| `projects` | Project showcase | id, title, github_url |

#### System Tables (5)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `notifications` | User notifications | id, user_id, type, is_read |
| `activity_logs` | Audit trail | id, user_id, action, entity_type |
| `post_views` | View tracking | id, post_id, user_id |
| `tenant_stats` | Analytics | id, tenant_id, date, metrics |
| `media_files` | File management | id, file_path, mime_type |

#### Search & Indexing (2)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `search_index` | Full-text search | id, searchable_type, search_vector |

### 🔗 Key Relationships

```
Tenant (1) ──→ (N) Users
Tenant (1) ──→ (N) Posts
Tenant (1) ──→ (N) Categories

User (1) ──→ (N) Posts (created_by)
User (1) ──→ (N) Comments
User (1) ──→ (N) Discussions
User (N) ←──→ (N) User (follows)

Category (1) ──→ (N) Category (parent_id)
Category (1) ──→ (N) Posts

Post (1) ──→ (N) Comments
Post (1) ──→ (N) PostVersions
Post (N) ←──→ (N) Tags (post_tags)
Post (1) ──→ (N) Likes (polymorphic)
Post (1) ──→ (N) Bookmarks
```

### 📥 How to Use

1. **Visualize the Schema:**
   ```bash
   # Copy contents of database_schema.dbml
   # Paste into https://dbdiagram.io/d
   ```

2. **Generate SQL Migrations:**
   ```bash
   # Use dbdiagram.io export feature
   # Or use a DBML to SQL converter
   ```

3. **Create Database:**
   ```sql
   CREATE DATABASE bgce_archive;
   \c bgce_archive
   -- Run generated migrations
   ```

---

## 🏗️ Microservices Architecture

### 🎯 Service Overview

```
┌─────────────────────────────────────────────┐
│           API Gateway (Nginx)               │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐          ┌────▼─────┐
│ Client │          │  Admin   │
│  App   │          │   App    │
└────────┘          └──────────┘
    │                     │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────────────────────┐
    │                                     │
┌───▼──────┐  ┌──────────┐  ┌──────────┐
│ Cortex   │  │  Postal  │  │Community │
│ (8080)   │  │  (8081)  │  │  (8082)  │
└──────────┘  └──────────┘  └──────────┘
    │              │              │
    └──────────────┴──────────────┘
                   │
          ┌────────▼────────┐
          │   PostgreSQL    │
          │     Redis       │
          │   RabbitMQ      │
          └─────────────────┘
```

### 📦 Services Breakdown

#### ✅ Existing Services (2)

**1. Cortex Service** (Port 8080)
- **Purpose:** Core platform management
- **Features:**
  - User authentication & authorization
  - Role-based access control
  - Category management
  - Tenant management
- **Tech:** Go, Ent ORM, PostgreSQL

**2. Postal Service** (Port 8081)
- **Purpose:** Post/article management
- **Features:**
  - Post CRUD operations
  - Version control
  - Status workflows
  - Batch operations
- **Tech:** Go, GORM, PostgreSQL, Redis

#### 🔴 Required New Services (7)

**3. Community Service** (Port 8082)
- Comments & moderation
- Discussions & replies
- Likes & reactions
- User follows
- Notifications

**4. Learning Service** (Port 8083)
- Courses management
- Cheatsheets
- Projects showcase
- Progress tracking

**5. Support Service** (Port 8084)
- Support tickets
- Ticket assignment
- Moderation strategies
- Email integration

**6. Search Service** (Port 8085)
- Full-text search
- Search suggestions
- Recommendations
- Trending content

**7. Media Service** (Port 8086)
- File uploads
- Image optimization
- Thumbnail generation
- CDN integration

**8. Analytics Service** (Port 8087)
- View tracking
- Engagement metrics
- Reporting
- Dashboards

**9. Notification Service** (Port 8088)
- Email notifications
- In-app notifications
- Email templates
- Preferences

### 🔄 Communication Patterns

**Synchronous (REST API)**
```
Client → API Gateway → Services
Service → Service (direct calls)
```

**Asynchronous (Events via RabbitMQ)**
```
Post Published → Notification Service
Comment Created → Notification Service
User Registered → Email Service
Post Viewed → Analytics Service
```

---

## 🚀 Quick Start

### Prerequisites
- PostgreSQL 14+
- Redis 6+
- RabbitMQ 3.9+
- Go 1.21+
- Node.js 18+
- Docker & Docker Compose

### 1. Database Setup

```bash
# Create database
createdb bgce_archive

# Apply schema (from dbdiagram.io export)
psql -d bgce_archive -f migrations.sql

# Verify tables
psql -d bgce_archive -c "\dt"
```

### 2. Start Existing Services

```bash
# Start Cortex
cd cortex
make run

# Start Postal
cd postal
make run
```

### 3. Start Frontend Applications

```bash
# Start Client (Next.js)
cd archive-client
pnpm install
pnpm dev

# Start Admin (Vue.js)
cd archive-admin
pnpm install
pnpm dev
```

### 4. Access Applications

- **Client:** http://localhost:3000
- **Admin:** http://localhost:5173
- **Cortex API:** http://localhost:8080
- **Postal API:** http://localhost:8081

---

## 📊 Project Status

### Overall Completion: 35%

| Component | Status | Completion |
|-----------|--------|------------|
| Frontend UI | ✅ | 60% |
| Admin Panel | ✅ | 70% |
| Backend Services | ⚠️ | 25% |
| Database Schema | ⚠️ | 20% |
| API Integration | ⚠️ | 40% |
| Testing | 🔴 | 5% |
| Documentation | ⚠️ | 50% |

### Feature Status

#### ✅ Completed
- [x] User authentication
- [x] Post management
- [x] Category hierarchy
- [x] Admin dashboard
- [x] Multi-tenant support
- [x] Post versioning

#### ⚠️ In Progress
- [ ] API integration (40%)
- [ ] Frontend data binding (60%)
- [ ] Admin features (70%)

#### 🔴 Not Started
- [ ] Comments system
- [ ] Discussions
- [ ] Likes/reactions
- [ ] User follows
- [ ] Search functionality
- [ ] Media uploads
- [ ] Email notifications
- [ ] Analytics
- [ ] Support tickets

---

## 📚 Documentation

### Generated Files

1. **database_schema.dbml**
   - Complete database schema in DBML format
   - 28 tables with relationships
   - Ready for dbdiagram.io

2. **MICROSERVICES_ARCHITECTURE.md**
   - Detailed microservices design
   - API endpoints for all services
   - Communication patterns
   - Technology stack

3. **DATABASE_IMPLEMENTATION_GUIDE.md**
   - Database setup instructions
   - Migration strategy
   - Index optimization
   - Sample queries
   - Performance tuning

4. **PROJECT_COMPLETION_SUMMARY.md**
   - Current status analysis
   - Missing features list
   - Development roadmap
   - Effort estimation

5. **QUICK_REFERENCE.md**
   - Quick reference card
   - Common commands
   - API endpoints summary
   - Development checklist

### Additional Resources

- **API Documentation:** (To be generated with Swagger)
- **Deployment Guide:** (To be created)
- **Testing Guide:** (To be created)
- **Contributing Guide:** See CONTRIBUTING.md

---

## 🎯 Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Implement all 28 database tables
- [ ] Set up migrations and seeds
- [ ] Enhance existing services
- [ ] Build Media Service

### Phase 2: Community (Weeks 5-8)
- [ ] Build Community Service
- [ ] Implement comments API
- [ ] Create discussions API
- [ ] Build Search Service

### Phase 3: Learning (Weeks 9-12)
- [ ] Build Learning Service
- [ ] Build Support Service
- [ ] Implement email integration
- [ ] Add notification system

### Phase 4: Polish (Weeks 13-16)
- [ ] Build Analytics Service
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment

**Estimated Time:** 16 weeks (4 months)

---

## 🔧 Technology Stack

### Backend
- **Language:** Go 1.21+
- **Frameworks:** Standard library, Ent, GORM
- **Database:** PostgreSQL 14+
- **Cache:** Redis 6+
- **Queue:** RabbitMQ 3.9+
- **Auth:** JWT

### Frontend
- **Client:** Next.js 14+, React 18+, TypeScript
- **Admin:** Vue 3, TypeScript, Pinia
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Shadcn

### Infrastructure
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes (production)
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus, Grafana
- **Logging:** ELK Stack

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For questions or issues:
- **Documentation:** Check the docs/ folder
- **Issues:** Open a GitHub issue
- **Discussions:** Use GitHub Discussions
- **Email:** support@bgce-archive.com

---

## 🙏 Acknowledgments

- Built with ❤️ for the Go community
- Inspired by modern knowledge platforms
- Thanks to all contributors

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** In Development (35% Complete)

---

## 🔗 Quick Links

- [View Database Schema](https://dbdiagram.io/d) (paste database_schema.dbml)
- [Microservices Architecture](MICROSERVICES_ARCHITECTURE.md)
- [Implementation Guide](DATABASE_IMPLEMENTATION_GUIDE.md)
- [Project Status](PROJECT_COMPLETION_SUMMARY.md)
- [Quick Reference](QUICK_REFERENCE.md)
