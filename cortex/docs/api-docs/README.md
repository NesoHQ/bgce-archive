# 🧾 API Docs for Category Service & Subcategory Service

This document describes the features, purpose, endpoints, data models, and sample payloads for the category and subcategory microservices.

---

## 📁 Feature List & Descriptions

### 📌 category-service

| Feature               | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| Create a new category | Allows creating a top-level category with UUID, label, and description. |
| List all categories   | Returns a list of all available top-level categories.                   |
| Get a category by ID  | Fetches details of a specific category using its unique UUID.           |
| Update a category     | Updates metadata (label, description, status) for a given category.     |
| Delete a category     | Soft deletes a category (preserves data but marks as deleted).          |
| Independent service   | Does not depend on other microservices.                                 |
| Timestamp tracking    | Stores `created_at`, `updated_at` fields for traceability.              |
| Metadata support      | Stores additional dynamic metadata using `jsonb`.                       |
| Redis                 | Uses Redis for caching layer.                                           |

---

### 📌 subcategory-service

| Feature                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Create a new subcategory | Allows creating a subcategory under a valid parent category.  |
| List all subcategories   | Returns all subcategories regardless of parent.               |
| Filter by category       | Returns only subcategories of a specific category.            |
| Get a subcategory by ID  | Fetches subcategory details by UUID.                          |
| Update a subcategory     | Updates label, description, or metadata.                      |
| Delete a subcategory     | Soft deletes subcategory, marking it as inactive.             |
| Category dependency      | Requires valid category ID (foreign key).                     |
| Maintainer tracking      | Subcategories track GitHub handles of maintainers.            |
| Slug-based identifiers   | Uses human-friendly slugs (e.g., `advanced-js-qna`) for URLs. |
| Metadata support         | Uses `jsonb` column for flexible meta tagging.                |

---

## 🏷️ category-service

### ✅ Purpose

Manages top-level content classification, such as topic groupings (e.g., "Interview Q&A", "Learning Resources").

### 📦 Dependencies

#### Mandatory to Run:
- None (fully independent)

#### Optional:
- Redis

---

### 📐 Data Model (Category)

```json
{
    "uuid": "0e352a30-f6d3-4c4e-9c7b-ae91e8d1e63b",
    "slug": "interview-qna",
    "label": "Interview Q&A",
    "description": "Technical interview questions categorized by difficulty and topic",
    "created_by": 1,
    "approved_by": 2,
    "updated_by": null,
    "deleted_by": null,
    "created_at": "2025-07-24T10:00:00Z",
    "updated_at": "2025-07-26T12:00:00Z",
    "approved_at": "2025-07-25T15:30:00Z",
    "deleted_at": null,
    "status": "approved",
    "meta": {
        "icon": "📘",
        "color": "#1E90FF"
    }
}
```

---

### 🛠️ API Endpoints

#### `GET /categories`

Returns all available categories.

---
#### `GET /categories/:uuid`

Fetches a category by UUID.

---
#### `POST /categories`

Creates a new category.

Before creating a new category, it checks if the category already exists.
Redis can be used for optional cache layer checking.

Workflow:
- First checks cache for existing slug (if enabled)
- If not found, checks DB for existing slug
- If not found, Creates the category. Also adds the required informations to cache (if enabled)
- If existing slug is found at any point, Return a conflict error

Flow Chart: [CREATE CATEGORY]

```json
{
    "slug": "interview-qna",
    "label": "Interview Q&A",
    "description": "Interview question service documentation",
    "created_by": 1
}
```

| Responses                   | Status Code |
|-----------------------------|-------------|
| Successfull                 | 200         |
| Bad Request - Invalid Input | 400         |
| Slug already exists         | 409         |
| Internal Server Error       | 500         |

---
#### `PUT /categories/:uuid`

Updates an existing category.

---
#### `DELETE /categories/:uuid`

Soft-deletes the category (sets `deleted_at`, updates `status`).

---

## 🧩 subcategory-service

### ✅ Purpose

Defines subcategories under a given parent category — e.g., "Basic Golang Interview Questions" under "Interview Q\&A".

### 📦 Dependencies

- Requires a valid `category_id` (FK to categories)

---

### 📐 Data Model (Subcategory)

```json
{
    "uuid": "72021f7e-4c3d-47a0-a3e1-c6011a4f408b",
    "slug": "basic-interview-qna",
    "category_uuid": "0e352a30-f6d3-4c4e-9c7b-ae91e8d1e63b",
    "label": "Basic Golang Interview Questions",
    "description": "Entry-level questions for Golang beginners",
    "maintainer": "@ifrunruhin12",
    "created_by": 1,
    "approved_by": 2,
    "updated_by": null,
    "deleted_by": null,
    "created_at": "2025-07-24T10:00:00Z",
    "updated_at": "2025-07-26T12:30:00Z",
    "approved_at": "2025-07-25T11:00:00Z",
    "deleted_at": null,
    "status": "approved",
    "meta": {
        "difficulty": "beginner"
    }
}
```

---

### 🛠️ API Endpoints

#### `GET /subcategories`

Returns all subcategories.

#### `GET /subcategories?category_uuid=...`

Filters subcategories under a category.

#### `GET /subcategories/:uuid`

