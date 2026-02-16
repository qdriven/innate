package cmd

import (
	"fmt"
	"os"

	"command-base/internal/logger"
	"command-base/internal/mono"

	"github.com/spf13/cobra"
)

// syncCmd represents the sync command
var syncCmd = &cobra.Command{
	Use:   "sync [monorepo-path]",
	Short: "Sync all submodules in a monorepo to the latest version",
	Long: `Update all submodules in a monorepo to their latest versions.

This command will:
  1. Fetch updates for all submodules
  2. Update all submodules to the latest commit on their tracking branch
  3. Commit any changes to the monorepo

If no path is provided, it will look for a monorepo in the current directory.

Examples:
  # Sync submodules in the current directory (must be a monorepo)
  command-base sync

  # Sync submodules in a specific monorepo
  command-base sync /path/to/monorepo

  # Sync with verbose output
  command-base sync /path/to/monorepo -v`,
	Args: cobra.MaximumNArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		var monoRepoPath string
		if len(args) > 0 {
			monoRepoPath = args[0]
		} else {
			var err error
			monoRepoPath, err = os.Getwd()
			if err != nil {
				return fmt.Errorf("failed to get current directory: %w", err)
			}
		}

		// Check if it's a monorepo
		if !mono.IsMonoRepo(monoRepoPath) {
			return fmt.Errorf("not a monorepo (no .gitmodules found): %s", monoRepoPath)
		}

		fmt.Printf("Syncing all submodules in: %s\n\n", monoRepoPath)
		logger.Info("Syncing submodules", "path", monoRepoPath)

		manager := mono.NewManager(monoRepoPath)
		if err := manager.Sync(); err != nil {
			return fmt.Errorf("failed to sync submodules: %w", err)
		}

		fmt.Println("\n✓ All submodules synced successfully!")
		return nil
	},
}

func init() {
	rootCmd.AddCommand(syncCmd)
}
