# 00 | Platform Overview & Feature Matrix

## Executive Summary

**BGCE Archive** is a comprehensive developer learning and collaboration platform that combines the best features of:
- **Kaggle**: Competitions, datasets, notebooks, leaderboards
- **Educative**: Interactive courses, hands-on labs, learning paths
- **Udemy**: Course marketplace, creator monetization
- **LeetCode**: Coding challenges, interview prep
- **Dev.to**: Community discussions, knowledge sharing
- **HackerRank**: Skills assessment, job matching

**Current Status**: Foundation phase - Core infrastructure (20%) complete, building out full feature set.

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BGCE Archive Platform                         │
│          "The All-in-One Developer Learning Ecosystem"           │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌──────▼──────┐
│  Learn & Grow  │   │ Practice & Build │   │ Earn & Share│
├────────────────┤   ├─────────────────┤   ├─────────────┤
│• Courses       │   │• Competitions   │   │• Marketplace│
│• Tutorials     │   │• Challenges     │   │• Consulting │
│• Cheatsheets   │   │• Projects       │   │• Prizes     │
│• Roadmaps      │   │• Sandboxes      │   │• Jobs       │
│• Cloud Labs    │   │• Benchmarks     │   │• Datasets   │
└────────────────┘   └─────────────────┘   └─────────────┘
```

---

## Complete Feature Matrix

### ✅ Implemented Features (20%)

| Feature | Status | Service | Frontend | Backend |
|---------|--------|---------|----------|---------|
| User Authentication | ✅ Complete | Cortex | ✅ | ✅ |
| User Profiles | ✅ Complete | Cortex | ✅ | ✅ |
| Multi-Tenant | ✅ Complete | Cortex | ✅ | ✅ |
| Categories | ✅ Complete | Cortex | ✅ | ✅ |
| Posts/Blogs | ✅ Complete | Postal | ✅ | ✅ |
| Post Versioning | ✅ Complete | Postal | ⚠️ | ✅ |
| Admin Dashboard | ✅ Complete | - | ✅ | - |

### 🔴 In Development / Planned (80%)

#### Learning & Education
| Feature | Priority | Service | Status | Notes |
|---------|----------|---------|--------|-------|
| **Courses** | HIGH | Learning | 🔴 | Educative-style interactive courses |
| **Learning Paths** | HIGH | Learning | 🔴 | Personalized roadmaps |
| **Cheatsheets** | MEDIUM | Learning | 🔴 | Quick reference guides |
| **Cloud Labs** | MEDIUM | Sandbox | 🔴 | Browser-based coding environments |
| **Certifications** | LOW | Learning | 🔴 | Skill verification |

#### Practice & Challenges
| Feature | Priority | Service | Status | Notes |
|---------|----------|---------|--------|-------|
| **Coding Challenges** | HIGH | Competition | 🔴 | LeetCode-style problems |
| **Competitions** | HIGH | Competition | 🔴 | Kaggle-style contests with prizes |
| **Mock Interviews** | MEDIUM | Interview | 🔴 | Technical interview practice |
| **Benchmarks** | LOW | Analytics | 🔴 | Performance comparisons |

#### Community & Social
| Feature | Priority | Service | Status | Notes |
|---------|----------|---------|--------|-------|
| **Discussions** | HIGH | Community | 🔴 | Forum-style Q&A |
| **Comments** | HIGH | Community | 🔴 | Post/course comments |
| **Likes/Reactions** | MEDIUM | Community | 🔴 | Engagement system |
| **User Follows** | MEDIUM | Community | 🔴 | Social graph |
| **Notifications** | HIGH | Notification | 🔴 | In-app + email |

#### Content & Resources
| Feature | Priority | Service | Status | Notes |
|---------|----------|---------|--------|-------|
| **Projects Showcase** | MEDIUM | Portfolio | 🔴 | GitHub integration |
| **Datasets** | MEDIUM | Dataset | 🔴 | Kaggle-style data sharing |
| **AI Models** | LOW | Model | 🔴 | Pre-trained model hub |
| **Newsletter** | LOW | Newsletter | 🔴 | Email campaigns |

#### Career & Monetization
| Feature | Priority | Service | Status | Notes |
|---------|----------|---------|--------|-------|
| **Job Board** | MEDIUM | Jobs | 🔴 | Get hired feature |
| **Course Marketplace** | HIGH | Learning | 🔴 | Creator monetization |
| **Consulting** | MEDIUM | Marketplace | 🔴 | 1-on-1 mentorship |
| **Competition Prizes** | HIGH | Competition | 🔴 | Cash rewards |

#### Infrastructure
| Feature | Priority | Service | Status | Notes |
|---------|----------|---------|--------|-------|
| **Search** | HIGH | Search | 🔴 | Full-text search |
| **Media Upload** | HIGH | Media | 🔴 | File management |
| **Analytics** | MEDIUM | Analytics | 🔴 | Usage tracking |
| **Support Tickets** | MEDIUM | Support | 🔴 | Customer support |

---

## Service Architecture

### Current Services (2)
1. **Cortex** (Port 8080) - User management, auth, categories, tenants
2. **Postal** (Port 8081) - Posts, articles, versioning

### Required Services (13)
3. **Community** (Port 8082) - Comments, discussions, social features
4. **Learning** (Port 8083) - Courses, learning paths, progress tracking
5. **Competition** (Port 8089) - Coding challenges, contests, leaderboards
6. **Sandbox** (Port 8090) - Cloud labs, code execution environments
7. **Interview** (Port 8091) - Mock interviews, assessment
8. **Portfolio** (Port 8092) - Project showcase, GitHub integration
9. **Dataset** (Port 8093) - Dataset hosting, sharing, licensing
10. **Model** (Port 8094) - AI model hub, templates
11. **Jobs** (Port 8095) - Job board, applications, matching
12. **Newsletter** (Port 8096) - Email campaigns, subscriptions
13. **Media** (Port 8086) - File uploads, CDN
14. **Search** (Port 8085) - Full-text search, recommendations
15. **Notification** (Port 8088) - Email, in-app notifications

**Total**: 15 microservices (2 complete, 13 needed)

---

## Technology Stack

### Backend
- **Language**: Go 1.24
- **Frameworks**: Standard library, Ent ORM, GORM
- **Database**: PostgreSQL 14+ with pgvector
- **Cache**: Redis 6+
- **Queue**: RabbitMQ 3.9+
- **Search**: PostgreSQL FTS or Meilisearch
- **Storage**: MinIO/S3

### Frontend
- **Client**: Next.js 16, React 19, TypeScript
- **Admin**: Vue 3, TypeScript, Pinia
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI (Client), Reka UI (Admin)

### Infrastructure
- **Containers**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack

---

## Database Schema Summary

### Total Tables: 45+

**Core** (6): users, tenants, categories, posts, post_versions, tags  
**Community** (7): comments, discussions, replies, likes, follows, notifications, bookmarks  
**Learning** (8): courses, course_modules, course_enrollments, cheatsheets, learning_paths, certifications  
**Competition** (8): competitions, participants, submissions, leaderboards, test_cases, datasets  
**Career** (5): jobs, applications, portfolios, projects, skills  
**AI/ML** (4): ai_conversations, ai_messages, code_reviews, models  
**System** (7): media_files, search_index, activity_logs, support_tickets, newsletters, analytics

---

## Development Roadmap

### Phase 1: Foundation (Complete - 20%)
- ✅ User authentication & authorization
- ✅ Multi-tenant architecture
- ✅ Content management (posts)
- ✅ Admin dashboard
- ✅ Category system

### Phase 2: Community & Learning (Months 1-4 - 40%)
- 🔴 Community Service (comments, discussions)
- 🔴 Learning Service (courses, paths)
- 🔴 Media Service (uploads)
- 🔴 Search Service
- 🔴 Notification Service

### Phase 3: Practice & Compete (Months 5-8 - 60%)
- 🔴 Competition Service (challenges, contests)
- 🔴 Sandbox Service (cloud labs)
- 🔴 Interview Service (mock interviews)
- 🔴 Dataset Service

### Phase 4: Career & Monetization (Months 9-12 - 80%)
- 🔴 Jobs Service (job board)
- 🔴 Portfolio Service (projects)
- 🔴 Marketplace features
- 🔴 Model Service (AI hub)

### Phase 5: Scale & AI (Months 13-16 - 100%)
- 🔴 AI-powered features (RAG, code review)
- 🔴 Advanced analytics
- 🔴 Newsletter service
- 🔴 Performance optimization
- 🔴 Production deployment

---

## Success Metrics

### User Engagement
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- Average session duration
- Course completion rate
- Challenge completion rate
- Competition participation rate

### Content Metrics
- Total courses published
- Total challenges solved
- Total competitions hosted
- Total projects showcased
- Total datasets shared

### Revenue Metrics
- Monthly Recurring Revenue (MRR)
- Course sales
- Competition hosting fees
- Job board revenue
- Consulting marketplace GMV

### Community Metrics
- Discussion posts
- Comments per post
- User follows
- Content upvotes
- Active creators

---

## Competitive Positioning

| Feature | BGCE | Kaggle | Educative | Udemy | LeetCode | Dev.to |
|---------|------|--------|-----------|-------|----------|--------|
| Courses | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Competitions | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Challenges | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Community | ✅ | ⚠️ | ❌ | ⚠️ | ⚠️ | ✅ |
| Marketplace | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Cloud Labs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Job Board | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Datasets | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| White-Label | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AI Features | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |

**Legend**: ✅ Full Support | ⚠️ Limited | ❌ Not Available

---

## Unique Value Propositions

1. **All-in-One Platform**: Everything from learning to earning in one place
2. **Multi-Language Support**: Not limited to one programming language
3. **Creator Economics**: 70/30 split (better than Udemy's 50/50)
4. **White-Label**: Enterprise customers can brand their own instance
5. **AI-Powered**: Code review, personalized learning, intelligent search
6. **Community-First**: Built by developers, for developers
7. **Open Ecosystem**: Integrations with GitHub, LinkedIn, job boards

---

## Next Steps

1. **Review & Validate**: Ensure all stakeholders agree on feature priorities
2. **Database Design**: Finalize schema for all 45+ tables
3. **API Design**: Define REST endpoints for all 15 services
4. **Service Development**: Build services in priority order
5. **Frontend Integration**: Connect UI to backend APIs
6. **Testing**: Comprehensive testing at each phase
7. **Launch**: Phased rollout starting with core features

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Status**: Foundation Complete (20%), Building Phase 2  
**Owner**: Product & Engineering Teams
