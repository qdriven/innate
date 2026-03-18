package cmd

import (
	"fmt"
	"os"
	"strings"

	"github.com/spf13/cobra"

	"github.com/innate/yt-dl/internal/downloader"
	"github.com/innate/yt-dl/internal/record"
	"github.com/innate/yt-dl/internal/tui"
)

var (
	flagFormat      string
	flagQuality     string
	flagStartTime   string
	flagEndTime     string
	flagOutputDir   string
	flagSubLangs    string
	flagNoSubs      bool
	flagNoAutoSubs  bool
	flagPlaylist    bool
	flagLogFormat   string
	flagRecordFile  string
	flagMappingFile string
	flagNoTUI       bool
)

func init() {
	dl := downloadCmd

	dl.Flags().StringVarP(&flagFormat, "format", "f", "mp4",
		"Output container format: mp4, webm, mkv, …")
	dl.Flags().StringVarP(&flagQuality, "quality", "q", "",
		"Video quality: 720, 1080, 2160, … (empty = best)")
	dl.Flags().StringVar(&flagStartTime, "start", "",
		"Clip start time (HH:MM:SS or seconds)")
	dl.Flags().StringVar(&flagEndTime, "end", "",
		"Clip end time (HH:MM:SS or seconds)")
	dl.Flags().StringVarP(&flagOutputDir, "output", "o", ".",
		"Output directory (default: current directory)")
	dl.Flags().StringVar(&flagSubLangs, "sub-langs", "en,zh",
		"Comma-separated subtitle languages to download")
	dl.Flags().BoolVar(&flagNoSubs, "no-subs", false,
		"Disable subtitle download")
	dl.Flags().BoolVar(&flagNoAutoSubs, "no-auto-subs", false,
		"Disable auto-generated subtitle download")
	dl.Flags().BoolVarP(&flagPlaylist, "playlist", "p", false,
		"Treat URL as a playlist / collection")
	dl.Flags().StringVar(&flagLogFormat, "log-format", "json",
		"Record / mapping file format: json or csv")
	dl.Flags().StringVar(&flagRecordFile, "record-file", "download_record",
		"Base name (no extension) for the download log file")
	dl.Flags().StringVar(&flagMappingFile, "mapping-file", "subtitle_mapping",
		"Base name (no extension) for the subtitle-video mapping file")
	dl.Flags().BoolVar(&flagNoTUI, "no-tui", false,
		"Disable TUI; print plain progress to stdout")

	rootCmd.AddCommand(dl)
}

var downloadCmd = &cobra.Command{
	Use:     "download [flags] <url> [url…]",
	Aliases: []string{"dl", "get"},
	Short:   "Download video(s) from YouTube",
	Args:    cobra.MinimumNArgs(1),
	RunE:    runDownload,
}

func runDownload(cmd *cobra.Command, args []string) error {
	// Resolve output directory
	outDir := flagOutputDir
	if outDir == "" {
		outDir = "."
	}
	if err := os.MkdirAll(outDir, 0o755); err != nil {
		return fmt.Errorf("cannot create output directory %q: %w", outDir, err)
	}

	langs := []string{"en", "zh"}
	if flagSubLangs != "" {
		langs = strings.Split(flagSubLangs, ",")
	}

	opts := downloader.Options{
		Format:         flagFormat,
		Quality:        flagQuality,
		StartTime:      flagStartTime,
		EndTime:        flagEndTime,
		OutputDir:      outDir,
		SubtitleLangs:  langs,
		WriteSubtitles: !flagNoSubs,
		WriteAutoSubs:  !flagNoAutoSubs,
		IsPlaylist:     flagPlaylist,
		LogFormat:      flagLogFormat,
		RecordFile:     flagRecordFile,
		MappingFile:    flagMappingFile,
	}

	mgr := record.NewManager(flagLogFormat, flagRecordFile, flagMappingFile, outDir)

	// Create progress channel
	progressCh := make(chan downloader.ProgressUpdate, 100)

	// Start TUI or plain logger in a goroutine
	tuiDone := make(chan error, 1)
	if !flagNoTUI {
		go func() {
			tuiDone <- tui.Run(progressCh)
		}()
	} else {
		go func() {
			for upd := range progressCh {
				switch upd.Status {
				case "done":
					fmt.Printf("[done]  %s\n", upd.Title)
				case "error":
					fmt.Printf("[error] %s: %s\n", upd.Title, upd.Error)
				case "downloading":
					fmt.Printf("[%.1f%%] %s  %s  ETA %s\n",
						upd.Percent, upd.Title, upd.Speed, upd.ETA)
				default:
					fmt.Printf("[%s] %s\n", upd.Status, upd.Title)
				}
			}
			tuiDone <- nil
		}()
	}

	dl := downloader.New(opts, progressCh)

	var allResults []downloader.DownloadResult

	for _, url := range args {
		if flagPlaylist {
			results := dl.DownloadPlaylist(url)
			allResults = append(allResults, results...)
		} else {
			result := dl.DownloadSingle(url)
			allResults = append(allResults, result)
		}
	}

	// Signal TUI that all downloads are complete
	close(progressCh)
	if err := <-tuiDone; err != nil {
		fmt.Fprintf(os.Stderr, "TUI error: %v\n", err)
	}

	// Write records
	for _, r := range allResults {
		mgr.Add(r)
	}
	if err := mgr.Flush(); err != nil {
		fmt.Fprintf(os.Stderr, "warning: failed to write records: %v\n", err)
	} else {
		fmt.Printf("\nDownload log   : %s\n", mgr.RecordPath())
		fmt.Printf("Subtitle map   : %s\n", mgr.MappingPath())
	}

	// Summary
	ok, fail := 0, 0
	for _, r := range allResults {
		if r.Success {
			ok++
		} else {
			fail++
		}
	}
	fmt.Printf("\nCompleted: %d succeeded, %d failed.\n", ok, fail)
	if fail > 0 {
		return fmt.Errorf("%d download(s) failed — see %s for details", fail, mgr.RecordPath())
	}
	return nil
}
