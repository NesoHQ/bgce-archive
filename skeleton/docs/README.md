# 📚 Documentation Overview

This `docs/` directory contains supporting documentation for the `servicetemplate` service. These docs help developers understand, extend, and maintain the service.

---

## 📘 api-docs/

This folder contains all the documentation related to the service’s APIs.

### Purpose:

-   Describe available API endpoints, their expected inputs, outputs, and error responses.
-   Used to onboard developers and consumers of this service quickly.
-   Typically written in OpenAPI/Swagger or Markdown.

### Examples:

-   `openapi.yaml` — Full OpenAPI 3.0 spec.
-   `authentication.md` — Docs for token structure, auth headers, etc.
-   `error-codes.md` — Centralized list of API error codes and meanings.

---

## 🛢️ db-docs/

This folder documents the database schema, relationships, and migrations.

### Purpose:

-   Explain the structure and purpose of each table or collection.
-   Describe important queries, views, or stored procedures if any.
-   Track major schema changes with time.

### Examples:

-   `schema-diagram.png` or `db-schema.md` — ER diagram or schema description.
-   `migrations.md` — How to run/apply DB migrations.
-   `table-users.md` — Specific notes for major tables.

---

## 📄 adr/

ADR stands for **Architecture Decision Records**.

### Purpose:

-   Track **why** and **how** major architectural decisions were made.
-   Help future devs understand the reasoning behind non-obvious design choices.
-   Useful for governance, audits, and team alignment.

### Format:

Each ADR is a separate markdown file using the following structure:

```md
# ADR-001: Use PostgreSQL for persistence

## Status

Accepted

## Context

We need a relational database for complex joins and transactional support...

## Decision

We will use PostgreSQL...

## Consequences

Pros: Strong ACID guarantees...
Cons: Slightly more operational overhead...
```
