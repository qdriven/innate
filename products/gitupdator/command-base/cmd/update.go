package cmd

import (
	"fmt"

	"command-base/internal/config"
	"command-base/internal/git"
	"command-base/internal/logger"

	"github.com/spf13/cobra"
)

// updateCmd represents the update command
var updateCmd = &cobra.Command{
	Use:   "update",
	Short: "Update all git repositories to the latest version",
	Long: `Scan the specified directory for git repositories and update each one to the latest version.

This command will:
  1. Find all git repositories in the specified directory
  2. Fetch the latest changes from remote for each repository
  3. Pull the latest changes into the current branch

Examples:
  # Update all repositories in the current directory
  command-base update

  # Update repositories in a specific directory
  command-base update --path /path/to/repos

  # Update with verbose output
  command-base update -v`,
	RunE: func(cmd *cobra.Command, args []string) error {
		path := config.GetString("path")

		logger.Info("Scanning for git repositories", "path", path)

		repos, err := git.FindRepositories(path)
		if err != nil {
			return fmt.Errorf("failed to find repositories: %w", err)
		}

		if len(repos) == 0 {
			fmt.Println("No git repositories found.")
			return nil
		}

		fmt.Printf("Found %d repository(s)\n\n", len(repos))

		successCount := 0
		errorCount := 0

		for _, repo := range repos {
			fmt.Printf("Updating: %s\n", repo.Name)
			logger.Debug("Updating repository", "path", repo.Path, "branch", repo.Branch)

			if err := repo.Update(); err != nil {
				fmt.Printf("  ❌ Error: %v\n", err)
				logger.Error("Failed to update repository", "name", repo.Name, "error", err)
				errorCount++
			} else {
				fmt.Printf("  ✓ Success!\n")
				successCount++
			}
			fmt.Println()
		}

		fmt.Printf("Update complete: %d succeeded, %d failed\n", successCount, errorCount)
		return nil
	},
}

func init() {
	rootCmd.AddCommand(updateCmd)
}
