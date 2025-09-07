# 📊 DB Docs: Category Schema

This directory contains the **database schema definitions** for the Category Service, formatted in `.dbml` for use with [dbdiagram.io](https://dbdiagram.io) or [dbdocs.io](https://dbdocs.io).

## 📂 Files

* `category-service.dbml`
  Contains table definition for:

  * `categories`

## 🗂️ Table Overview

### 🔹 `categories`

A **single hierarchical table** that stores both categories and subcategories.
Subcategories are represented by a `parent_id` reference to another row in the same table.

| Column        | Type      | Constraints                             | Description                                        |
| ------------- | --------- | --------------------------------------- | -------------------------------------------------- |
| `id`          | integer   | Primary Key, Identity                   | Internal DB ID                                     |
| `uuid`        | uuid      | Not Null, Default `gen_random_uuid()`   | Public-safe unique identifier                      |
| `parent_id`   | integer   | Foreign Key → `categories.id`, Nullable | If set → this row is a subcategory of that parent  |
| `slug`        | varchar   | Not Null, Unique                        | URL-friendly identifier (e.g., `interview-qna`)    |
| `label`       | varchar   | Not Null                                | Human-readable name                                |
| `description` | text      |                                         | Full description                                   |
| `maintainer`  | varchar   |                                         | Maintainer handle (e.g., GitHub `@yourname`)       |
| `created_by`  | integer   | Not Null                                | Creator (User ID)                                  |
| `approved_by` | integer   |                                         | Admin approver                                     |
| `updated_by`  | integer   |                                         | Updater (User ID)                                  |
| `deleted_by`  | integer   |                                         | Admin deleter                                      |
| `created_at`  | timestamp | Default: `now()`, Not Null              | Creation time                                      |
| `updated_at`  | timestamp | Default: `now()`, Not Null              | Last update time                                   |
| `approved_at` | timestamp |                                         | When approved                                      |
| `deleted_at`  | timestamp |                                         | When deleted                                       |
| `status`      | varchar   | Default: `'pending'`                    | `pending`, `approved`, `rejected`, `deleted`       |
| `meta`        | jsonb     |                                         | Flexible metadata (tags, search filters, UI hints) |

---

## 🧩 Hierarchy Modeling

* **Top-level category** → `parent_id` is `NULL`
* **Subcategory** → `parent_id` points to the parent `categories.id`

This allows unlimited nesting (categories within categories).

---

## 🔒 Status Lifecycle

| Status     | Meaning                      |
| ---------- | ---------------------------- |
| `pending`  | Awaiting admin approval      |
| `approved` | Approved and visible         |
| `rejected` | Admin rejected (soft delete) |
| `deleted`  | Removed from user view       |

---

## ✍️ Meta Fields

* Stored as `jsonb`
* Designed for schema flexibility
* Examples: custom tags, search filters, UI hints

---

## 🧪 Tips

* Keep `.dbml` files under version control.
* Regenerate diagrams after schema changes.
* Consider writing ADRs (see `../adr/`) for major schema decisions.

---

## 👤 Maintainers

| Role            | Name/Handle |
| --------------- | ----------- |
| Schema Designer | @jsiqbal    |

---