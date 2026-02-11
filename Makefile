arcdocs:
	go build -o ./scripts/docs/main scripts/docs/*.go && ./scripts/docs/main

arcdocs-index:
	./scripts/docs/main generate-index

arcdocs-serve:
	./scripts/docs/main serve

setup-commit-hook:
	@echo "🔧 Setting up Git commit-msg hook..."
	@cp ./scripts/project/commit-message .git/hooks/commit-msg
	@chmod +x .git/hooks/commit-msg
	@echo "Commit message hook installed successfully!"