# Makefile for git-syncer

# Binary name
BINARY_NAME=git-syncer
DIST_DIR=dist

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOFMT=$(GOCMD) fmt

# Detect OS for clean command
ifeq ($(OS),Windows_NT)
    RM = del /Q /S
    RMFOLDER = rmdir /S /Q
    BINARY_EXT = .exe
else
    RM = rm -f
    RMFOLDER = rm -rf
    BINARY_EXT =
endif

.PHONY: all test build build-all clean fmt lint help

all: test build

build:
	$(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)$(BINARY_EXT) main.go

test:
	$(GOTEST) -v ./...

fmt:
	$(GOFMT) ./...

lint:
	golangci-lint run

clean:
	$(GOCLEAN)
	-$(RMFOLDER) $(DIST_DIR)

# Cross compilation
build-all: build-windows build-linux build-darwin

build-windows:
	@echo "Building for Windows..."
	$env:GOOS='windows'; $env:GOARCH='amd64'; $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-windows-amd64.exe main.go || (SET GOOS=windows&& SET GOARCH=amd64&& $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-windows-amd64.exe main.go) || (GOOS=windows GOARCH=amd64 $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-windows-amd64.exe main.go)

build-linux:
	@echo "Building for Linux..."
	$env:GOOS='linux'; $env:GOARCH='amd64'; $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-linux-amd64 main.go || (SET GOOS=linux&& SET GOARCH=amd64&& $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-linux-amd64 main.go) || (GOOS=linux GOARCH=amd64 $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-linux-amd64 main.go)

build-darwin:
	@echo "Building for macOS (AMD64)..."
	$env:GOOS='darwin'; $env:GOARCH='amd64'; $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-darwin-amd64 main.go || (SET GOOS=darwin&& SET GOARCH=amd64&& $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-darwin-amd64 main.go) || (GOOS=darwin GOARCH=amd64 $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-darwin-amd64 main.go)
	@echo "Building for macOS (ARM64)..."
	$env:GOOS='darwin'; $env:GOARCH='arm64'; $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-darwin-arm64 main.go || (SET GOOS=darwin&& SET GOARCH=amd64&& $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-darwin-arm64 main.go) || (GOOS=darwin GOARCH=arm64 $(GOBUILD) -o $(DIST_DIR)/$(BINARY_NAME)-darwin-arm64 main.go)

help:
	@echo "make          - Run tests and build binary"
	@echo "make build    - Build binary for current OS"
	@echo "make build-all- Build binaries for Windows, Linux, and macOS"
	@echo "make test     - Run unit tests"
	@echo "make fmt      - Run go fmt"
	@echo "make lint     - Run golangci-lint"
	@echo "make clean    - Remove build artifacts"
