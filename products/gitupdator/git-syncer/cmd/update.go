package cmd

import (
	"git-syncer/internal/git"
	"log/slog"
	"os"

	"github.com/spf13/cobra"
)

// updateCmd represents the update command
var updateCmd = &cobra.Command{
	Use:   "update",
	Short: "Update all git repositories in a folder",
	Long:  `Update all git repositories in a folder to the latest version.`,
	Run: func(cmd *cobra.Command, args []string) {
		logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
		logger.Info("update called")
		path, _ := cmd.Flags().GetString("path")
		if path == "" {
			var err error
			path, err = os.Getwd()
			if err != nil {
				logger.Error("Error getting current working directory", "error", err)
				return
			}
		}

		updater := git.NewUpdater(logger)
		if err := updater.UpdateAll(path); err != nil {
			logger.Error("Error updating repositories", "error", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(updateCmd)
	updateCmd.Flags().StringP("path", "p", "", "Path to the directory containing git repositories")
}
