**comprehensive and detailed RBAC permission list** Golang Community Vault platform. This will allow **fine-grained control** for various roles across all the directories and content types outlined in README.

---

## 🔒 Universal Permission Categories (Applicable to all modules)

| Permission            | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `view:<resource>`     | Can view/read the resource (public or restricted)           |
| `create:<resource>`   | Can create/upload new items                                 |
| `edit:<resource>`     | Can update or modify existing items                         |
| `delete:<resource>`   | Can remove an item                                          |
| `publish:<resource>`  | Can mark content as published (if there’s a review process) |
| `archive:<resource>`  | Can archive or unpublish without deletion                   |
| `feature:<resource>`  | Can mark content as featured                                |
| `comment:<resource>`  | Can comment on resource                                     |
| `moderate:<resource>` | Can manage others' comments and discussions                 |
| `rate:<resource>`     | Can give rating (if rating system exists)                   |
| `tag:<resource>`      | Can add/edit tags or metadata                               |
| `assign:<resource>`   | Can assign reviewers or contributors to a resource          |

---

## 🔖 Resource-Specific Permissions

Here's a breakdown by directory and subtype:

---

### 1. `interview-qa/`

| Permission                  | Applies to                                                 |
| --------------------------- | ---------------------------------------------------------- |
| `curate:interview_qa`       | Can organize, categorize, and reorder Q&A content          |
| `bulk_upload:interview_qa`  | Upload multiple Q&As via CSV or UI                         |
| `label:difficulty_level`    | Can assign difficulty labels (easy/med/hard)               |
| `verify:interview_qa`       | Trusted users can verify accuracy of Q&A                   |
| `suggest_edit:interview_qa` | Submit Q&A revisions for approval                          |
| `link:qa_to_topic`          | Link questions across topic-wise and company-wise sections |

---

### 2. `class-notes/`

| Permission             | Applies to                               |
| ---------------------- | ---------------------------------------- |
| `format:class_note`    | Format content (LaTeX, markdown support) |
| `translate:class_note` | Upload alternate language versions       |
| `rate:note_quality`    | Rate based on helpfulness/accuracy       |
| `submit_note_review`   | Peer review notes                        |
| `merge_notes`          | Combine similar notes into one resource  |

---

### 3. `project-archive/`

| Permission               | Applies to                                         |
| ------------------------ | -------------------------------------------------- |
| `link:project_github`    | Attach GitHub repo link                            |
| `mark:project_stable`    | Certify project as stable/maintained               |
| `fork:community_project` | Duplicate project into sandbox for experimentation |
| `assign:maintainer`      | Assign project maintainers                         |
| `create:project_tags`    | Define tags like "CLI", "REST", "gRPC" etc.        |

---

### 4. `image-infographic-archive/`

| Permission                 | Applies to                                         |
| -------------------------- | -------------------------------------------------- |
| `upload:image_infographic` | Upload PNG/SVG/PDF                                 |
| `optimize:image`           | Resize/compress for performance                    |
| `annotate:image`           | Add notes or highlight sections                    |
| `group:infographics`       | Create themes/sets (e.g., Goroutine Internals Set) |

---

### 5. `community-stories/`

| Permission                | Applies to                                 |
| ------------------------- | ------------------------------------------ |
| `submit:story`            | Submit a personal or experience story      |
| `moderate:story`          | Approve or reject stories                  |
| `tag:story_category`      | Label stories (job hunt, rejections, etc.) |
| `feature:story`           | Highlight on community page                |
| `approve:anonymous_story` | Allow anonymous publishing                 |

---

### 6. `package-archive/`

| Permission                 | Applies to                      |
| -------------------------- | ------------------------------- |
| `upload:package_source`    | Upload zip/tarball or Git link  |
| `verify:package_integrity` | Ensure no malicious code        |
| `test:package`             | Run CI on submitted code        |
| `mark:package_deprecated`  | Deprecate old packages          |
| `create:package_doc`       | Write documentation for package |

---

### 7. `community-blogs/`

| Permission         | Applies to                                             |
| ------------------ | ------------------------------------------------------ |
| `submit:blog_post` | Write and submit a blog                                |
| `edit:others_blog` | Allow editing of other authors' blogs (moderator only) |
| `review:blog_post` | Can review before publishing                           |
| `pin:blog_post`    | Pin post to top of page                                |

---

### 8. `news-events/`

| Permission               | Applies to                            |
| ------------------------ | ------------------------------------- |
| `submit:event`           | Submit conference or event            |
| `create:event_recap`     | Summarize events                      |
| `organize:event_listing` | Curate future/past events             |
| `assign:event_host`      | Add moderators for meetups/hackathons |

---

### 9. `video-archive/`

| Permission             | Applies to                           |
| ---------------------- | ------------------------------------ |
| `embed:video_link`     | Attach YouTube or local hosted video |
| `transcribe:video`     | Add subtitle or transcript           |
| `review:video_content` | Moderate for quality or relevance    |
| `feature:video`        | Spotlight video on homepage          |
| `clip:video_segment`   | Create mini-clips or highlights      |

---

### 10. `course-content/`

| Permission              | Applies to                         |
| ----------------------- | ---------------------------------- |
| `submit:course_module`  | Create lessons or sections         |
| `assign:course_owner`   | Appoint course maintainer(s)       |
| `review:course_content` | Approve/reject modules             |
| `track:course_progress` | See student analytics (admin only) |

---

### 11. `link-resource-archive/`

| Permission                  | Applies to                         |
| --------------------------- | ---------------------------------- |
| `submit:link`               | Add blog/tool/documentation link   |
| `validate:link`             | Check for broken/dead links        |
| `approve:external_resource` | Manual approval for outbound links |
| `organize:bookmark_list`    | Allow curating themed collections  |

---

## ✅ Bonus System Permissions

| Permission                | Applies to                                    |
| ------------------------- | --------------------------------------------- |
| `manage:users`            | Admin only — manage roles, bans, profile data |
| `manage:roles`            | Create/update roles and their permission sets |
| `audit:logs`              | View user activity logs                       |
| `backup:data`             | Export platform content                       |
| `toggle:maintenance_mode` | Take platform down for maintenance            |
| `view:analytics`          | See usage and traffic reports                 |
| `send:notifications`      | System-wide announcement access               |

---