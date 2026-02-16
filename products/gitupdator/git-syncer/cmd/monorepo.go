package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// monorepoCmd represents the monorepo command
var monorepoCmd = &cobra.Command{
	Use:   "monorepo",
	Short: "Create a mono repo",
	Long: `Create a mono repo to update all repositories.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("monorepo called")
	},
}

func init() {
	rootCmd.AddCommand(monorepoCmd)
}
