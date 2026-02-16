# GitUpdator

GitUpdator is a suite of Go-based CLI tools designed to simplify the management of multiple Git repositories. It helps developers keep their repositories up-to-date and easily convert them into a monorepo structure using Git submodules.

## Overview

This project provides tools to:

1.  **Batch Update**: Automatically update all Git repositories within a specified directory to their latest versions.
2.  **Monorepo Creation**: Consolidate multiple independent repositories into a single monorepo using Git submodules.
3.  **Submodule Synchronization**: Efficiently manage and sync all submodules within a monorepo with a single command.

## Tools

The project includes the following CLI applications:

### 1. Monolize

A powerful CLI tool to manage multiple git repositories.

**Features:**
- **Update**: Scan a directory and pull the latest changes for all found git repositories.
- **Create**: Generate a new monorepo structure, adding found repositories as submodules.
- **Sync**: Update all submodules within an existing monorepo.

### 2. Git-Syncer

A dedicated tool focused on updating repositories and basic monorepo operations.

## Technologies

- **Language**: Go (Golang)
- **CLI Framework**: Cobra
- **Configuration**: Viper

## Getting Started

### Prerequisites

- Go 1.18+ installed
- Git installed and configured

### Installation

Clone the repository and build the tools:

```bash
# Build Monolize
cd monolize
go build -o monolize.exe

# Build Git-Syncer
cd ../git-syncer
go build -o git-syncer.exe
```

## Usage

See the `README.md` in each tool's directory for detailed usage instructions.
