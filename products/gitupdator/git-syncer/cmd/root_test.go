package cmd

import (
	"bytes"
	"io"
	"strings"
	"testing"
)

func TestRootCmd(t *testing.T) {
	// Use a buffer to capture output
	b := bytes.NewBufferString("")
	rootCmd.SetOut(b)
	rootCmd.SetErr(b)
	
	// Reset args
	rootCmd.SetArgs([]string{"--help"})

	err := rootCmd.Execute()
	if err != nil {
		t.Fatalf("rootCmd execute failed: %v", err)
	}

	out, err := io.ReadAll(b)
	if err != nil {
		t.Fatalf("failed to read output: %v", err)
	}

	if !strings.Contains(string(out), "git-syncer helps you") {
		t.Errorf("expected help message to contain 'git-syncer helps you', got %s", string(out))
	}
}
