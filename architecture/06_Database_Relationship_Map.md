# 06 | Database Relationship Map

## Foreign Key Dependency Analysis

This document visualizes the extensive foreign key relationships in the BGCE Archive schema, demonstrating why a shared database architecture is necessary.

---

## Core Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                         CORE TABLES                              │
│                    (Cortex Service Owns)                         │
│                                                                  │
│  ┌──────────┐      ┌──────────┐      ┌────────────┐           │
│  │ tenants  │◄─────┤  users   │◄─────┤ categories │           │
│  │    (1)   │      │   (2)    │      │    (3)     │           │
│  └──────────┘      └──────────┘      └────────────┘           │
│       ▲                 ▲                   ▲                    │
└───────┼─────────────────┼───────────────────┼──────────────────┘
        │                 │                   │
        │                 │                   │
    ┌───┴─────────────────┴───────────────────┴───┐
    │   EVERY OTHER TABLE REFERENCES THESE!       │
    │   (tenant_id, user_id, category_id)         │
    └─────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐  ┌──────────────┐  ┌──────────────┐
│ CONTENT       │  │ COMMUNITY    │  │ LEARNING     │
│ (Postal)      │  │ (Community)  │  │ (Learning)   │
├───────────────┤  ├──────────────┤  ├──────────────┤
│• posts        │  │• comments    │  │• courses     │
│• post_versions│  │• discussions │  │• enrollments │
│• tags         │  │• likes       │  │• cheatsheets │
└───────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐  ┌──────────────┐  ┌──────────────┐
│ COMPETITION   │  │ CAREER       │  │ SUPPORT      │
│ (Competition) │  │ (Jobs)       │  │ (Support)    │
├───────────────┤  ├──────────────┤  ├──────────────┤
│• competitions │  │• jobs        │  │• tickets     │
│• submissions  │  │• applications│  │• replies     │
│• leaderboards │  │• portfolios  │  │• moderation  │
└───────────────┘  └──────────────┘  └──────────────┘
```

---

## Detailed Foreign Key Relationships

### Level 1: Core Tables (No Dependencies)

```
tenants (id)
└── No foreign keys

users (id)
└── tenant_id → tenants.id

categories (id)
├── tenant_id → tenants.id
├── parent_id → categories.id (self-reference)
└── created_by → users.id
```

### Level 2: Content Domain (Depends on Core)

```
posts (id)
├── tenant_id → tenants.id
├── category_id → categories.id
├── sub_category_id → categories.id
└── created_by → users.id

post_versions (id)
├── post_id → posts.id
└── edited_by → users.id

tags (id)
└── tenant_id → tenants.id

post_tags (id)
├── post_id → posts.id
└── tag_id → tags.id
```

### Level 3: Community Domain (Depends on Core + Content)

```
comments (id)
├── tenant_id → tenants.id
├── post_id → posts.id ◄── CROSS-SERVICE!
├── user_id → users.id
└── parent_id → comments.id (self-reference)

discussions (id)
├── tenant_id → tenants.id
├── user_id → users.id
└── category_id → categories.id

discussion_replies (id)
├── discussion_id → discussions.id
├── user_id → users.id
└── parent_id → discussion_replies.id (self-reference)

likes (id)
├── user_id → users.id
└── likeable_id (polymorphic - posts, comments, discussions)

follows (id)
├── follower_id → users.id
└── following_id → users.id

notifications (id)
└── user_id → users.id
```

### Level 4: Learning Domain (Depends on Core)

```
courses (id)
├── tenant_id → tenants.id
└── instructor_id → users.id

course_modules (id)
└── course_id → courses.id

course_enrollments (id)
├── course_id → courses.id
└── user_id → users.id

cheatsheets (id)
├── tenant_id → tenants.id
└── created_by → users.id

learning_paths (id)
└── user_id → users.id

certifications (id)
├── user_id → users.id
└── course_id → courses.id
```

### Level 5: Competition Domain (Depends on Core)

```
competitions (id)
├── tenant_id → tenants.id
└── created_by → users.id

competition_participants (id)
├── competition_id → competitions.id
└── user_id → users.id

competition_submissions (id)
├── competition_id → competitions.id
└── user_id → users.id

competition_leaderboards (id)
├── competition_id → competitions.id
└── user_id → users.id

competition_test_cases (id)
└── competition_id → competitions.id

coding_challenges (id)
├── tenant_id → tenants.id
└── created_by → users.id

