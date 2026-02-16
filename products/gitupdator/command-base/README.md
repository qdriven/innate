# Command Base

A Go-based CLI framework for managing multiple Git repositories. This framework consolidates the best patterns from `git-syncer` and `monolize` to provide a unified, extensible tool for repository management.

## Features

- **Update**: Scan a directory and pull the latest changes for all found git repositories
- **Create**: Generate a new monorepo structure, adding found repositories as submodules
- **Sync**: Update all submodules within an existing monorepo

## Architecture

```
command-base/
├── cmd/                    # Cobra command definitions
│   ├── root.go            # Root command and global flags
│   ├── update.go          # Update command
│   ├── create.go          # Create monorepo command
│   └── sync.go            # Sync submodules command
├── internal/              # Internal packages
│   ├── config/           # Configuration management (Viper)
│   ├── git/              # Git operations
│   │   ├── repository.go # Repository struct and operations
│   │   └── executor.go   # Git command executor
│   ├── mono/             # Monorepo operations
│   │   └── manager.go    # Monorepo manager
│   └── logger/           # Logging utilities
├── pkg/                   # Public packages (for reuse)
│   └── utils/            # Utility functions
├── main.go               # Entry point
├── go.mod                # Go module definition
└── README.md             # This file
```

## Installation

### Prerequisites

- Go 1.24.2 or later
- Git installed and configured

### Build

```bash
cd command-base
go build -o command-base.exe
```

### Install

```bash
go install
```

## Usage

### Update all repositories

Update all git repositories in the current directory:

```bash
command-base update
```

Update repositories in a specific directory:

```bash
command-base update --path /path/to/repos
```

Update with verbose output:

```bash
command-base update -v
```

### Create a monorepo

Create a monorepo from all repositories in the current directory:

```bash
command-base create
```

Create with a custom name:

```bash
command-base create --name my-monorepo
```

Create in a specific output path:

```bash
command-base create --output /path/to/output
```

Create from a specific source path:

```bash
command-base create --path /path/to/repos --name my-monorepo
```

### Sync submodules in a monorepo

Update all submodules to their latest versions:

```bash
command-base sync /path/to/monorepo
```

Sync submodules in the current directory (must be a monorepo):

```bash
command-base sync
```

## Configuration

You can create a configuration file at `~/.command-base.yaml`:

```yaml
path: /default/path/to/repos
default_branch: main
auto_commit: true
verbose: false
```

### Configuration Priority

1. Command-line flags (highest priority)
2. Environment variables (prefix: `COMMANDBASE_`)
3. Configuration file
4. Default values (lowest priority)

### Environment Variables

All configuration options can be set via environment variables:

```bash
export COMMANDBASE_PATH=/path/to/repos
export COMMANDBASE_VERBOSE=true
```

## Commands

| Command  | Description                                           |
|----------|-------------------------------------------------------|
| `update` | Update all git repositories to the latest version     |
| `create` | Create a monorepo with all repositories as submodules |
| `sync`   | Sync all submodules in a monorepo to the latest version |

### Global Flags

| Flag       | Short | Description                                           |
|------------|-------|-------------------------------------------------------|
| `--config` |       | Config file path                                      |
| `--path`   | `-p`  | Path to the directory containing git repositories     |
| `--verbose`| `-v`  | Enable verbose output                                 |
| `--help`   | `-h`  | Help for any command                                  |
| `--version`|       | Version information                                   |

## Package Structure

### `internal/git`

Provides git operations:

- `Repository`: Struct representing a git repository with methods like `Update()`, `Fetch()`, `Pull()`
- `Executor`: Helper for executing git commands
- `FindRepositories()`: Scan a directory for git repositories

### `internal/mono`

Provides monorepo operations:

- `Manager`: Manages monorepo creation and synchronization
- `IsMonoRepo()`: Check if a path is a monorepo

### `internal/config`

Configuration management using Viper:

- `Init()`: Initialize configuration
- `GetConfig()`: Get the global configuration
- `GetString()`, `GetBool()`: Get configuration values

### `internal/logger`

Logging utilities using slog:

- `Init()`: Initialize the logger
- `Debug()`, `Info()`, `Warn()`, `Error()`: Log messages

## Extending the Framework

### Adding a New Command

1. Create a new file in `cmd/` (e.g., `cmd/status.go`):

```go
package cmd

import (
    "fmt"
    "github.com/spf13/cobra"
)

var statusCmd = &cobra.Command{
    Use:   "status",
    Short: "Show status of all repositories",
    RunE: func(cmd *cobra.Command, args []string) error {
        fmt.Println("Status command")
        return nil
    },
}

func init() {
    rootCmd.AddCommand(statusCmd)
}
```

2. The command will be automatically available:

```bash
command-base status
```

### Adding New Git Operations

Extend the `internal/git` package with new functionality:

```go
// In internal/git/repository.go

// Checkout switches to a different branch
func (r *Repository) Checkout(branch string) error {
    cmd := exec.Command("git", "checkout", branch)
    cmd.Dir = r.Path
    return cmd.Run()
}
```

## Development

### Running Tests

```bash
go test ./...
```

### Adding Dependencies

```bash
go get github.com/example/package
go mod tidy
```

## Comparison with Original Tools

| Feature          | git-syncer | monolize   | command-base |
|------------------|------------|------------|--------------|
| Update repos     | ✓          | ✓          | ✓            |
| Create monorepo  | Partial    | ✓          | ✓            |
| Sync submodules  | ✗          | ✓          | ✓            |
| Unified codebase | ✗          | ✗          | ✓            |
| Extensible       | Limited    | Limited    | ✓            |
| Structured logging| ✓         | ✗          | ✓            |
| Config file      | ✓          | ✓          | ✓            |

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
