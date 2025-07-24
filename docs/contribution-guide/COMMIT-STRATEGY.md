### 📌 **COMMIT STRATEGY**

#### 🔧 **Setup**

Install **Lefthook** to enable Git commit hooks for enforcing commit standards:

```bash
go install github.com/evilmartians/lefthook@latest
```

Then, in the project root: you do not need to execute this command as the file already exists!

```bash
# lefthook install
```

---

#### ✅ **Commit Message Format**

```
[<service>] (<type/feature-name>): <Capitalized short description>
```

---

#### 💡 **Allowed Types**

-   `feat` – New feature or functionality
-   `fix` – Bug fix or issue correction
-   `patch` – Minor updates or hotfixes
-   `docs` – Documentation changes
-   `style` – Code style changes (formatting, linting)
-   `refactor` – Code restructuring without behavior change
-   `test` – Adding or updating tests
-   `chore` – Build tasks, CI configs, or other maintenance

---

#### 🧪 **Example Commits**

```
[inventory] (feat/add-product): Add product listing endpoint
[auth] (fix/token-expiry): Correct token expiry issue
[payment] (patch/update-paypal): Update PayPal integration
[docs] (docs/readme): Update CLI tool usage instructions
```

---

✅ **Notes for contributors:**

-   **Service**: Use the relevant service or package name in square brackets.
-   **Type/feature-name**: Specify the type and concise feature name in parentheses.
-   **Description**: Must start with an uppercase letter and clearly state the change.

---
