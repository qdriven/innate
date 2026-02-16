package cmd

import (
	"fmt"
	"monolize/internal/git"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var updateCmd = &cobra.Command{
	Use:   "update",
	Short: "Update all git repositories to the latest version",
	Long:  `Scan the specified directory for git repositories and update each one to the latest version.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		path := viper.GetString("path")
		
		fmt.Printf("Scanning for git repositories in: %s\n", path)
		
		repos, err := git.FindRepositories(path)
		if err != nil {
			return fmt.Errorf("failed to find repositories: %w", err)
		}
		
		if len(repos) == 0 {
			fmt.Println("No git repositories found.")
			return nil
		}
		
		fmt.Printf("Found %d repository(s)\n\n", len(repos))
		
		for _, repo := range repos {
			fmt.Printf("Updating: %s\n", repo)
			if err := git.UpdateRepository(repo); err != nil {
				fmt.Printf("  Error: %v\n", err)
			} else {
				fmt.Printf("  Success!\n")
			}
			fmt.Println()
		}
		
		return nil
	},
}

func init() {
	rootCmd.AddCommand(updateCmd)
}