challenge_submissions (id)
├── challenge_id → coding_challenges.id
└── user_id → users.id
```

### Level 6: Career Domain (Depends on Core)

```
jobs (id)
├── tenant_id → tenants.id
└── posted_by → users.id

job_applications (id)
├── job_id → jobs.id
└── user_id → users.id

portfolios (id)
└── user_id → users.id

projects (id)
├── tenant_id → tenants.id
└── user_id → users.id

user_skills (id)
└── user_id → users.id
```

### Level 7: Data Domain (Depends on Core)

```
datasets (id)
├── tenant_id → tenants.id
└── user_id → users.id

models (id)
├── tenant_id → tenants.id
└── user_id → users.id
```

### Level 8: Communication Domain (Depends on Core)

```
newsletters (id)
├── tenant_id → tenants.id
└── created_by → users.id

newsletter_subscriptions (id)
└── user_id → users.id
```

### Level 9: Support Domain (Depends on Core)

```
support_tickets (id)
├── tenant_id → tenants.id
├── user_id → users.id
└── assigned_to → users.id

support_ticket_replies (id)
├── ticket_id → support_tickets.id
└── user_id → users.id

moderation_strategies (id)
└── tenant_id → tenants.id
```

### Level 10: AI Domain (Depends on Core)

```
ai_conversations (id)
├── user_id → users.id
└── tenant_id → tenants.id

ai_messages (id)
└── conversation_id → ai_conversations.id

ai_code_reviews (id)
└── user_id → users.id

content_recommendations (id)
└── user_id → users.id
```

### Level 11: Analytics Domain (Depends on Core + Content)

```
post_views (id)
├── post_id → posts.id ◄── CROSS-SERVICE!
└── user_id → users.id

tenant_stats (id)
└── tenant_id → tenants.id

activity_logs (id)
├── user_id → users.id
└── tenant_id → tenants.id

media_files (id)
├── tenant_id → tenants.id
└── user_id → users.id

search_index (id)
└── tenant_id → tenants.id
```

---

## Cross-Service Foreign Key Summary

### Critical Cross-Service Dependencies

**Community → Postal**:
```sql
comments.post_id → posts.id
```

**Analytics → Postal**:
```sql
post_views.post_id → posts.id
```

**Community → Cortex**:
```sql
discussions.category_id → categories.id
```

**All Services → Cortex**:
```sql
*.tenant_id → tenants.id
*.user_id → users.id
*.created_by → users.id
*.instructor_id → users.id
*.posted_by → users.id
*.assigned_to → users.id
```

---

## Why Database Separation Doesn't Work

### Problem 1: Foreign Key Constraints

If we separate databases:

```
cortex_db:
  - users (id: 1, username: "john")

postal_db:
  - posts (id: 1, created_by: 1) ← Can't enforce FK!
```

**Without FK constraint**:
- ❌ Can insert post with created_by = 999 (non-existent user)
- ❌ Can delete user without cascading to posts
- ❌ No referential integrity guarantee
- ❌ Data corruption risk

### Problem 2: Join Performance

**With shared database**:
```sql
-- Single query, efficient
SELECT p.*, u.username, c.label
FROM posts p
JOIN users u ON p.created_by = u.id
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published';
```

**With separate databases**:
```go
// Multiple network calls, slow
posts := postalDB.GetPosts()
for _, post := range posts {
    user := cortexAPI.GetUser(post.CreatedBy)  // N+1 problem!
    category := cortexAPI.GetCategory(post.CategoryID)
    // Combine data...
}
```

### Problem 3: Transaction Consistency

**Scenario**: User creates a post and gets points

**With shared database**:
```sql
BEGIN;
  INSERT INTO posts (...) VALUES (...);
  UPDATE users SET points = points + 10 WHERE id = 1;
COMMIT;
```
✅ Atomic - both succeed or both fail

**With separate databases**:
```go
// Two separate transactions
postalDB.CreatePost(post)  // Succeeds
cortexDB.AddPoints(userID) // Fails! ← Inconsistent state
```
❌ No atomicity - data inconsistency

---

## Recommended Table Organization

### Physical: Single Database

```sql
-- All tables in one database
CREATE DATABASE bgce_archive;

\c bgce_archive

-- Core tables
CREATE TABLE tenants (...);
CREATE TABLE users (...);
CREATE TABLE categories (...);

-- Content tables
CREATE TABLE posts (...);
CREATE TABLE post_versions (...);

-- Community tables
CREATE TABLE comments (...);
CREATE TABLE discussions (...);

