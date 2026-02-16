package cmd

import (
	"bytes"
	"io"
	"os"
	"strings"
	"testing"
)

func TestUpdateCmd(t *testing.T) {
	// Create a temp dir to be the "path"
	tempDir, err := os.MkdirTemp("", "git-syncer-cmd-test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	b := bytes.NewBufferString("")
	rootCmd.SetOut(b)
	rootCmd.SetErr(b)

	// We need to add updateCmd to rootCmd, but it's already added in init().
	// However, we should invoke 'update' subcommand.
	rootCmd.SetArgs([]string{"update", "--path", tempDir})

	// Note: Execute() runs the command.
	// Since we haven't mocked git.Updater, it will try to run UpdateAll on tempDir.
	// UpdateAll will find no repos and return nil (or print nothing).
	// We verify "update called" is printed.

	err = rootCmd.Execute()
	if err != nil {
		t.Fatalf("update command failed: %v", err)
	}

	_, err = io.ReadAll(b)
	if err != nil {
		t.Fatalf("failed to read output: %v", err)
	}

	// Because we are capturing rootCmd output, but the fmt.Println("update called")
	// inside Run goes to stdout, not necessarily the command's output if not configured?
	// Cobra's SetOut sets the output for cmd.Println/cmd.Printf but not fmt.Println.
	// In update.go we used fmt.Println("update called").
	// So we might miss it in 'b'.
	// But UpdateAll prints to stdout using fmt.Printf.

	// To capture fmt.Println, we need to capture stdout.
}

func TestUpdateCmd_Output(t *testing.T) {
	// Redirect stdout
	oldStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w

	tempDir, err := os.MkdirTemp("", "git-syncer-cmd-test-2")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	// We need to execute the command.
	// Since rootCmd.Execute() is hard to isolate if we want to just run updateCmd logic,
	// we can run updateCmd.Run(updateCmd, args).
	// But let's try running via rootCmd to be integration-like.

	rootCmd.SetArgs([]string{"update", "--path", tempDir})
	// Reset flags? flags are persistent.

	err = rootCmd.Execute()

	// Close write end
	w.Close()
	os.Stdout = oldStdout

	if err != nil {
		t.Fatalf("update command failed: %v", err)
	}

	var buf bytes.Buffer
	if _, err := io.Copy(&buf, r); err != nil {
		t.Fatalf("Failed to copy output: %v", err)
	}
	output := buf.String()

	if !strings.Contains(output, "update called") {
		t.Errorf("Expected 'update called', got '%s'", output)
	}
}
