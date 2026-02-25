# BGCE Archive - Complete Microservices Architecture

## Overview
This document outlines the complete microservices architecture required to support all features in the BGCE Archive platform, including archive-client (public frontend), archive-admin (admin dashboard), and backend services.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway / Nginx                      │
│                    (Reverse Proxy & Load Balancer)              │
└────────────┬────────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼─────┐
│ Client │      │  Admin   │
│  App   │      │   App    │
│(Next.js│      │  (Vue.js)│
└────────┘      └──────────┘
    │                 │
    └────────┬────────┘
             │
    ┌────────▼────────────────────────────────────────────┐
    │                                                      │
┌───▼──────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Cortex   │  │  Postal  │  │Community │  │Learning  │
│ Service  │  │ Service  │  │ Service  │  │ Service  │
│(Core API)│  │ (Posts)  │  │(Social)  │  │(Courses) │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │              │
     └─────────────┴──────────────┴──────────────┘
                   │
          ┌────────▼────────┐
          │                 │
     ┌────▼────┐      ┌────▼────┐
     │PostgreSQL│      │  Redis  │
     │Database │      │  Cache  │
     └─────────┘      └─────────┘
          │
     ┌────▼────┐
     │RabbitMQ │
     │ Events  │
     └─────────┘
```

## Microservices Breakdown

### 1. **Cortex Service** (Existing - Enhanced)
**Port:** 8080  
**Language:** Go  
**Database:** PostgreSQL (Ent ORM)  
**Purpose:** Core platform management

#### Current Features:
- ✅ User authentication & authorization
- ✅ User profile management
- ✅ Role-based access control (admin, editor, viewer)
- ✅ Multi-tenant management
- ✅ Category & subcategory management
- ✅ Category approval workflow

#### New Features Needed:
- 🔴 User follow system
- 🔴 User statistics & analytics
- 🔴 Email verification
- 🔴 Password reset
- 🔴 OAuth integration (GitHub, Google)
- 🔴 API key management for developers
- 🔴 Rate limiting per user/tenant
- 🔴 Audit logging

#### API Endpoints:
**Auth:**
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh
- POST /api/v1/auth/verify-email
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password
- POST /api/v1/auth/oauth/{provider}

**Users:**
- GET /api/v1/users/profile
- PUT /api/v1/users/profile
- POST /api/v1/users/change-password
- GET /api/v1/users/{id}
- GET /api/v1/users/{id}/stats
- POST /api/v1/users/{id}/follow
- DELETE /api/v1/users/{id}/unfollow
- GET /api/v1/users/{id}/followers
- GET /api/v1/users/{id}/following

**Categories:**
- POST /api/v1/categories
- GET /api/v1/categories
- GET /api/v1/categories/{uuid}
- PUT /api/v1/categories/{slug}
- DELETE /api/v1/categories/{id}
- POST /api/v1/categories/{id}/approve
- POST /api/v1/categories/{id}/reject

**Subcategories:**
- POST /api/v1/sub-categories
- GET /api/v1/sub-categories
- GET /api/v1/sub-categories/{id}
- PUT /api/v1/sub-categories/{id}
- DELETE /api/v1/sub-categories/{id}

**Tenants:**
- GET /api/v1/tenants
- GET /api/v1/tenants/{id}
- GET /api/v1/tenants/by-domain/{domain}
- POST /api/v1/tenants
- PUT /api/v1/tenants/{id}
- DELETE /api/v1/tenants/{id}
- GET /api/v1/tenants/{id}/stats

---

### 2. **Postal Service** (Existing - Enhanced)
**Port:** 8081  
**Language:** Go  
**Database:** PostgreSQL (GORM)  
**Cache:** Redis  
**Purpose:** Post/article management

#### Current Features:
- ✅ Post CRUD operations
- ✅ Post versioning
- ✅ Post status workflow (draft, published, archived)
- ✅ Batch upload/delete
- ✅ CSV import
- ✅ View count tracking
- ✅ SEO fields management
- ✅ Featured & pinned posts

#### New Features Needed:
- 🔴 Post likes/reactions
- 🔴 Post bookmarks
- 🔴 Post sharing
- 🔴 Related posts recommendation
- 🔴 Post scheduling
- 🔴 Post templates
- 🔴 Markdown preview
- 🔴 Auto-save drafts
- 🔴 Post analytics (views over time, engagement)

#### API Endpoints:
**Posts:**
- GET /api/v1/posts
- GET /api/v1/posts/{id}
- GET /api/v1/posts/slug/{slug}
- POST /api/v1/posts
- PUT /api/v1/posts/{id}
- DELETE /api/v1/posts/{id}
- POST /api/v1/posts/batch
- DELETE /api/v1/posts/batch

**Post Actions:**
- POST /api/v1/posts/{id}/publish
- POST /api/v1/posts/{id}/unpublish
- POST /api/v1/posts/{id}/archive
- POST /api/v1/posts/{id}/restore
- POST /api/v1/posts/{id}/like
- DELETE /api/v1/posts/{id}/unlike
- POST /api/v1/posts/{id}/bookmark
- DELETE /api/v1/posts/{id}/unbookmark
- GET /api/v1/posts/{id}/related
- GET /api/v1/posts/{id}/analytics

**Post Versions:**
- GET /api/v1/posts/{id}/versions
- GET /api/v1/posts/{id}/versions/{version}
- POST /api/v1/posts/{id}/revert/{version}

**Tags:**
- GET /api/v1/tags
- POST /api/v1/tags
- GET /api/v1/tags/{slug}
- PUT /api/v1/tags/{id}
- DELETE /api/v1/tags/{id}

---

### 3. **Community Service** (New - Required)
**Port:** 8082  
**Language:** Go  
**Database:** PostgreSQL  
**Cache:** Redis  
**Purpose:** Social features & community engagement

#### Features:
- Comments on posts
- Comment moderation
- Discussions/forums
- Discussion replies
- Likes/reactions system
- User follows
- Notifications
- Activity feed
- Mentions & tagging

#### API Endpoints:
**Comments:**
- GET /api/v1/comments
- GET /api/v1/comments/{id}
- POST /api/v1/comments
- PUT /api/v1/comments/{id}
- DELETE /api/v1/comments/{id}
- POST /api/v1/comments/{id}/approve
- POST /api/v1/comments/{id}/reject
- POST /api/v1/comments/{id}/spam
- POST /api/v1/comments/{id}/like
- DELETE /api/v1/comments/{id}/unlike
- GET /api/v1/posts/{id}/comments

**Discussions:**
- GET /api/v1/discussions
- GET /api/v1/discussions/{id}
- POST /api/v1/discussions
- PUT /api/v1/discussions/{id}
- DELETE /api/v1/discussions/{id}
- POST /api/v1/discussions/{id}/close
- POST /api/v1/discussions/{id}/lock
- POST /api/v1/discussions/{id}/upvote
- DELETE /api/v1/discussions/{id}/unvote

**Discussion Replies:**
- GET /api/v1/discussions/{id}/replies
- POST /api/v1/discussions/{id}/replies
- PUT /api/v1/replies/{id}
- DELETE /api/v1/replies/{id}
- POST /api/v1/replies/{id}/upvote
- POST /api/v1/replies/{id}/mark-solution

**Notifications:**
- GET /api/v1/notifications
- GET /api/v1/notifications/unread-count
- POST /api/v1/notifications/{id}/read
- POST /api/v1/notifications/mark-all-read
- DELETE /api/v1/notifications/{id}

**Activity:**
- GET /api/v1/activity/feed
- GET /api/v1/users/{id}/activity

---

### 4. **Learning Service** (New - Required)
**Port:** 8083  
**Language:** Go  
**Database:** PostgreSQL  
**Purpose:** Educational content management

#### Features:
- Courses management
- Course enrollment
- Progress tracking
- Cheatsheets management
- Projects showcase
- Roadmaps
- Practice challenges
- Certifications

#### API Endpoints:
**Courses:**
- GET /api/v1/courses
- GET /api/v1/courses/{id}
- POST /api/v1/courses
- PUT /api/v1/courses/{id}
- DELETE /api/v1/courses/{id}
- POST /api/v1/courses/{id}/enroll
- GET /api/v1/courses/{id}/progress
- POST /api/v1/courses/{id}/complete

**Cheatsheets:**
- GET /api/v1/cheatsheets
- GET /api/v1/cheatsheets/{id}
- POST /api/v1/cheatsheets
- PUT /api/v1/cheatsheets/{id}
- DELETE /api/v1/cheatsheets/{id}
- POST /api/v1/cheatsheets/{id}/download

**Projects:**
- GET /api/v1/projects
- GET /api/v1/projects/{id}
- POST /api/v1/projects
- PUT /api/v1/projects/{id}
- DELETE /api/v1/projects/{id}
- POST /api/v1/projects/{id}/upvote

---

### 5. **Support Service** (New - Required)
**Port:** 8084  
**Language:** Go  
**Database:** PostgreSQL  
**Purpose:** Customer support & moderation

#### Features:
- Support ticket management
- Ticket replies
- Ticket assignment
- Priority management
- Moderation strategies
- Content moderation
- Spam detection

#### API Endpoints:
**Support Tickets:**
- GET /api/v1/support/tickets
- GET /api/v1/support/tickets/{id}
- POST /api/v1/support/tickets
- PUT /api/v1/support/tickets/{id}
- DELETE /api/v1/support/tickets/{id}
- POST /api/v1/support/tickets/{id}/assign
- POST /api/v1/support/tickets/{id}/close
- POST /api/v1/support/tickets/{id}/reopen

**Ticket Replies:**
- GET /api/v1/support/tickets/{id}/replies
- POST /api/v1/support/tickets/{id}/replies

**Moderation:**
- GET /api/v1/moderation/strategies
- POST /api/v1/moderation/strategies
- PUT /api/v1/moderation/strategies/{id}
- DELETE /api/v1/moderation/strategies/{id}
- POST /api/v1/moderation/check

---

### 6. **Search Service** (New - Required)
**Port:** 8085  
**Language:** Go  
**Database:** PostgreSQL + Elasticsearch  
**Purpose:** Full-text search & recommendations

#### Features:
- Full-text search across posts, discussions, courses
- Search suggestions
- Search history
- Trending searches
- Content recommendations
- Similar content discovery

#### API Endpoints:
**Search:**
- GET /api/v1/search
- GET /api/v1/search/suggestions
- GET /api/v1/search/trending
- GET /api/v1/search/history
- POST /api/v1/search/index
- DELETE /api/v1/search/index/{id}

**Recommendations:**
- GET /api/v1/recommendations/posts
- GET /api/v1/recommendations/courses
- GET /api/v1/recommendations/users

---

### 7. **Media Service** (New - Required)
**Port:** 8086  
**Language:** Go  
**Storage:** S3-compatible (MinIO/AWS S3)  
**Purpose:** File upload & media management

#### Features:
- Image upload & optimization
- File storage
- Image resizing
- Thumbnail generation
- CDN integration
- Media library management

#### API Endpoints:
**Media:**
- POST /api/v1/media/upload
- GET /api/v1/media
- GET /api/v1/media/{id}
- DELETE /api/v1/media/{id}
- POST /api/v1/media/{id}/optimize
- GET /api/v1/media/{id}/variants

---

### 8. **Analytics Service** (New - Required)
**Port:** 8087  
**Language:** Go  
**Database:** PostgreSQL + TimescaleDB  
**Purpose:** Analytics & reporting

#### Features:
- Page view tracking
- User engagement metrics
- Content performance
- Tenant statistics
- Real-time analytics
- Custom reports
- Export functionality

#### API Endpoints:
**Analytics:**
- POST /api/v1/analytics/track
- GET /api/v1/analytics/posts/{id}
- GET /api/v1/analytics/users/{id}
- GET /api/v1/analytics/tenants/{id}
- GET /api/v1/analytics/dashboard
- GET /api/v1/analytics/reports
- POST /api/v1/analytics/reports/export

---

### 9. **Notification Service** (New - Required)
**Port:** 8088  
**Language:** Go  
**Queue:** RabbitMQ  
**Email:** SMTP/SendGrid  
**Purpose:** Notifications & email delivery

#### Features:
- Email notifications
- In-app notifications
- Push notifications (future)
- Email templates
- Notification preferences
- Batch email sending
- Email verification
- Password reset emails

#### API Endpoints:
**Notifications:**
- POST /api/v1/notifications/send
- POST /api/v1/notifications/email
- GET /api/v1/notifications/templates
- POST /api/v1/notifications/templates
- PUT /api/v1/notifications/templates/{id}

**Preferences:**
- GET /api/v1/users/{id}/notification-preferences
- PUT /api/v1/users/{id}/notification-preferences

---

## Infrastructure Components

### Database Layer
- **PostgreSQL**: Primary database for all services
- **Redis**: Caching layer for frequently accessed data
- **Elasticsearch**: Full-text search indexing (optional, can use PostgreSQL FTS)
- **TimescaleDB**: Time-series data for analytics (extension of PostgreSQL)

### Message Queue
- **RabbitMQ**: Event-driven communication between services
  - Post published events
  - Comment created events
  - User activity events
  - Notification events

### Storage
- **MinIO/S3**: Object storage for media files
- **CDN**: Content delivery for static assets

### Monitoring & Logging
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **ELK Stack**: Centralized logging (Elasticsearch, Logstash, Kibana)
- **Jaeger**: Distributed tracing

### API Gateway
- **Nginx**: Reverse proxy & load balancer
- **Kong/Traefik**: API gateway with rate limiting, authentication

---

## Service Communication

### Synchronous (HTTP/REST)
- Client → Services: REST API calls
- Service → Service: REST API calls for immediate responses

### Asynchronous (Events)
- Post published → Notification Service (send email to followers)
- Comment created → Notification Service (notify post author)
- User registered → Email Service (send verification email)
- Post viewed → Analytics Service (track view)

---

## Security

### Authentication
- JWT tokens for API authentication
- OAuth 2.0 for social login
- API keys for developer access

### Authorization
- Role-based access control (RBAC)
- Permission-based access
- Tenant isolation

### Data Protection
- Encryption at rest
- Encryption in transit (TLS/SSL)
- Password hashing (bcrypt)
- SQL injection prevention
- XSS protection
- CSRF protection

---

## Deployment Strategy

### Development
- Docker Compose for local development
- Hot reload for rapid development

### Staging
- Kubernetes cluster
- Separate namespace per environment
- CI/CD pipeline with automated testing

### Production
- Kubernetes cluster with auto-scaling
- Multi-region deployment
- Blue-green deployment
- Automated backups
- Disaster recovery plan

---

## Summary of Required Services

| Service | Status | Priority | Complexity |
|---------|--------|----------|------------|
| Cortex (Core) | ✅ Exists | High | Medium |
| Postal (Posts) | ✅ Exists | High | Medium |
| Community | 🔴 New | High | High |
| Learning | 🔴 New | Medium | Medium |
| Support | 🔴 New | Medium | Low |
| Search | 🔴 New | Medium | High |
| Media | 🔴 New | High | Medium |
| Analytics | 🔴 New | Low | Medium |
| Notification | 🔴 New | High | Medium |

**Total Services:** 9 microservices
**Existing:** 2 services (Cortex, Postal)
**New Required:** 7 services

---

## Development Roadmap

### Phase 1: Core Features (Weeks 1-4)
1. Enhance Cortex with user follows and OAuth
2. Enhance Postal with likes and bookmarks
3. Build Community Service (comments, discussions)
4. Build Media Service (file uploads)

### Phase 2: Learning & Support (Weeks 5-8)
5. Build Learning Service (courses, cheatsheets, projects)
6. Build Support Service (tickets, moderation)
7. Build Notification Service (emails, in-app)

### Phase 3: Advanced Features (Weeks 9-12)
8. Build Search Service (full-text search)
9. Build Analytics Service (tracking, reporting)
10. Implement real-time features (WebSockets)
11. Performance optimization & caching

### Phase 4: Polish & Scale (Weeks 13-16)
12. Security hardening
13. Load testing & optimization
14. Documentation & API specs
15. Monitoring & alerting setup
