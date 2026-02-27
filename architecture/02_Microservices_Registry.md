# 02 | Microservices Registry & Architecture

## Architecture Overview

BGCE Archive follows a **microservices architecture** with domain-driven design principles. Each service owns its bounded context, communicates via REST APIs and event-driven messaging, and maintains independent deployment cycles.

**Architecture Pattern**: Hexagonal Architecture (Ports & Adapters)  
**Communication**: Synchronous (REST) + Asynchronous (RabbitMQ)  
**Data Strategy**: Database-per-service with eventual consistency

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway (Nginx/Kong)                      │
│              Rate Limiting • Auth • Load Balancing               │
└────────────┬────────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────────┐   ┌───▼────────┐
│  Client    │   │   Admin    │
│  (Next.js) │   │  (Vue.js)  │
│  Port 3000 │   │  Port 5173 │
└────────────┘   └────────────┘
    │                 │
    └────────┬────────┘
             │
    ┌────────▼──────────────────────────────────────────────┐
    │                                                        │
┌───▼──────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Cortex   │  │  Postal  │  │Community │  │ Learning │
│  :8080   │  │  :8081   │  │  :8082   │  │  :8083   │
│ (EXISTS) │  │ (EXISTS) │  │ (NEEDED) │  │ (NEEDED) │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │              │
┌────▼─────┐  ┌───▼──────┐  ┌───▼──────┐  ┌───▼──────┐
│  Media   │  │  Search  │  │ Support  │  │Analytics │
│  :8086   │  │  :8085   │  │  :8084   │  │  :8087   │
│ (NEEDED) │  │ (NEEDED) │  │ (NEEDED) │  │ (NEEDED) │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │              │
     └─────────────┴──────────────┴──────────────┘
                   │
          ┌────────▼────────┐
          │                 │
     ┌────▼────┐      ┌────▼────┐      ┌──────────┐
     │PostgreSQL│      │  Redis  │      │ RabbitMQ │
     │  :5432  │      │  :6379  │      │  :5672   │
     └─────────┘      └─────────┘      └──────────┘
```

---

## Service Registry

### ✅ Existing Services (2)

#### 1. Cortex Service
**Port**: 8080  
**Status**: ✅ Production-ready  
**Language**: Go 1.24  
**Database**: PostgreSQL (Ent ORM)  
**Cache**: Redis

**Responsibilities**:
- User authentication & authorization (JWT)
- User profile management
- Role-based access control (admin, editor, viewer)
- Multi-tenant management (domain-based detection)
- Category & subcategory hierarchy
- Category approval workflow
- Tenant statistics and analytics

**Key Entities**:
- `users` - User accounts with roles
- `tenants` - Multi-tenant instances
- `categories` - Hierarchical content organization

**API Endpoints** (18 total):
```
Auth:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me

Users:
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
POST   /api/v1/users/change-password

Categories:
GET    /api/v1/categories
POST   /api/v1/categories
GET    /api/v1/categories/{uuid}
PUT    /api/v1/categories/{slug}
DELETE /api/v1/categories/{id}
POST   /api/v1/categories/{id}/approve

Subcategories:
GET    /api/v1/sub-categories
POST   /api/v1/sub-categories
GET    /api/v1/sub-categories/{id}
PUT    /api/v1/sub-categories/{id}
DELETE /api/v1/sub-categories/{id}

Tenants:
GET    /api/v1/tenants
GET    /api/v1/tenants/by-domain/{domain}
POST   /api/v1/tenants
PUT    /api/v1/tenants/{id}
DELETE /api/v1/tenants/{id}
```

**Dependencies**:
- PostgreSQL for persistence
- Redis for caching (category lists, user sessions)
- RabbitMQ for event publishing (user.registered, category.approved)

**Deployment**:
- Docker container
- Horizontal scaling supported
- Health check: `GET /health`

---

#### 2. Postal Service
**Port**: 8081  
**Status**: ✅ Production-ready  
**Language**: Go 1.24  
**Database**: PostgreSQL (GORM)  
**Cache**: Redis

**Responsibilities**:
- Post/article CRUD operations
- Post versioning system (track all changes)
- Post status workflow (draft → published → archived)
- Batch operations (bulk upload/delete)
- CSV import for content migration
- View count tracking
- SEO metadata management
- Featured & pinned posts

**Key Entities**:
- `posts` - Blog posts and articles
- `post_versions` - Version history
- `tags` - Content tagging

**API Endpoints** (22 total):
```
Posts:
GET    /api/v1/posts
GET    /api/v1/posts/{id}
GET    /api/v1/posts/slug/{slug}
POST   /api/v1/posts
PUT    /api/v1/posts/{id}
DELETE /api/v1/posts/{id}
POST   /api/v1/posts/batch
DELETE /api/v1/posts/batch

