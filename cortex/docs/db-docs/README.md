# 📊 DB Docs: Category & Subcategory Schema

This directory contains the **database schema definitions** for the Category Service, formatted in `.dbml` for use with [dbdiagram.io](https://dbdiagram.io) or [dbdocs.io](https://dbdocs.io).

## 📂 Files

- `category-service.dbml`  
  Contains table definitions for:
    - `categories`
    - `subcategories`

## 🗂️ Tables Overview

### 🔹 `categories`

Top-level content categorization table.

| Column        | Type      | Constraints                | Description                                     |
| ------------- | --------- | -------------------------- | ----------------------------------------------- |
| `id`          | integer   | Primary Key, Not Null      | Internal DB ID                                  |
| `uuid`        | uuid      | Not Null, Unique           | Public-safe category ID                         |
| `slug`        | varchar   | Not Null, Unique           | URL-friendly identifier (e.g., `interview-qna`) |
| `label`       | varchar   | Not Null                   | Human-readable name                             |
| `description` | text      |                            | Full description                                |
| `created_by`  | integer   | Not Null                   | Creator (User ID)                               |
| `approved_by` | integer   |                            | Admin approver                                  |
| `updated_by`  | integer   | Not Null                   | Updater (User ID)                               |
| `deleted_by`  | integer   |                            | Admin deleter                                   |
| `created_at`  | timestamp | Default: `now()`, Not Null | Creation time                                   |
| `updated_at`  | timestamp | Default: `now()`, Not Null | Last update time                                |
| `approved_at` | timestamp |                            | When approved                                   |
| `deleted_at`  | timestamp |                            | When deleted                                    |
| `status`      | varchar   | Default: `'pending'`       | `pending`, `approved`, `rejected`, `deleted`    |
| `meta`        | jsonb     |                            | For future-proofing: arbitrary key-values       |

---

### 🔸 `subcategories`

Represents subdivisions under a `category`.

| Column        | Type      | Constraints                             | Description                                  |
| ------------- | --------- | --------------------------------------- | -------------------------------------------- |
| `id`          | integer   | Primary Key, Not Null                   | Internal ID                                  |
| `uuid`        | uuid      | Not Null, Unique                        | Public-safe subcategory ID                   |
| `slug`        | varchar   | Not Null, Unique                        | e.g., `basic-interview-qna`                  |
| `category_id` | integer   | Not Null, Foreign Key → `categories.id` | Parent category ID                           |
| `label`       | varchar   | Not Null                                | Name of subcategory                          |
| `description` | text      |                                         | Summary                                      |
| `maintainer`  | varchar   |                                         | GitHub handle (e.g., `@yourname`)            |
| `created_by`  | integer   | Not Null                                | Creator                                      |
| `approved_by` | integer   |                                         | Admin approver                               |
| `updated_by`  | integer   | Not Null                                | Updater (User ID)                            |
| `deleted_by`  | integer   |                                         | Admin deleter                                |
| `created_at`  | timestamp | Default: `now()`, Not Null              | Creation time                                |
| `updated_at`  | timestamp | Default: `now()`, Not Null              | Last update time                             |
| `approved_at` | timestamp |                                         | When approved                                |
| `deleted_at`  | timestamp |                                         | When deleted                                 |
| `status`      | varchar   | Default: `'pending'`                    | `pending`, `approved`, `rejected`, `deleted` |
| `meta`        | jsonb     |                                         | Arbitrary future-friendly metadata           |

---

## 🧩 Rendering the Diagram

To visualize this schema:

1. Go to [dbdiagram.io](https://dbdiagram.io).
2. Paste the contents of `category-service.dbml`.
3. You’ll see an interactive ER diagram.

---

## 🔒 Status Lifecycle (Shared by Both Tables)

| Status     | Meaning                      |
| ---------- | ---------------------------- |
| `pending`  | Awaiting admin approval      |
| `approved` | Approved and visible         |
| `rejected` | Admin rejected (soft delete) |
| `deleted`  | Removed from user view       |

---

## ✍️ Meta Fields

Both `categories` and `subcategories` include a `meta` column:

- Stored as `jsonb`
- Designed for schema flexibility
- Examples: custom tags, search filters, UI hints

---

## 🧪 Tips

- Keep `.dbml` files under version control.
- Regenerate diagrams after schema changes.
- Consider writing ADRs (see `../adr/`) for major schema decisions.

---

## 👤 Maintainers

| Role            | Name/Handle |
| --------------- | ----------- |
| Schema Designer | @jsiqbal    |

---
