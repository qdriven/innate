package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"command-base/internal/config"
	"command-base/internal/git"
	"command-base/internal/logger"
	"command-base/internal/mono"

	"github.com/spf13/cobra"
)

var (
	monoRepoName string
	outputPath   string
)

// createCmd represents the create command
var createCmd = &cobra.Command{
	Use:   "create",
	Short: "Create a monorepo with all repositories as submodules",
	Long: `Create a new monorepo that contains all found git repositories as submodules.

This command will:
  1. Scan the specified directory for git repositories
  2. Create a new monorepo directory
  3. Add each found repository as a submodule
  4. Initialize and update all submodules
  5. Create an initial commit

Examples:
  # Create a monorepo from repositories in the current directory
  command-base create

  # Create with a custom name
  command-base create --name my-monorepo

  # Create in a specific output path
  command-base create --output /path/to/output

  # Create from a specific source path
  command-base create --path /path/to/repos --name my-monorepo`,
	RunE: func(cmd *cobra.Command, args []string) error {
		path := config.GetString("path")

		// Set defaults
		if monoRepoName == "" {
			monoRepoName = "monorepo"
		}
		if outputPath == "" {
			outputPath = path
		}

		monoRepoPath := filepath.Join(outputPath, monoRepoName)

		// Check if monorepo already exists
		if _, err := os.Stat(monoRepoPath); !os.IsNotExist(err) {
			return fmt.Errorf("monorepo already exists: %s", monoRepoPath)
		}

		logger.Info("Scanning for git repositories", "path", path)

		repos, err := git.FindRepositories(path)
		if err != nil {
			return fmt.Errorf("failed to find repositories: %w", err)
		}

		if len(repos) == 0 {
			fmt.Println("No git repositories found.")
			return nil
		}

		fmt.Printf("Found %d repository(s)\n", len(repos))
		for _, repo := range repos {
			fmt.Printf("  - %s (%s)\n", repo.Name, repo.RemoteURL)
		}
		fmt.Println()

		fmt.Printf("Creating monorepo at: %s\n", monoRepoPath)

		manager := mono.NewManager(monoRepoPath)
		if err := manager.Create(repos); err != nil {
			return fmt.Errorf("failed to create monorepo: %w", err)
		}

		fmt.Println("\n✓ Monorepo created successfully!")
		fmt.Printf("Location: %s\n", monoRepoPath)
		fmt.Println("\nTo sync all submodules, run:")
		fmt.Printf("  %s sync %s\n", appName, monoRepoPath)

		return nil
	},
}

func init() {
	createCmd.Flags().StringVarP(&monoRepoName, "name", "n", "monorepo", "Name of the monorepo directory")
	createCmd.Flags().StringVarP(&outputPath, "output", "o", "", "Output path for the monorepo (default: same as source path)")
	rootCmd.AddCommand(createCmd)
}
