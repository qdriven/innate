package downloader

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

// ProgressUpdate is sent over a channel to report download progress.
type ProgressUpdate struct {
	VideoID string
	Title   string
	Percent float64
	Speed   string
	ETA     string
	Status  string // "downloading", "merging", "done", "error"
	Error   string
}

// VideoInfo holds metadata extracted from yt-dlp --dump-json.
type VideoInfo struct {
	ID            string `json:"id"`
	Title         string `json:"title"`
	Ext           string `json:"ext"`
	PlaylistID    string `json:"playlist_id"`
	PlaylistTitle string `json:"playlist_title"`
	Filename      string // resolved output filename
}

// Downloader wraps yt-dlp for video and playlist downloads.
type Downloader struct {
	opts     Options
	progress chan<- ProgressUpdate
}

// New creates a new Downloader. progress receives live updates (may be nil).
func New(opts Options, progress chan<- ProgressUpdate) *Downloader {
	return &Downloader{opts: opts, progress: progress}
}

// ytdlpBin returns the yt-dlp binary path (prefers yt-dlp over youtube-dl).
func ytdlpBin() (string, error) {
	for _, bin := range []string{"yt-dlp", "youtube-dl"} {
		if path, err := exec.LookPath(bin); err == nil {
			return path, nil
		}
	}
	return "", fmt.Errorf("neither yt-dlp nor youtube-dl found in PATH; please install yt-dlp")
}

// buildArgs constructs yt-dlp arguments from options.
func (d *Downloader) buildArgs(url, outDir string) []string {
	o := d.opts
	args := []string{}

	// Format selection
	if o.Quality != "" && o.Quality != "bestvideo+bestaudio" {
		// quality like "720", "1080" → select best video up to that height
		height := strings.TrimSuffix(o.Quality, "p")
		fmtStr := fmt.Sprintf("bestvideo[height<=%s]+bestaudio/best[height<=%s]", height, height)
		if o.Format != "" && o.Format != "mp4" {
			fmtStr += fmt.Sprintf("[ext=%s]", o.Format)
		}
		args = append(args, "-f", fmtStr)
	} else {
		args = append(args, "-f", "bestvideo+bestaudio/best")
	}

	// Merge format
	if o.Format != "" {
		args = append(args, "--merge-output-format", o.Format)
	}

	// Output template
	outTemplate := filepath.Join(outDir, "%(title)s.%(ext)s")
	args = append(args, "-o", outTemplate)

	// Subtitles
	if o.WriteSubtitles {
		args = append(args, "--write-subs")
		if o.WriteAutoSubs {
			args = append(args, "--write-auto-subs")
		}
		if len(o.SubtitleLangs) > 0 {
			args = append(args, "--sub-langs", strings.Join(o.SubtitleLangs, ","))
		}
	}

	// Time range (requires ffmpeg)
	if o.StartTime != "" || o.EndTime != "" {
		section := ""
		if o.StartTime != "" {
			section += "*" + o.StartTime + "-"
		} else {
			section += "*0-"
		}
		if o.EndTime != "" {
			section += o.EndTime
		} else {
			section += "inf"
		}
		args = append(args, "--download-sections", section, "--force-keyframes-at-cuts")
	}

	// Playlist handling
	if !o.IsPlaylist {
		args = append(args, "--no-playlist")
	}

	// Progress output in newline-delimited form for parsing
	args = append(args, "--newline", "--progress")

	// JSON metadata for post-processing
	args = append(args, "--print-json")

	args = append(args, url)
	return args
}

// progressRe matches yt-dlp progress lines like:
// [download]  42.3% of ~100.00MiB at  2.00MiB/s ETA 00:30
var progressRe = regexp.MustCompile(`\[download\]\s+([\d.]+)%.*?at\s+(\S+)\s+ETA\s+(\S+)`)

// DownloadResult holds the outcome of a single video download attempt.
type DownloadResult struct {
	VideoID    string
	Title      string
	URL        string
	OutputDir  string
	Filename   string
	Subtitles  []string // paths to subtitle files
	Success    bool
	Error      string
	StartedAt  time.Time
	FinishedAt time.Time
}

// DownloadSingle downloads one video (non-playlist).
func (d *Downloader) DownloadSingle(url string) DownloadResult {
	return d.download(url, d.opts.OutputDir, "")
}

// DownloadPlaylist downloads a full playlist, creating a sub-directory.
func (d *Downloader) DownloadPlaylist(url string) []DownloadResult {
	// First fetch playlist metadata to get the title.
	title, err := d.fetchPlaylistTitle(url)
	if err != nil || title == "" {
		title = sanitizeDirName(url)
	}

	playlistDir := filepath.Join(d.opts.OutputDir, title)
	if err := os.MkdirAll(playlistDir, 0o755); err != nil {
		return []DownloadResult{{
			URL:     url,
			Success: false,
			Error:   fmt.Sprintf("cannot create playlist directory: %v", err),
		}}
	}

	result := d.download(url, playlistDir, title)
	// yt-dlp with --print-json outputs one JSON object per video;
	// download() returns a single aggregated result; we wrap it.
	return []DownloadResult{result}
}

