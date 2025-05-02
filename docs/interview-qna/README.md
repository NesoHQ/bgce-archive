**Microservice Documentation Template** for each category, following a **Domain-Driven Design (DDD)** approach for your `golang-community-vault` project:

```md
# 📘 Microservice - 1-interview-qa

## 📌 Domain Context

This microservice belongs to the **Interview Q&A Domain**, responsible for organizing and serving real-world interview questions and structured problem-solving content. It reflects bounded contexts like company-specific Q&A, topic-wise Go concepts, and curated deep dives.

## 🧩 Subdomains

-   `company-wise/` - Q&A by hiring companies (Google, Meta, etc.)
-   `topic-wise/` - Q&A by technical concept (e.g., Goroutines, Channels)
-   `curated-challenges/` - Problem-solving sets with expected patterns

## 🧪 Core Capabilities

-   Serve categorized Markdown-based content for interviews
-   Support contributor-submitted Q&A in structured format
-   Enable easy search/navigation via tags and metadata

## 🏗️ Expected Structure - Coming Soon
```



````

## 🔄 Input/Output Contract

### Input
- Markdown files via pull requests
- Validated metadata in frontmatter (e.g., tags, difficulty, author)

### Output
- Rendered HTML pages for Docusaurus
- Searchable metadata (for filtering/search)

## ⚙️ Internal Models

```go
type InterviewQuestion struct {
    Title       string   `json:"title"`
    Company     string   `json:"company,omitempty"`
    Topics      []string `json:"topics"`
    Difficulty  string   `json:"difficulty"` // easy | medium | hard
    Author      string   `json:"author"`
    Content     string   `json:"content"` // Markdown
}
````

## 🛠 Maintainers

| GitHub Handle | Role            |
| ------------- | --------------- |
| @username1    | Lead Maintainer |
| @username2    | Domain Reviewer |

## 📂 Directory Ownership

This service owns:

-   `interview-qa/**`

## 📚 References

-   [Markdown contribution templates](../../.github/templates/CONTRIBUTING.md)
-   [Content schema definition](../../schemas/interview-question.schema.json)
-   [RBAC permissions](../../docs/rbac/interview-qa.md)

```