Post Actions:
POST   /api/v1/posts/{id}/publish
POST   /api/v1/posts/{id}/unpublish
POST   /api/v1/posts/{id}/archive
POST   /api/v1/posts/{id}/restore

Post Versions:
GET    /api/v1/posts/{id}/versions
GET    /api/v1/posts/{id}/versions/{version}
POST   /api/v1/posts/{id}/revert/{version}

Tags:
GET    /api/v1/tags
POST   /api/v1/tags
GET    /api/v1/tags/{slug}
PUT    /api/v1/tags/{id}
DELETE /api/v1/tags/{id}
```

**Dependencies**:
- PostgreSQL for persistence
- Redis for caching (post content, tag lists)
- RabbitMQ for event publishing (post.published, post.viewed)

**Deployment**:
- Docker container
- Horizontal scaling supported
- Health check: `GET /health`

---

### 🔴 Required New Services (7)

#### 3. Community Service
**Port**: 8082  
**Status**: 🔴 Not started  
**Priority**: HIGH  
**Complexity**: High  
**Estimated Effort**: 6 weeks

**Responsibilities**:
- Comments on posts (with moderation)
- Discussions/forums (Q&A style)
- Discussion replies (threaded conversations)
- Likes/reactions system (polymorphic)
- User follows (social graph)
- Notifications (in-app + email triggers)
- Activity feed (user timeline)
- Mentions & tagging (@username)

**Key Entities**:
- `comments` - Post comments with moderation status
- `discussions` - Forum topics
- `discussion_replies` - Threaded replies
- `likes` - Polymorphic likes (posts, comments, discussions)
- `follows` - User relationships
- `notifications` - User notifications

**API Endpoints** (35+ total):
```
Comments:
GET    /api/v1/comments
GET    /api/v1/posts/{id}/comments
POST   /api/v1/comments
PUT    /api/v1/comments/{id}
DELETE /api/v1/comments/{id}
POST   /api/v1/comments/{id}/approve
POST   /api/v1/comments/{id}/reject
POST   /api/v1/comments/{id}/like

Discussions:
GET    /api/v1/discussions
GET    /api/v1/discussions/{id}
POST   /api/v1/discussions
PUT    /api/v1/discussions/{id}
DELETE /api/v1/discussions/{id}
POST   /api/v1/discussions/{id}/close
POST   /api/v1/discussions/{id}/upvote

Discussion Replies:
GET    /api/v1/discussions/{id}/replies
POST   /api/v1/discussions/{id}/replies
PUT    /api/v1/replies/{id}
DELETE /api/v1/replies/{id}
POST   /api/v1/replies/{id}/mark-solution

Follows:
POST   /api/v1/users/{id}/follow
DELETE /api/v1/users/{id}/unfollow
GET    /api/v1/users/{id}/followers
GET    /api/v1/users/{id}/following

Notifications:
GET    /api/v1/notifications
GET    /api/v1/notifications/unread-count
POST   /api/v1/notifications/{id}/read
POST   /api/v1/notifications/mark-all-read
DELETE /api/v1/notifications/{id}

Activity:
GET    /api/v1/activity/feed
GET    /api/v1/users/{id}/activity
```

**Event Consumers**:
- `post.published` → Notify followers
- `comment.created` → Notify post author
- `discussion.replied` → Notify discussion participants
- `user.mentioned` → Notify mentioned user

**Event Publishers**:
- `comment.created`
- `discussion.created`
- `like.added`
- `user.followed`

**Technology Stack**:
- Go 1.24 with standard library HTTP
- PostgreSQL (GORM or Ent)
- Redis for caching (notification counts, activity feeds)
- RabbitMQ for event-driven notifications

---

#### 4. Learning Service
**Port**: 8083  
**Status**: 🔴 Not started  
**Priority**: MEDIUM  
**Complexity**: Medium  
**Estimated Effort**: 4 weeks

**Responsibilities**:
- Courses management (CRUD)
- Course enrollment & progress tracking
- Cheatsheets management
- Projects showcase
- Roadmaps (learning paths)
- Practice challenges
- Certifications (future)

**Key Entities**:
- `courses` - Educational courses
- `course_enrollments` - User enrollments
- `course_progress` - Completion tracking
- `cheatsheets` - Quick reference guides
- `projects` - Community projects showcase

**API Endpoints** (25+ total):
```
Courses:
GET    /api/v1/courses
GET    /api/v1/courses/{id}
POST   /api/v1/courses
PUT    /api/v1/courses/{id}
DELETE /api/v1/courses/{id}
POST   /api/v1/courses/{id}/enroll
GET    /api/v1/courses/{id}/progress
POST   /api/v1/courses/{id}/complete
GET    /api/v1/users/{id}/enrolled-courses

