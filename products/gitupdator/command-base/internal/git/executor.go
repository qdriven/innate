package git

import (
	"fmt"
	"os"
	"os/exec"
)

// Executor provides methods to execute git commands
type Executor struct {
	WorkDir string
	Verbose bool
}

// NewExecutor creates a new git executor
func NewExecutor(workDir string) *Executor {
	return &Executor{
		WorkDir: workDir,
		Verbose: true,
	}
}

// SetVerbose sets the verbose mode
func (e *Executor) SetVerbose(verbose bool) {
	e.Verbose = verbose
}

// Run executes a git command with the given arguments
func (e *Executor) Run(args ...string) error {
	cmd := exec.Command("git", args...)
	if e.WorkDir != "" {
		cmd.Dir = e.WorkDir
	}
	if e.Verbose {
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
	}
	return cmd.Run()
}

// Output executes a git command and returns the output
func (e *Executor) Output(args ...string) (string, error) {
	cmd := exec.Command("git", args...)
	if e.WorkDir != "" {
		cmd.Dir = e.WorkDir
	}
	output, err := cmd.Output()
	if err != nil {
		return "", err
	}
	return string(output), nil
}

// Init initializes a new git repository
func (e *Executor) Init() error {
	if err := e.Run("init"); err != nil {
		return fmt.Errorf("failed to init git repo: %w", err)
	}
	return nil
}

// Add adds files to the staging area
func (e *Executor) Add(paths ...string) error {
	args := append([]string{"add"}, paths...)
	if err := e.Run(args...); err != nil {
		return fmt.Errorf("failed to add files: %w", err)
	}
	return nil
}

// Commit creates a commit with the given message
func (e *Executor) Commit(message string) error {
	if err := e.Run("commit", "-m", message); err != nil {
		return fmt.Errorf("failed to commit: %w", err)
	}
	return nil
}

// SubmoduleAdd adds a submodule
func (e *Executor) SubmoduleAdd(url, path string) error {
	if err := e.Run("submodule", "add", url, path); err != nil {
		return fmt.Errorf("failed to add submodule: %w", err)
	}
	return nil
}

// SubmoduleUpdate updates submodules
func (e *Executor) SubmoduleUpdate(args ...string) error {
	cmdArgs := append([]string{"submodule", "update"}, args...)
	if err := e.Run(cmdArgs...); err != nil {
		return fmt.Errorf("failed to update submodules: %w", err)
	}
	return nil
}

// SubmoduleForeach runs a command in each submodule
func (e *Executor) SubmoduleForeach(args ...string) error {
	cmdArgs := append([]string{"submodule", "foreach"}, args...)
	if err := e.Run(cmdArgs...); err != nil {
		return fmt.Errorf("failed to run submodule foreach: %w", err)
	}
	return nil
}

// SubmoduleSync synchronizes submodule URLs
func (e *Executor) SubmoduleSync() error {
	if err := e.Run("submodule", "sync"); err != nil {
		return fmt.Errorf("failed to sync submodules: %w", err)
	}
	return nil
}
