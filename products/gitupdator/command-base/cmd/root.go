package cmd

import (
	"fmt"
	"os"

	"command-base/internal/config"
	"command-base/internal/logger"

	"github.com/spf13/cobra"
)

var (
	appName = "command-base"
	version = "0.1.0"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   appName,
	Short: "A CLI framework for managing multiple git repositories",
	Long: fmt.Sprintf(`%s is a powerful CLI framework designed to simplify the management of multiple Git repositories.

It provides a unified interface to:
  - Update all git repositories in a directory to their latest versions
  - Create monorepo structures using git submodules
  - Synchronize and manage submodules efficiently

Built with Go, Cobra, and Viper for robust and extensible CLI operations.`, appName),
	Version: version,
	PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
		// Initialize logger
		logger.Init()
		if config.GetBool("verbose") {
			logger.SetLevel(-4) // Debug level
		}

		// Initialize config
		if err := config.Init(appName); err != nil {
			return err
		}

		// Log config file usage
		if cfgFile := config.GetConfigFileUsed(); cfgFile != "" {
			logger.Info("Using config file", "file", cfgFile)
		}

		return nil
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	// Global flags
	rootCmd.PersistentFlags().String("config", "", "config file (default is $HOME/."+appName+".yaml)")
	rootCmd.PersistentFlags().StringP("path", "p", ".", "Path to the directory containing git repositories")
	rootCmd.PersistentFlags().BoolP("verbose", "v", false, "Enable verbose output")

	// Bind flags to viper
	config.BindPFlag("path", rootCmd.PersistentFlags().Lookup("path"))
	config.BindPFlag("verbose", rootCmd.PersistentFlags().Lookup("verbose"))
}