Cheatsheets:
GET    /api/v1/cheatsheets
GET    /api/v1/cheatsheets/{id}
POST   /api/v1/cheatsheets
PUT    /api/v1/cheatsheets/{id}
DELETE /api/v1/cheatsheets/{id}
POST   /api/v1/cheatsheets/{id}/download

Projects:
GET    /api/v1/projects
GET    /api/v1/projects/{id}
POST   /api/v1/projects
PUT    /api/v1/projects/{id}
DELETE /api/v1/projects/{id}
POST   /api/v1/projects/{id}/upvote
```

**Event Publishers**:
- `course.enrolled`
- `course.completed`
- `cheatsheet.downloaded`

**Technology Stack**:
- Go 1.24
- PostgreSQL
- Redis for caching (course lists, popular projects)

---

#### 5. Media Service
**Port**: 8086  
**Status**: 🔴 Not started  
**Priority**: HIGH  
**Complexity**: Medium  
**Estimated Effort**: 3 weeks

**Responsibilities**:
- File upload (images, PDFs, videos)
- Image optimization & resizing
- Thumbnail generation
- CDN integration
- Media library management
- Storage quota enforcement

**Key Entities**:
- `media_files` - File metadata and URLs

**API Endpoints** (10+ total):
```
Media:
POST   /api/v1/media/upload
GET    /api/v1/media
GET    /api/v1/media/{id}
DELETE /api/v1/media/{id}
POST   /api/v1/media/{id}/optimize
GET    /api/v1/media/{id}/variants
GET    /api/v1/users/{id}/media
```

**Storage**:
- S3-compatible storage (MinIO or AWS S3)
- CDN: CloudFlare or AWS CloudFront

**Technology Stack**:
- Go 1.24
- PostgreSQL for metadata
- MinIO/S3 for object storage
- Image processing: `imaging` library

---

#### 6. Search Service
**Port**: 8085  
**Status**: 🔴 Not started  
**Priority**: MEDIUM  
**Complexity**: High  
**Estimated Effort**: 5 weeks

**Responsibilities**:
- Full-text search across posts, discussions, courses
- Search suggestions (autocomplete)
- Search history per user
- Trending searches
- Content recommendations (collaborative filtering)
- Similar content discovery

**Key Entities**:
- `search_index` - Full-text search index
- `search_history` - User search queries

**API Endpoints** (12+ total):
```
Search:
GET    /api/v1/search
GET    /api/v1/search/suggestions
GET    /api/v1/search/trending
GET    /api/v1/search/history
POST   /api/v1/search/index
DELETE /api/v1/search/index/{id}

Recommendations:
GET    /api/v1/recommendations/posts
GET    /api/v1/recommendations/courses
GET    /api/v1/recommendations/users
```

**Search Engine Options**:
1. **PostgreSQL Full-Text Search** (simple, no extra infrastructure)
2. **Elasticsearch** (powerful, requires separate cluster)
3. **Meilisearch** (fast, developer-friendly)

**Recommendation**: Start with PostgreSQL FTS, migrate to Meilisearch if needed.

**Technology Stack**:
- Go 1.24
- PostgreSQL with `tsvector` for full-text search
- Redis for caching (search results, trending queries)

---

#### 7. Support Service
**Port**: 8084  
**Status**: 🔴 Not started  
**Priority**: MEDIUM  
**Complexity**: Low  
**Estimated Effort**: 2 weeks

**Responsibilities**:
- Support ticket management
- Ticket replies (conversation threads)
- Ticket assignment to staff
- Priority management
- Moderation strategies (keyword filters, AI moderation)
- Content moderation workflow

**Key Entities**:
- `support_tickets` - Customer support tickets
- `support_ticket_replies` - Ticket conversations
- `moderation_strategies` - Automated moderation rules

**API Endpoints** (15+ total):
```
Support Tickets:
GET    /api/v1/support/tickets
GET    /api/v1/support/tickets/{id}
POST   /api/v1/support/tickets
PUT    /api/v1/support/tickets/{id}
DELETE /api/v1/support/tickets/{id}
POST   /api/v1/support/tickets/{id}/assign
POST   /api/v1/support/tickets/{id}/close
POST   /api/v1/support/tickets/{id}/reopen

