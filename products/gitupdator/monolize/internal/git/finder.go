package git

import (
	"os"
	"path/filepath"
)

// FindRepositories scans the given path for git repositories
func FindRepositories(rootPath string) ([]string, error) {
	var repos []string
	
	entries, err := os.ReadDir(rootPath)
	if err != nil {
		return nil, err
	}
	
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		
		dirPath := filepath.Join(rootPath, entry.Name())
		gitDir := filepath.Join(dirPath, ".git")
		
		info, err := os.Stat(gitDir)
		if err == nil && (info.IsDir() || info.Mode()&os.ModeSymlink != 0) {
			// This is a git repository
			absPath, err := filepath.Abs(dirPath)
			if err != nil {
				continue
			}
			repos = append(repos, absPath)
		}
	}
	
	return repos, nil
}

// IsGitRepository checks if the given path is a git repository
func IsGitRepository(path string) bool {
	gitDir := filepath.Join(path, ".git")
	info, err := os.Stat(gitDir)
	return err == nil && (info.IsDir() || info.Mode()&os.ModeSymlink != 0)
}
