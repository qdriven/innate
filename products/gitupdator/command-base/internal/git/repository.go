package git

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// Repository represents a git repository
type Repository struct {
	Path       string
	Name       string
	RemoteURL  string
	Branch     string
	IsSubmodule bool
}

// NewRepository creates a new Repository instance
func NewRepository(path string) (*Repository, error) {
	absPath, err := filepath.Abs(path)
	if err != nil {
		return nil, fmt.Errorf("failed to get absolute path: %w", err)
	}

	if !IsGitRepository(absPath) {
		return nil, fmt.Errorf("not a git repository: %s", absPath)
	}

	repo := &Repository{
		Path: absPath,
		Name: filepath.Base(absPath),
	}

	// Get remote URL (optional)
	if url, err := repo.GetRemoteURL(); err == nil {
		repo.RemoteURL = url
	}

	// Get current branch (optional)
	if branch, err := repo.GetCurrentBranch(); err == nil {
		repo.Branch = branch
	}

	return repo, nil
}

// IsGitRepository checks if the given path is a git repository
func IsGitRepository(path string) bool {
	gitDir := filepath.Join(path, ".git")
	info, err := os.Stat(gitDir)
	if err != nil {
		return false
	}
	return info.IsDir() || info.Mode()&os.ModeSymlink != 0
}

// FindRepositories scans the given path for git repositories
func FindRepositories(rootPath string) ([]*Repository, error) {
	entries, err := os.ReadDir(rootPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read directory: %w", err)
	}

	var repos []*Repository
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		dirPath := filepath.Join(rootPath, entry.Name())
		if IsGitRepository(dirPath) {
			repo, err := NewRepository(dirPath)
			if err != nil {
				continue
			}
			repos = append(repos, repo)
		}
	}

	return repos, nil
}

// GetRemoteURL gets the remote URL of the repository
func (r *Repository) GetRemoteURL() (string, error) {
	cmd := exec.Command("git", "remote", "get-url", "origin")
	cmd.Dir = r.Path
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("failed to get remote URL: %w", err)
	}
	return strings.TrimSpace(string(output)), nil
}

// GetCurrentBranch gets the current branch of the repository
func (r *Repository) GetCurrentBranch() (string, error) {
	cmd := exec.Command("git", "rev-parse", "--abbrev-ref", "HEAD")
	cmd.Dir = r.Path
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("failed to get current branch: %w", err)
	}
	return strings.TrimSpace(string(output)), nil
}

// Fetch fetches all updates from remotes
func (r *Repository) Fetch() error {
	cmd := exec.Command("git", "fetch", "--all")
	cmd.Dir = r.Path
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to fetch: %w", err)
	}
	return nil
}

// Pull pulls the latest changes from the current branch
func (r *Repository) Pull() error {
	branch, err := r.GetCurrentBranch()
	if err != nil {
		return err
	}

	cmd := exec.Command("git", "pull", "origin", branch)
	cmd.Dir = r.Path
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to pull: %w", err)
	}
	return nil
}

// Update updates the repository (fetch + pull)
func (r *Repository) Update() error {
	if err := r.Fetch(); err != nil {
		return err
	}
	return r.Pull()
}

// Status returns the git status of the repository
func (r *Repository) Status() (string, error) {
	cmd := exec.Command("git", "status", "--porcelain")
	cmd.Dir = r.Path
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("failed to get status: %w", err)
	}
	return strings.TrimSpace(string(output)), nil
}

// HasChanges checks if the repository has uncommitted changes
func (r *Repository) HasChanges() bool {
	status, err := r.Status()
	if err != nil {
		return false
	}
	return status != ""
}

// String returns a string representation of the repository
func (r *Repository) String() string {
	return fmt.Sprintf("%s (%s)", r.Name, r.Path)
}