Ticket Replies:
GET    /api/v1/support/tickets/{id}/replies
POST   /api/v1/support/tickets/{id}/replies

Moderation:
GET    /api/v1/moderation/strategies
POST   /api/v1/moderation/strategies
PUT    /api/v1/moderation/strategies/{id}
DELETE /api/v1/moderation/strategies/{id}
POST   /api/v1/moderation/check
```

**Technology Stack**:
- Go 1.24
- PostgreSQL
- Redis for caching (ticket counts, moderation rules)

---

#### 8. Analytics Service
**Port**: 8087  
**Status**: 🔴 Not started  
**Priority**: LOW  
**Complexity**: Medium  
**Estimated Effort**: 4 weeks

**Responsibilities**:
- Page view tracking
- User engagement metrics
- Content performance analytics
- Tenant statistics
- Real-time dashboards
- Custom reports
- Export functionality (CSV, PDF)

**Key Entities**:
- `post_views` - View tracking
- `tenant_stats` - Daily aggregated statistics
- `activity_logs` - Audit trail

**API Endpoints** (12+ total):
```
Analytics:
POST   /api/v1/analytics/track
GET    /api/v1/analytics/posts/{id}
GET    /api/v1/analytics/users/{id}
GET    /api/v1/analytics/tenants/{id}
GET    /api/v1/analytics/dashboard
GET    /api/v1/analytics/reports
POST   /api/v1/analytics/reports/export
```

**Technology Stack**:
- Go 1.24
- PostgreSQL with TimescaleDB extension (time-series data)
- Redis for caching (dashboard metrics)

---

#### 9. Notification Service
**Port**: 8088  
**Status**: 🔴 Not started (partially handled by Community Service)  
**Priority**: HIGH  
**Complexity**: Medium  
**Estimated Effort**: 3 weeks

**Responsibilities**:
- Email notifications (transactional)
- Email templates management
- Notification preferences per user
- Batch email sending
- Email verification
- Password reset emails
- Digest emails (weekly summaries)

**API Endpoints** (10+ total):
```
Notifications:
POST   /api/v1/notifications/send
POST   /api/v1/notifications/email
GET    /api/v1/notifications/templates
POST   /api/v1/notifications/templates
PUT    /api/v1/notifications/templates/{id}

Preferences:
GET    /api/v1/users/{id}/notification-preferences
PUT    /api/v1/users/{id}/notification-preferences
```

**Event Consumers**:
- `user.registered` → Send welcome email
- `comment.created` → Notify post author
- `post.published` → Notify followers
- `course.enrolled` → Send confirmation email

**Email Provider Options**:
- SendGrid (recommended)
- AWS SES
- Mailgun
- Postmark

**Technology Stack**:
- Go 1.24
- PostgreSQL for templates and preferences
- RabbitMQ for event consumption
- SendGrid API for email delivery

---

## Communication Patterns

### Synchronous Communication (REST)

**Client → Services**:
- All frontend requests use REST APIs
- JWT authentication in `Authorization` header
- Standard HTTP status codes

**Service → Service**:
- Direct REST calls for immediate responses
- Example: Postal calls Cortex to validate user permissions

**Best Practices**:
- Use circuit breakers (e.g., `gobreaker` library)
- Implement timeouts (5-10 seconds)
- Retry with exponential backoff
- Cache responses when possible

---

### Asynchronous Communication (Events)

**Event-Driven Architecture via RabbitMQ**:

**Exchange Types**:
- `topic` exchange for routing by event type
- Routing key pattern: `{service}.{entity}.{action}`
- Example: `postal.post.published`, `cortex.user.registered`

**Event Flow Examples**:

**1. Post Published**:
```
Postal Service → RabbitMQ (postal.post.published)
    ↓