Fetches a specific subcategory by UUID.

#### `POST /subcategories`

Creates a subcategory.

```json
{
    "slug": "basic-interview-qna",
    "category_uuid": "0e352a30-f6d3-4c4e-9c7b-ae91e8d1e63b",
    "label": "Basic Golang Interview Questions",
    "description": "Basic-level Q&A",
    "maintainer": "@ifrunruhin12",
    "created_by": 1
}
```

#### `PUT /subcategories/:uuid`

Updates label, description, maintainer, or meta field.

#### `DELETE /subcategories/:uuid`

Soft-deletes the subcategory.

---

## 📊 Sample Records

### `categories` Table

```json
[
    {
        "uuid": "8b25c3f6-1e5c-426a-bb89-f8d4a21377c2",
        "slug": "interview-qna",
        "label": "Interview Q&A",
        "description": "Tech interview questions categorized by topic.",
        "created_by": 1001,
        "approved_by": 2001,
        "status": "approved",
        "meta": {
            "priority": "high",
            "tags": ["tech", "interview"],
            "icon": "🧠"
        },
        "subcategories": [
            {
                "uuid": "279d9ec7-d2f4-47dc-a9cf-d58f99c7a4f1",
                "slug": "basic-interview-qna",
                "category_id": "8b25c3f6-1e5c-426a-bb89-f8d4a21377c2",
                "label": "Basic Golang Interview Questions",
                "maintainer": "@ifrunruhin12",
                "status": "approved",
                "meta": {
                    "difficulty": "beginner",
                    "language": "golang",
                    "estimated_read_time": "15min"
                }
            },
            {
                "uuid": "91c6a0b3-b43f-4b63-96a2-1fcf519e9630",
                "slug": "advanced-js-qna",
                "category_id": "8b25c3f6-1e5c-426a-bb89-f8d4a21377c2",
                "label": "Advanced JavaScript Questions",
                "maintainer": "@shahrear_dev",
                "status": "pending",
                "meta": {
                    "difficulty": "advanced",
                    "language": "javascript",
                    "interviewer_favorite": true
                }
            }
        ]
    },
    {
        "uuid": "ff10b395-5af1-4bcd-a812-d30558e4ecbe",
        "slug": "learning-resources",
        "label": "Learning Resources",
        "description": "Curated self-learning content.",
        "created_by": 1002,
        "status": "pending",
        "meta": {
            "language": "English",
            "recommended_age": "18+"
        },
        "subcategories": []
    }
]
```

---

### `subcategories` Table

```json
[
    {
        "uuid": "279d9ec7-d2f4-47dc-a9cf-d58f99c7a4f1",
        "slug": "basic-interview-qna",
        "category_id": "279d9ec7-d2f4-47dc-a9cf-d58f99c7a4f1",
        "label": "Basic Golang Interview Questions",
        "maintainer": "@ifrunruhin12",
        "status": "approved",
        "meta": {
            "difficulty": "beginner",
            "language": "golang",
            "estimated_read_time": "15min"
        },
        "category": {
            "uuid": "279d9ec7-d2f4-47dc-a9cf-d58f99c7a4f1",
            "slug": "basic-interview-qna",
            "label": "Basic Golang Interview Questions",
            "maintainer": "@ifrunruhin12",
            "status": "approved",
            "meta": {
                "difficulty": "beginner",
                "language": "golang",
                "estimated_read_time": "15min"
            }
        }
    },
    {
        "uuid": "91c6a0b3-b43f-4b63-96a2-1fcf519e9630",
        "slug": "advanced-js-qna",
        "category_id": "279d9ec7-d2f4-47dc-a9cf-d58f99c7a4f1",
        "label": "Advanced JavaScript Questions",
        "maintainer": "@shahrear_dev",
        "status": "pending",
        "meta": {
            "difficulty": "advanced",
            "language": "javascript",
            "interviewer_favorite": true
        },
        "category": {
            "uuid": "279d9ec7-d2f4-47dc-a9cf-d58f99c7a4f1",
            "slug": "basic-interview-qna",
            "label": "Basic Golang Interview Questions",
            "maintainer": "@ifrunruhin12",
            "status": "approved",
            "meta": {
                "difficulty": "beginner",
                "language": "golang",
                "estimated_read_time": "15min"
            }
        }
    }
]
```

---

## 🧱 Status Lifecycle

| Status     | Meaning                 |
| ---------- | ----------------------- |
| `pending`  | Awaiting admin approval |
| `approved` | Approved and visible    |
| `rejected` | Admin rejected          |
| `deleted`  | Soft-deleted, hidden    |

---

## 🧠 Meta Field Usage

The `meta` field is a JSON object that can store:

- Custom UI tags (`icon`, `color`)
- Filtering metadata (`difficulty`, `language`)
- Extended tracking (`interviewer_favorite`, `estimated_read_time`)

Example:

```json
"meta": {
  "icon": "🧠",
  "difficulty": "advanced",
  "estimated_read_time": "10min"
}
```

---

## 👥 Maintainers

| Role         | GitHub Handle |
| ------------ | ------------- |
| Schema Owner | @jsiqbal      |
| Reviewer     | @ifrunruhin12 |

```

---
```

[CREATE CATEGORY]: ../flowchart/create-category.drawio.png