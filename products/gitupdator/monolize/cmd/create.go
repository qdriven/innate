package cmd

import (
	"fmt"
	"monolize/internal/git"
	"monolize/internal/mono"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	monoRepoName string
	outputPath   string
)

var createCmd = &cobra.Command{
	Use:   "create",
	Short: "Create a mono repo with all repositories as submodules",
	Long:  `Create a new mono repository that contains all found git repositories as submodules.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		path := viper.GetString("path")
		
		if monoRepoName == "" {
			monoRepoName = "mono-repo"
		}
		
		if outputPath == "" {
			outputPath = path
		}
		
		monoRepoPath := filepath.Join(outputPath, monoRepoName)
		
		fmt.Printf("Scanning for git repositories in: %s\n", path)
		
		repos, err := git.FindRepositories(path)
		if err != nil {
			return fmt.Errorf("failed to find repositories: %w", err)
		}
		
		if len(repos) == 0 {
			fmt.Println("No git repositories found.")
			return nil
		}
		
		fmt.Printf("Found %d repository(s)\n", len(repos))
		
		if _, err := os.Stat(monoRepoPath); !os.IsNotExist(err) {
			return fmt.Errorf("mono repo already exists: %s", monoRepoPath)
		}
		
		fmt.Printf("\nCreating mono repo at: %s\n", monoRepoPath)
		
		if err := mono.CreateMonoRepo(monoRepoPath, repos); err != nil {
			return fmt.Errorf("failed to create mono repo: %w", err)
		}
		
		fmt.Println("\nMono repo created successfully!")
		fmt.Printf("Location: %s\n", monoRepoPath)
		fmt.Println("\nTo update all submodules, run:")
		fmt.Printf("  cd %s && git submodule update --remote --merge\n", monoRepoPath)
		
		return nil
	},
}

func init() {
	createCmd.Flags().StringVarP(&monoRepoName, "name", "n", "mono-repo", "Name of the mono repo directory")
	createCmd.Flags().StringVarP(&outputPath, "output", "o", "", "Output path for the mono repo (default: same as source path)")
	rootCmd.AddCommand(createCmd)
}
