[**Author:** @hasanmubin
**Date:** 2025-06-19
**Category:** e.g., mini-projects/GitPulse
**Tags:** [go, GitPulse, mini-projects]
]

# GitPulse - A GitHub Activity Tracker CLI 🧑‍💻

A simple command-line tool that fetches and displays the recent public activity of any GitHub user using the [GitHub Events API](https://api.github.com/).
Built with Go.

---

## 🚀 Features

* Accepts GitHub username as a command-line argument
* Fetches recent activity from: `https://api.github.com/users/<username>/events`
* Displays:

  * Push events (e.g., number of commits pushed to a repo)
  * Issues opened
  * Repositories starred
  * And more...
* Gracefully handles errors such as:

  * Invalid GitHub usernames
  * Unexpected data formats

---

## 📦 Prerequisites

* [Go](https://golang.org/dl/) installed (version 1.18 or above recommended)

---

## 🛠️ Setup

1. **Initialize a Go module**:

   ```bash
    go mod init GitPulse
   ```

2. **Build the application**:

   ```bash
   go build -o github-activity
   ```

   This will create a binary file named `github-activity`.

---

## 🧑‍💻 Usage

```bash
./github-activity <github-username>
```

### Example:

```bash
./github-activity kamranahmedse
```

### Sample Output:

```
Pushed 3 commits to kamranahmedse/developer-roadmap
Opened a new issue in kamranahmedse/developer-roadmap
Starred kamranahmedse/developer-roadmap
```

---

## 🛯️ Error Handling

* Invalid username or no recent activity? You’ll get:

  ```
  Error: user not found or has no recent public activity.
  ```
* Internet down? API fails? You’ll get a meaningful error message instead of a crash.

---

## 🌱 Future Improvements (Optional Ideas)

* Filter by specific event type (`PushEvent`, `IssuesEvent`, etc.)
* Cache results locally to reduce API calls
* Display output in a more structured or colorized format
* Explore other endpoints like `/repos`, `/followers`, `/starred`, etc.