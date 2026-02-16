package git

import (
	"fmt"
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"
)

// Updater handles updating git repositories
type Updater struct {
	logger *slog.Logger
}

// NewUpdater creates a new Updater
func NewUpdater(logger *slog.Logger) *Updater {
	if logger == nil {
		logger = slog.Default()
	}
	return &Updater{logger: logger}
}

// UpdateAll finds all git repositories in the given path and updates them
func (u *Updater) UpdateAll(rootPath string) error {
	entries, err := os.ReadDir(rootPath)
	if err != nil {
		return fmt.Errorf("failed to read directory: %w", err)
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		repoPath := filepath.Join(rootPath, entry.Name())
		if isGitRepo(repoPath) {
			u.logger.Info("Updating repository", "path", repoPath)
			if err := u.updateRepo(repoPath); err != nil {
				u.logger.Error("Failed to update repository", "path", repoPath, "error", err)
			} else {
				u.logger.Info("Successfully updated repository", "path", repoPath)
			}
		}
	}
	return nil
}

func isGitRepo(path string) bool {
	_, err := os.Stat(filepath.Join(path, ".git"))
	return err == nil
}

func (u *Updater) updateRepo(path string) error {
	// git pull
	cmd := exec.Command("git", "pull")
	cmd.Dir = path
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
