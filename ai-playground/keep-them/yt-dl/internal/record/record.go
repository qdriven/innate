package record

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/innate/yt-dl/internal/downloader"
)

// DownloadRecord is a single entry in the download log.
type DownloadRecord struct {
	VideoID    string    `json:"video_id"    csv:"video_id"`
	Title      string    `json:"title"       csv:"title"`
	URL        string    `json:"url"         csv:"url"`
	OutputDir  string    `json:"output_dir"  csv:"output_dir"`
	Filename   string    `json:"filename"    csv:"filename"`
	Success    bool      `json:"success"     csv:"success"`
	Error      string    `json:"error"       csv:"error"`
	StartedAt  time.Time `json:"started_at"  csv:"started_at"`
	FinishedAt time.Time `json:"finished_at" csv:"finished_at"`
	Duration   string    `json:"duration"    csv:"duration"`
}

// SubtitleMapping associates a video with its subtitle files.
type SubtitleMapping struct {
	VideoID   string   `json:"video_id"  csv:"video_id"`
	Title     string   `json:"title"     csv:"title"`
	VideoFile string   `json:"video_file" csv:"video_file"`
	Subtitles []string `json:"subtitles" csv:"subtitles"`
}

// FromResult converts a downloader result to a DownloadRecord.
func FromResult(r downloader.DownloadResult) DownloadRecord {
	dur := r.FinishedAt.Sub(r.StartedAt).Round(time.Second).String()
	return DownloadRecord{
		VideoID:    r.VideoID,
		Title:      r.Title,
		URL:        r.URL,
		OutputDir:  r.OutputDir,
		Filename:   r.Filename,
		Success:    r.Success,
		Error:      r.Error,
		StartedAt:  r.StartedAt,
		FinishedAt: r.FinishedAt,
		Duration:   dur,
	}
}

// MappingFromResult converts a result to a SubtitleMapping.
func MappingFromResult(r downloader.DownloadResult) SubtitleMapping {
	return SubtitleMapping{
		VideoID:   r.VideoID,
		Title:     r.Title,
		VideoFile: r.Filename,
		Subtitles: r.Subtitles,
	}
}

// Manager maintains an in-memory list of records and mappings,
// and flushes them to disk in JSON or CSV format.
type Manager struct {
	format      string // "json" or "csv"
	recordPath  string
	mappingPath string
	records     []DownloadRecord
	mappings    []SubtitleMapping
}

// NewManager creates a record manager. format is "json" or "csv".
// baseRecord / baseMapping are base filenames without extensions.
func NewManager(format, baseRecord, baseMapping, dir string) *Manager {
	ext := "." + format
	return &Manager{
		format:      format,
		recordPath:  filepath.Join(dir, baseRecord+ext),
		mappingPath: filepath.Join(dir, baseMapping+ext),
	}
}

// Add appends a result to both the record list and mapping list.
func (m *Manager) Add(r downloader.DownloadResult) {
	m.records = append(m.records, FromResult(r))
	m.mappings = append(m.mappings, MappingFromResult(r))
}

// Flush writes all records and mappings to disk.
func (m *Manager) Flush() error {
	if err := m.writeRecords(); err != nil {
		return fmt.Errorf("write records: %w", err)
	}
	if err := m.writeMappings(); err != nil {
		return fmt.Errorf("write mappings: %w", err)
	}
	return nil
}

func (m *Manager) writeRecords() error {
	if m.format == "csv" {
		return writeCSVRecords(m.recordPath, m.records)
	}
	return writeJSON(m.recordPath, m.records)
}

func (m *Manager) writeMappings() error {
	if m.format == "csv" {
		return writeCSVMappings(m.mappingPath, m.mappings)
	}
	return writeJSON(m.mappingPath, m.mappings)
}

// RecordPath returns the resolved record file path.
func (m *Manager) RecordPath() string { return m.recordPath }

// MappingPath returns the resolved mapping file path.
func (m *Manager) MappingPath() string { return m.mappingPath }

// ---- JSON helpers ----

func writeJSON(path string, v any) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(v)
}

// ---- CSV helpers ----

var recordCSVHeader = []string{
	"video_id", "title", "url", "output_dir", "filename",
	"success", "error", "started_at", "finished_at", "duration",
}

func writeCSVRecords(path string, records []DownloadRecord) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	w := csv.NewWriter(f)
	_ = w.Write(recordCSVHeader)
	for _, r := range records {
		row := []string{
			r.VideoID, r.Title, r.URL, r.OutputDir, r.Filename,
			fmt.Sprintf("%t", r.Success),
			r.Error,
			r.StartedAt.Format(time.RFC3339),
			r.FinishedAt.Format(time.RFC3339),
			r.Duration,
		}
		_ = w.Write(row)
	}
	w.Flush()
	return w.Error()
}

var mappingCSVHeader = []string{"video_id", "title", "video_file", "subtitles"}

func writeCSVMappings(path string, mappings []SubtitleMapping) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	w := csv.NewWriter(f)
	_ = w.Write(mappingCSVHeader)
	for _, m := range mappings {
		row := []string{
			m.VideoID, m.Title, m.VideoFile,
			strings.Join(m.Subtitles, "|"),
		}
		_ = w.Write(row)
	}
	w.Flush()
	return w.Error()
}