-- ... all other tables
```

### Logical: Service Ownership

```
bgce_archive (database)
│
├── [Cortex owns]
│   ├── tenants
│   ├── users
│   └── categories
│
├── [Postal owns]
│   ├── posts
│   ├── post_versions
│   └── tags
│
├── [Community owns]
│   ├── comments
│   ├── discussions
│   └── likes
│
└── [Other services...]
```

### Access Control: Database Users

```sql
-- Cortex user: Full access to core, read-only elsewhere
CREATE USER cortex_user WITH PASSWORD 'xxx';
GRANT ALL ON tenants, users, categories TO cortex_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cortex_user;

-- Postal user: Full access to content, read-only on core
CREATE USER postal_user WITH PASSWORD 'xxx';
GRANT ALL ON posts, post_versions, tags, post_tags TO postal_user;
GRANT SELECT ON users, categories TO postal_user;

-- Community user: Full access to community, read-only elsewhere
CREATE USER community_user WITH PASSWORD 'xxx';
GRANT ALL ON comments, discussions, discussion_replies, likes, follows, notifications TO community_user;
GRANT SELECT ON users, posts, categories TO community_user;
```

---

## Migration Dependency Order

When running migrations, follow this order to respect foreign key dependencies:

```
1. Core Domain (Cortex)
   ├── 000001_create_tenants.sql
   ├── 000002_create_users.sql
   └── 000003_create_categories.sql

2. Content Domain (Postal)
   ├── 000001_create_posts.sql
   ├── 000002_create_post_versions.sql
   ├── 000003_create_tags.sql
   └── 000004_create_post_tags.sql

3. Community Domain (Community)
   ├── 000001_create_comments.sql
   ├── 000002_create_discussions.sql
   ├── 000003_create_discussion_replies.sql
   ├── 000004_create_likes.sql
   ├── 000005_create_follows.sql
   └── 000006_create_notifications.sql

4. Learning Domain (Learning)
   ├── 000001_create_courses.sql
   ├── 000002_create_course_modules.sql
   ├── 000003_create_course_enrollments.sql
   ├── 000004_create_cheatsheets.sql
   ├── 000005_create_learning_paths.sql
   └── 000006_create_certifications.sql

5. Competition Domain (Competition)
   ├── 000001_create_competitions.sql
   ├── 000002_create_competition_participants.sql
   ├── 000003_create_competition_submissions.sql
   ├── 000004_create_competition_leaderboards.sql
   ├── 000005_create_competition_test_cases.sql
   ├── 000006_create_coding_challenges.sql
   └── 000007_create_challenge_submissions.sql

6. Career Domain (Jobs/Portfolio)
   ├── 000001_create_jobs.sql
   ├── 000002_create_job_applications.sql
   ├── 000003_create_portfolios.sql
   ├── 000004_create_projects.sql
   └── 000005_create_user_skills.sql

7. Data Domain (Dataset/Model)
   ├── 000001_create_datasets.sql
   └── 000002_create_models.sql

8. Communication Domain (Newsletter)
   ├── 000001_create_newsletters.sql
   └── 000002_create_newsletter_subscriptions.sql

9. Support Domain (Support)
   ├── 000001_create_support_tickets.sql
   ├── 000002_create_support_ticket_replies.sql
   └── 000003_create_moderation_strategies.sql

10. AI Domain (AI)
    ├── 000001_create_ai_conversations.sql
    ├── 000002_create_ai_messages.sql
    ├── 000003_create_ai_code_reviews.sql
    └── 000004_create_content_recommendations.sql

11. Analytics Domain (Analytics)
    ├── 000001_create_post_views.sql
    ├── 000002_create_tenant_stats.sql
    ├── 000003_create_activity_logs.sql
    ├── 000004_create_media_files.sql
    └── 000005_create_search_index.sql
```

---

## Conclusion

**The BGCE Archive schema has 50+ tables with extensive foreign key relationships:**

- ✅ **3 core tables** (tenants, users, categories) referenced by **47+ other tables**
- ✅ **Cross-service foreign keys** (comments → posts, discussions → categories)
- ✅ **Polymorphic relationships** (likes can reference posts, comments, discussions)
- ✅ **Self-referencing relationships** (categories.parent_id, comments.parent_id)

**This level of relational coupling makes database separation impractical.**

**Recommended approach**: Single PostgreSQL database with logical service boundaries, enforced through:
- Database user permissions
- API boundaries for write operations
- Direct database joins for read operations
- Event-driven cache invalidation

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Owner**: Engineering Team  
**Purpose**: Justify shared database architecture decision
