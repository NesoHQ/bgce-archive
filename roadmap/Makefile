# ─── Configuration ────────────────────────────────────────────────
IMAGE_NAME  ?= roadmap
IMAGE_TAG   ?= latest
CONTAINER   ?= roadmap-rest
PORT        ?= 8080

# ─── Targets ──────────────────────────────────────────────────────

.PHONY: build run stop logs clean

## build    : Build the Docker image
build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

## run      : Run the container (pass env vars from .env)
run:
	docker run -d --rm \
		--name $(CONTAINER) \
		--env-file .env \
		-p $(PORT):8080 \
		$(IMAGE_NAME):$(IMAGE_TAG)

## stop     : Stop the running container
stop:
	docker stop $(CONTAINER) 2>/dev/null || true

## logs     : Tail container logs
logs:
	docker logs -f $(CONTAINER)

## clean    : Remove the Docker image
clean: stop
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true

## help     : Show this help
help:
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## //' | column -t -s ':'