Community Service (notify followers)
Analytics Service (track publication)
Search Service (index content)
```

**2. User Registered**:
```
Cortex Service → RabbitMQ (cortex.user.registered)
    ↓
Notification Service (send welcome email)
Analytics Service (track new user)
```

**3. Comment Created**:
```
Community Service → RabbitMQ (community.comment.created)
    ↓
Notification Service (notify post author)
Postal Service (increment comment count)
```

**Event Schema** (JSON):
```json
{
  "event_id": "uuid",
  "event_type": "postal.post.published",
  "timestamp": "2026-02-27T10:00:00Z",
  "tenant_id": 1,
  "user_id": 42,
  "payload": {
    "post_id": 123,
    "title": "Understanding Go Channels",
    "slug": "understanding-go-channels"
  }
}
```

**Best Practices**:
- Idempotent event handlers (handle duplicates)
- Dead letter queues for failed events
- Event versioning for schema evolution
- Monitoring and alerting on queue depth

---

## Service Dependencies

### Dependency Matrix

| Service | Depends On | Publishes Events | Consumes Events |
|---------|-----------|------------------|-----------------|
| **Cortex** | PostgreSQL, Redis | user.*, tenant.*, category.* | - |
| **Postal** | PostgreSQL, Redis | post.*, tag.* | - |
| **Community** | PostgreSQL, Redis | comment.*, discussion.*, like.* | post.published, user.registered |
| **Learning** | PostgreSQL, Redis | course.*, cheatsheet.* | user.registered |
| **Media** | PostgreSQL, S3, Redis | media.* | - |
| **Search** | PostgreSQL, Redis | - | post.*, discussion.*, course.* |
| **Support** | PostgreSQL, Redis | ticket.* | - |
| **Analytics** | PostgreSQL (TimescaleDB), Redis | - | *.* (all events) |
| **Notification** | PostgreSQL, RabbitMQ, SendGrid | - | user.*, comment.*, post.*, course.* |

---

## Deployment Strategy

### Development Environment
- Docker Compose for local development
- All services run on localhost with different ports
- Shared PostgreSQL, Redis, RabbitMQ instances

### Staging Environment
- Kubernetes cluster (single namespace)
- Separate database per service
- Shared Redis and RabbitMQ clusters
- CI/CD pipeline with automated testing

### Production Environment
- Kubernetes cluster (multi-region)
- Horizontal pod autoscaling (HPA)
- Database read replicas for scaling
- Redis cluster mode
- RabbitMQ cluster with mirrored queues
- CDN for static assets
- Load balancer with SSL termination

**Deployment Tools**:
- Kubernetes (orchestration)
- Helm (package management)
- ArgoCD (GitOps)
- Prometheus + Grafana (monitoring)
- ELK Stack (logging)

---

## Service Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- ✅ Cortex Service (complete)
- ✅ Postal Service (complete)
- 🔴 Media Service (new)
- 🔴 Notification Service (new)

### Phase 2: Community (Weeks 5-8)
- 🔴 Community Service (new)
- 🔴 Search Service (new)

### Phase 3: Learning & Support (Weeks 9-12)
- 🔴 Learning Service (new)
- 🔴 Support Service (new)

### Phase 4: Analytics & Polish (Weeks 13-16)
- 🔴 Analytics Service (new)
- Performance optimization
- Security hardening
- Production deployment

---

## Technology Stack Summary

### Backend Services
- **Language**: Go 1.24
- **HTTP Framework**: Standard library `net/http`
- **ORM**: Ent (Cortex), GORM (Postal, others)
- **Validation**: `go-playground/validator`
- **JWT**: `golang-jwt/jwt`

### Infrastructure
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Message Queue**: RabbitMQ 3.9+
- **Object Storage**: MinIO or AWS S3
- **Search**: PostgreSQL FTS or Meilisearch

### Frontend
- **Client**: Next.js 16, React 19, TypeScript
- **Admin**: Vue 3, TypeScript, Pinia
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (Client), Reka UI (Admin)

### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger

---

## Conclusion

The BGCE Archive microservices architecture provides:
- **Scalability**: Independent scaling per service
- **Resilience**: Failure isolation and circuit breakers
- **Maintainability**: Clear service boundaries
- **Flexibility**: Technology choices per service
- **Team Autonomy**: Independent development and deployment

**Current Status**: 2/9 services complete (22%)  
**Next Priority**: Media Service → Community Service → Notification Service

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Owner**: Engineering Team
