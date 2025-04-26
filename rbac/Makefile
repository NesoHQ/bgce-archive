# Paths and Commands
MAIN := ./
TARGET := main
SERVER_CMD := ./$(TARGET) serve-rest
GEN_JWT := ./$(TARGET) gen-jwt
PROTOC_DEST := ./
USER_PROTO_FILES := ./grpc/user/user.proto

PROTOC_FLAGS := \
	--go_out=$(PROTOC_DEST) \
	--go_opt=paths=source_relative \
	--go-grpc_out=$(PROTOC_DEST) \
	--go-grpc_opt=paths=source_relative

# Targets
build-proto:
	protoc $(PROTOC_FLAGS) $(USER_PROTO_FILES)

run-server: build
	$(SERVER_CMD)

tidy:
	go mod tidy

install-proto-deps:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

install-dev-deps:
	go install github.com/air-verse/air@latest

install-deps:
	go mod download

install-mockgen:
	go install go.uber.org/mock/mockgen@latest

prepare: install-proto-deps install-dev-deps install-deps tidy

dev: prepare
	air serve-rest

build: install-deps
	go build -o $(TARGET) $(MAIN)

start: build run-server
