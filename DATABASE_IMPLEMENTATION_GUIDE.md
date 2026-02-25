# BGCE Archive - Database Implementation Guide

## Quick Start

### 1. View the Database Schema
Copy the contents of `database_schema.dbml` and paste it into [dbdiagram.io](https://dbdiagram.io/d) to visualize the complete database schema.

### 2. Database Overview

**Total Tables:** 28 tables
**Normalization:** 1NF, 2NF, 3NF compliant
**Database Engine:** PostgreSQL 14+

---

## Database Structure

### Core Tables (6)
1. **tenants** - Multi-tenant support
2. **users** - User accounts and authentication
3. **categories** - Content categorization (hierarchical)
4. **posts** - Blog posts/articles
5. **post_versions** - Version history
6. **tags** - Content tagging

### Community Tables (7)
7. **comments** - Post comments with moderation
8. **discussions** - Forum-style discussions
9. **discussion_replies** - Discussion responses
10. **likes** - Universal like system (polymorphic)
11. **bookmarks** - User bookmarks
12. **follows** - User follow relationships
13. **post_tags** - Many-to-many post-tag relationship

### Support & Moderation Tables (3)
14. **support_tickets** - Customer support
15. **support_ticket_replies** - Ticket responses
16. **moderation_strategies** - Content moderation rules

### Learning Resources Tables (3)
17. **courses** - Educational courses
18. **cheatsheets** - Quick reference guides
19. **projects** - User project showcase

### System Tables (5)
20. **notifications** - User notifications
21. **activity_logs** - Audit trail
22. **post_views** - View tracking
23. **tenant_stats** - Analytics aggregation
24. **media_files** - File management

### Search & Indexing (2)
25. **search_index** - Full-text search
26. **post_tags** - Tag relationships

---

## Key Relationships

### User Relationships
- User → Posts (created_by, updated_by)
- User → Comments (user_id)
- User → Discussions (user_id)
- User → Follows (follower_id, following_id)
- User → Bookmarks (user_id)
- User → Likes (user_id)

### Content Relationships
- Post → Category (category_id)
- Post → Subcategory (sub_category_id)
- Post → Comments (post_id)
- Post → PostVersions (post_id)
- Post → Tags (through post_tags)
- Post → Likes (polymorphic)
- Post → Bookmarks (post_id)

### Tenant Relationships
- Tenant → Users (tenant_id)
- Tenant → Categories (tenant_id)
- Tenant → Posts (tenant_id)
- Tenant → Comments (tenant_id)
- Tenant → All content (multi-tenant isolation)

---

## Database Features

### 1. Multi-Tenancy
- Every major table has `tenant_id` for data isolation
- Domain-based tenant detection
- Tenant-specific settings and metadata

### 2. Soft Deletes
- Posts, comments, discussions use `deleted_at` timestamp
- Allows data recovery and audit trails
- Maintains referential integrity

### 3. Status Workflows
- **Posts**: draft → published → archived → deleted
- **Comments**: pending → approved/rejected/spam
- **Categories**: pending → approved/rejected/deleted
- **Support Tickets**: open → in_progress → resolved → closed

### 4. Audit Trail
- `created_by`, `updated_by`, `deleted_by` fields
- `activity_logs` table for detailed tracking
- Timestamps on all tables

### 5. Polymorphic Relationships
- **Likes**: Can like posts, comments, discussions, replies
- **Search Index**: Indexes posts, discussions, courses, projects
- Flexible and extensible design

### 6. Performance Optimizations
- Strategic indexes on foreign keys
- Composite indexes for common queries
- Denormalized counters (view_count, like_count, etc.)
- Full-text search with tsvector

---

## Migration Strategy

### Phase 1: Core Tables (Week 1)
```sql
-- Create in order:
1. tenants
2. users
3. categories
4. tags
5. posts
6. post_versions
7. post_tags
```

### Phase 2: Community Tables (Week 2)
```sql
8. comments
9. discussions
10. discussion_replies
11. likes
12. bookmarks
13. follows
```

### Phase 3: Support & Learning (Week 3)
```sql
14. support_tickets
15. support_ticket_replies
16. moderation_strategies
17. courses
18. cheatsheets
19. projects
```

### Phase 4: System Tables (Week 4)
```sql
20. notifications
21. activity_logs
22. post_views
23. tenant_stats
24. media_files
25. search_index
```

---

## Indexes Strategy

### High-Priority Indexes (Create First)
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- Post queries
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_tenant_id ON posts(tenant_id);

-- Category lookups
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_tenant_id ON categories(tenant_id);

-- Comment queries
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

### Composite Indexes
```sql
-- Multi-column queries
CREATE INDEX idx_posts_tenant_status ON posts(tenant_id, status);
CREATE INDEX idx_posts_category_status ON posts(category_id, status);
CREATE INDEX idx_comments_post_status ON comments(post_id, status);
CREATE INDEX idx_likes_user_type_id ON likes(user_id, likeable_type, likeable_id);
```

### Full-Text Search
```sql
-- PostgreSQL full-text search
CREATE INDEX idx_search_vector ON search_index USING gin(search_vector);

-- Update trigger for search_vector
CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE
ON search_index FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', title, content);
```

---

## Data Integrity Rules

### Foreign Key Constraints
- All foreign keys use `ON DELETE CASCADE` or `ON DELETE SET NULL`
- Maintain referential integrity across tables
- Prevent orphaned records

### Check Constraints
```sql
-- Email validation
ALTER TABLE users ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Status validation
ALTER TABLE posts ADD CONSTRAINT check_post_status 
CHECK (status IN ('draft', 'published', 'archived', 'deleted'));

-- Rating validation
ALTER TABLE courses ADD CONSTRAINT check_rating_range 
CHECK (rating >= 0 AND rating <= 5);
```

### Unique Constraints
```sql
-- Prevent duplicate follows
ALTER TABLE follows ADD CONSTRAINT unique_follow 
UNIQUE (follower_id, following_id);

-- Prevent duplicate likes
ALTER TABLE likes ADD CONSTRAINT unique_like 
UNIQUE (user_id, likeable_type, likeable_id);

-- Prevent duplicate bookmarks
ALTER TABLE bookmarks ADD CONSTRAINT unique_bookmark 
UNIQUE (user_id, post_id);
```

---

## Sample Queries

### Get Posts with Category and Author
```sql
SELECT 
    p.id, p.title, p.slug, p.content, p.view_count,
    c.label as category_name,
    u.username as author_name,
    COUNT(DISTINCT cm.id) as comment_count,
    COUNT(DISTINCT l.id) as like_count
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON p.created_by = u.id
LEFT JOIN comments cm ON p.id = cm.post_id AND cm.status = 'approved'
LEFT JOIN likes l ON p.id = l.likeable_id AND l.likeable_type = 'post'
WHERE p.status = 'published' 
  AND p.tenant_id = $1
GROUP BY p.id, c.label, u.username
ORDER BY p.published_at DESC
LIMIT 20;
```

### Get User Activity Feed
```sql
SELECT 
    al.action,
    al.entity_type,
    al.entity_id,
    al.created_at,
    u.username,
    u.avatar_url
FROM activity_logs al
JOIN users u ON al.user_id = u.id
WHERE al.user_id IN (
    SELECT following_id FROM follows WHERE follower_id = $1
)
ORDER BY al.created_at DESC
LIMIT 50;
```

### Get Trending Posts
```sql
SELECT 
    p.*,
    COUNT(DISTINCT pv.id) as recent_views,
    COUNT(DISTINCT l.id) as recent_likes,
    COUNT(DISTINCT c.id) as recent_comments
FROM posts p
LEFT JOIN post_views pv ON p.id = pv.post_id 
    AND pv.viewed_at > NOW() - INTERVAL '7 days'
LEFT JOIN likes l ON p.id = l.likeable_id 
    AND l.likeable_type = 'post'
    AND l.created_at > NOW() - INTERVAL '7 days'
LEFT JOIN comments c ON p.id = c.post_id 
    AND c.created_at > NOW() - INTERVAL '7 days'
WHERE p.status = 'published'
GROUP BY p.id
ORDER BY (recent_views + recent_likes * 2 + recent_comments * 3) DESC
LIMIT 10;
```

---

## Backup Strategy

### Daily Backups
```bash
# Full database backup
pg_dump -h localhost -U postgres bgce_archive > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -h localhost -U postgres bgce_archive | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Point-in-Time Recovery
```bash
# Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'
```

### Backup Retention
- Daily backups: Keep for 7 days
- Weekly backups: Keep for 4 weeks
- Monthly backups: Keep for 12 months

---

## Performance Tuning

### PostgreSQL Configuration
```ini
# Memory settings
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
work_mem = 64MB

# Connection settings
max_connections = 200
max_worker_processes = 8

# Query planning
random_page_cost = 1.1  # For SSD
effective_io_concurrency = 200

# Write-ahead log
wal_buffers = 16MB
checkpoint_completion_target = 0.9
```

### Query Optimization
1. Use EXPLAIN ANALYZE for slow queries
2. Add indexes based on query patterns
3. Use materialized views for complex aggregations
4. Implement query result caching in Redis
5. Use connection pooling (PgBouncer)

---

## Monitoring

### Key Metrics to Track
- Query execution time
- Index usage statistics
- Table bloat
- Connection pool usage
- Cache hit ratio
- Replication lag (if using replicas)

### Monitoring Tools
- **pg_stat_statements**: Query performance
- **pgBadger**: Log analysis
- **Prometheus + Grafana**: Metrics visualization
- **pgAdmin**: Database management

---

## Security Checklist

- [ ] Enable SSL/TLS for all connections
- [ ] Use strong passwords for database users
- [ ] Implement row-level security for multi-tenancy
- [ ] Regular security updates
- [ ] Encrypt sensitive data at rest
- [ ] Audit logging enabled
- [ ] Backup encryption
- [ ] Network firewall rules
- [ ] Database user permissions (principle of least privilege)
- [ ] SQL injection prevention (parameterized queries)

---

## Next Steps

1. **Review the Schema**: Open `database_schema.dbml` in dbdiagram.io
2. **Create Migration Files**: Generate SQL migrations from the schema
3. **Set Up Development Database**: Use Docker Compose for local PostgreSQL
4. **Implement Services**: Follow the microservices architecture document
5. **Test Data**: Create seed data for development and testing
6. **Performance Testing**: Load test with realistic data volumes
7. **Documentation**: Document all custom functions and triggers

---

## Support

For questions or issues with the database schema:
1. Review the DBML file for table definitions
2. Check the microservices architecture document
3. Refer to PostgreSQL documentation for specific features
4. Test queries in a development environment first

---

**Last Updated:** 2024
**Schema Version:** 1.0.0
**Database:** PostgreSQL 14+
