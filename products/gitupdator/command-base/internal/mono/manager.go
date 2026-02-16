package mono

import (
	"fmt"
	"os"
	"path/filepath"

	"command-base/internal/git"
	"command-base/internal/logger"
)

// Manager handles monorepo operations
type Manager struct {
	Path    string
	gitExec *git.Executor
}

// NewManager creates a new monorepo manager
func NewManager(path string) *Manager {
	return &Manager{
		Path:    path,
		gitExec: git.NewExecutor(path),
	}
}

// IsMonoRepo checks if the given path is a monorepo (has .gitmodules)
func IsMonoRepo(path string) bool {
	gitmodulesPath := filepath.Join(path, ".gitmodules")
	_, err := os.Stat(gitmodulesPath)
	return err == nil
}

// Create creates a new monorepo with the given repositories as submodules
func (m *Manager) Create(repos []*git.Repository) error {
	logger.Info("Creating monorepo", "path", m.Path)

	// Create the monorepo directory
	if err := os.MkdirAll(m.Path, 0755); err != nil {
		return fmt.Errorf("failed to create monorepo directory: %w", err)
	}

	// Initialize git repository
	if err := m.gitExec.Init(); err != nil {
		return err
	}

	// Create .gitignore
	if err := m.createGitignore(); err != nil {
		return err
	}

	// Add each repository as a submodule
	for _, repo := range repos {
		if err := m.addSubmodule(repo); err != nil {
			logger.Warn("Failed to add submodule", "repo", repo.Name, "error", err)
			continue
		}
	}

	// Initialize and update submodules
	if err := m.gitExec.SubmoduleUpdate("--init", "--recursive"); err != nil {
		return err
	}

	// Create initial commit
	if err := m.createInitialCommit(); err != nil {
		logger.Warn("Failed to create initial commit", "error", err)
	}

	logger.Info("Monorepo created successfully", "path", m.Path)
	return nil
}

// createGitignore creates a .gitignore file for the monorepo
func (m *Manager) createGitignore() error {
	content := `# Monorepo artifacts
.gitmodules.backup
*.log
`
	gitignorePath := filepath.Join(m.Path, ".gitignore")
	if err := os.WriteFile(gitignorePath, []byte(content), 0644); err != nil {
		return fmt.Errorf("failed to create .gitignore: %w", err)
	}
	return nil
}

// addSubmodule adds a repository as a submodule
func (m *Manager) addSubmodule(repo *git.Repository) error {
	if repo.RemoteURL == "" {
		return fmt.Errorf("no remote URL available")
	}

	logger.Info("Adding submodule", "name", repo.Name, "url", repo.RemoteURL)

	if err := m.gitExec.SubmoduleAdd(repo.RemoteURL, repo.Name); err != nil {
		return err
	}

	return nil
}

// createInitialCommit creates the initial commit
func (m *Manager) createInitialCommit() error {
	if err := m.gitExec.Add("."); err != nil {
		return err
	}

	if err := m.gitExec.Commit("Initial commit: Add all repositories as submodules"); err != nil {
		return err
	}

	return nil
}

// Sync synchronizes all submodules to their latest versions
func (m *Manager) Sync() error {
	logger.Info("Syncing submodules", "path", m.Path)

	// Fetch updates for all submodules
	if err := m.gitExec.SubmoduleForeach("git", "fetch", "--all"); err != nil {
		logger.Warn("Failed to fetch submodules", "error", err)
	}

	// Update all submodules to the latest commit on their tracking branch
	if err := m.gitExec.SubmoduleUpdate("--remote", "--merge"); err != nil {
		return fmt.Errorf("failed to update submodules: %w", err)
	}

	// Commit changes if any
	if err := m.commitChanges(); err != nil {
		logger.Warn("Failed to commit changes", "error", err)
	}

	logger.Info("Submodules synced successfully")
	return nil
}

// commitChanges commits any changes to the monorepo
func (m *Manager) commitChanges() error {
	// Check if there are changes
	status, err := m.gitExec.Output("status", "--porcelain")
	if err != nil {
		return err
	}

	if status == "" {
		logger.Info("No changes to commit")
		return nil
	}

	// Add and commit changes
	if err := m.gitExec.Add("."); err != nil {
		return err
	}

	if err := m.gitExec.Commit("Update submodules to latest versions"); err != nil {
		return err
	}

	logger.Info("Changes committed to monorepo")
	return nil
}

// InitSubmodules initializes all submodules
func (m *Manager) InitSubmodules() error {
	logger.Info("Initializing submodules", "path", m.Path)
	return m.gitExec.SubmoduleUpdate("--init", "--recursive")
}

// GetSubmodules returns a list of all submodules
func (m *Manager) GetSubmodules() ([]string, error) {
	output, err := m.gitExec.Output("submodule", "status")
	if err != nil {
		return nil, fmt.Errorf("failed to get submodules: %w", err)
	}

	// Parse output to get submodule names
	var submodules []string
	// This is a simplified parser - in production, you'd want more robust parsing
	if output != "" {
		// TODO: Parse submodule status output
	}

	return submodules, nil
}
