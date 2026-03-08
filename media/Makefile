MAIN:=./
TARGET:=main
SERVER_CMD:=./${TARGET} serve-rest
PROTOC_DEST:=./
PROTOC_FLAGS:=--go_out=${PROTOC_DEST} --go_opt=paths=source_relative --go-grpc_out=${PROTOC_DEST} --go-grpc_opt=paths=source_relative

# Database migration commands
migrate-up:
	@echo "Running migrations..."
	migrate -path ./migrations -database "postgresql://postgres:postgres@localhost:5432/bgce_archive?sslmode=disable" up

migrate-down:
	@echo "Rolling back last migration..."
	migrate -path ./migrations -database "postgresql://postgres:postgres@localhost:5432/bgce_archive?sslmode=disable" down 1

migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir ./migrations -seq $$name

migrate-force:
	@read -p "Enter version to force: " version; \
	migrate -path ./migrations -database "postgresql://postgres:postgres@localhost:5432/bgce_archive?sslmode=disable" force $$version

migrate-version:
	@migrate -path ./migrations -database "postgresql://postgres:postgres@localhost:5432/bgce_archive?sslmode=disable" version

run-server:
	${SERVER_CMD}

tidy:
	go mod tidy

install-dev-deps:
	go install github.com/air-verse/air@latest

install-deps:
	go mod download

install-mockgen:
	go install go.uber.org/mock/mockgen@latest

install-migrate:
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

prepare: install-dev-deps install-deps install-migrate tidy

dev: prepare
	air serve-rest

build: install-deps
	go build -o ${TARGET} ${MAIN}

start: build run-server

# Docker commands
docker-build:
	docker build -t media-service:latest .

docker-run:
	docker run -d -p 8086:8086 --env-file .env --name media-service media-service:latest

docker-stop:
	docker stop media-service && docker rm media-service

# MinIO setup
minio-start:
	docker run -d \
		-p 9000:9000 \
		-p 9001:9001 \
		--name minio \
		-e "MINIO_ROOT_USER=minioadmin" \
		-e "MINIO_ROOT_PASSWORD=minioadmin" \
		minio/minio server /data --console-address ":9001"

minio-stop:
	docker stop minio && docker rm minio

# Test commands
test:
	go test -v ./...

test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out

# Clean
clean:
	rm -f ${TARGET}
	rm -f coverage.out