// download is the internal implementation that runs yt-dlp.
func (d *Downloader) download(url, outDir, playlistTitle string) DownloadResult {
	bin, err := ytdlpBin()
	if err != nil {
		return DownloadResult{URL: url, Success: false, Error: err.Error()}
	}

	if err := os.MkdirAll(outDir, 0o755); err != nil {
		return DownloadResult{URL: url, Success: false, Error: fmt.Sprintf("cannot create output dir: %v", err)}
	}

	args := d.buildArgs(url, outDir)
	cmd := exec.Command(bin, args...)
	cmd.Dir = outDir

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return DownloadResult{URL: url, Success: false, Error: err.Error()}
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return DownloadResult{URL: url, Success: false, Error: err.Error()}
	}

	result := DownloadResult{
		URL:       url,
		OutputDir: outDir,
		StartedAt: time.Now(),
	}

	if err := cmd.Start(); err != nil {
		result.Error = err.Error()
		return result
	}

	// Collect stderr for error messages
	var stderrLines []string
	go func() {
		sc := bufio.NewScanner(stderr)
		for sc.Scan() {
			stderrLines = append(stderrLines, sc.Text())
		}
	}()

	// Read stdout: yt-dlp emits progress lines AND JSON metadata lines
	var lastJSON VideoInfo
	sc := bufio.NewScanner(stdout)
	// Increase buffer size for large JSON lines
	sc.Buffer(make([]byte, 1024*1024), 1024*1024)
	for sc.Scan() {
		line := sc.Text()

		// Try to parse as JSON (video metadata from --print-json)
		if strings.HasPrefix(line, "{") {
			var info VideoInfo
			if jsonErr := json.Unmarshal([]byte(line), &info); jsonErr == nil {
				lastJSON = info
				if d.progress != nil {
					d.progress <- ProgressUpdate{
						VideoID: info.ID,
						Title:   info.Title,
						Status:  "merging",
						Percent: 100,
					}
				}
			}
			continue
		}

		// Parse progress line
		if m := progressRe.FindStringSubmatch(line); m != nil {
			var pct float64
			fmt.Sscanf(m[1], "%f", &pct)
			if d.progress != nil {
				d.progress <- ProgressUpdate{
					VideoID: lastJSON.ID,
					Title:   lastJSON.Title,
					Percent: pct,
					Speed:   m[2],
					ETA:     m[3],
					Status:  "downloading",
				}
			}
		}
	}
	_ = io.Discard // suppress unused import warning

	cmdErr := cmd.Wait()
	result.FinishedAt = time.Now()

	if cmdErr != nil {
		result.Success = false
		errMsg := cmdErr.Error()
		if len(stderrLines) > 0 {
			errMsg = strings.Join(stderrLines, "; ")
		}
		result.Error = errMsg
		if d.progress != nil {
			d.progress <- ProgressUpdate{
				VideoID: lastJSON.ID,
				Title:   lastJSON.Title,
				Status:  "error",
				Error:   errMsg,
			}
		}
		return result
	}

	result.Success = true
	result.VideoID = lastJSON.ID
	result.Title = lastJSON.Title
	if lastJSON.Title != "" {
		// Reconstruct expected filename
		result.Filename = filepath.Join(outDir,
			sanitizeFilename(lastJSON.Title)+"."+d.opts.Format)
	}

	// Collect subtitle files
	result.Subtitles = collectSubtitleFiles(outDir, lastJSON.Title)

	if d.progress != nil {
		d.progress <- ProgressUpdate{
			VideoID: lastJSON.ID,
			Title:   lastJSON.Title,
			Status:  "done",
			Percent: 100,
		}
	}

	return result
}

// fetchPlaylistTitle uses yt-dlp --dump-single-json to get the playlist title.
func (d *Downloader) fetchPlaylistTitle(url string) (string, error) {
	bin, err := ytdlpBin()
	if err != nil {
		return "", err
	}
	out, err := exec.Command(bin, "--dump-single-json", "--flat-playlist", url).Output()
	if err != nil {
		return "", err
	}
	var meta struct {
		Title string `json:"title"`
	}
	if err := json.Unmarshal(out, &meta); err != nil {
		return "", err
	}
	return sanitizeDirName(meta.Title), nil
}

// collectSubtitleFiles globs for subtitle files that match a video title in dir.
func collectSubtitleFiles(dir, title string) []string {
	if title == "" {
		return nil
	}
	pattern := filepath.Join(dir, sanitizeFilename(title)+"*.vtt")
	matches, _ := filepath.Glob(pattern)
	pattern2 := filepath.Join(dir, sanitizeFilename(title)+"*.srt")
	m2, _ := filepath.Glob(pattern2)
	return append(matches, m2...)
}

// sanitizeDirName makes a string safe for use as a directory name.
func sanitizeDirName(s string) string {
	re := regexp.MustCompile(`[<>:"/\\|?*\x00-\x1f]`)
	s = re.ReplaceAllString(s, "_")
	s = strings.TrimSpace(s)
	if len(s) > 120 {
		s = s[:120]
	}
	return s
}

// sanitizeFilename removes characters unsafe for filenames.
func sanitizeFilename(s string) string {
	return sanitizeDirName(s)
}
