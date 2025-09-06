package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// Configuration variables for the index generation
var (
	sourceDir   = "docs"                                    // Root directory containing documentation
	outputFile  = filepath.Join(sourceDir, "src", "SUMMARY.md") // Output file for mdBook summary
	destDir     = filepath.Join(sourceDir, "src")              // Destination directory for copied files
	ignoredDirs = []string{"scripts", "src", ".git", "node_modules", ".github", ".vscode"} // Directories to skip
	firstChapter = "introduction" // Special directory to process first
)

// prettify converts file/directory names to human-readable titles
// Converts "my_file-name" -> "My File Name" by replacing separators and capitalizing words
func prettify(name string) string {
	// Replace common separators with spaces
	name = strings.ReplaceAll(name, "-", " ")
	name = strings.ReplaceAll(name, "_", " ")
	
	// Split into words and capitalize each word
	words := strings.Fields(name)
	for i, w := range words {
		if len(w) > 0 {
			words[i] = strings.ToUpper(w[:1]) + strings.ToLower(w[1:])
		}
	}
	return strings.Join(words, " ")
}

// hasMarkdownFiles checks if a directory contains any markdown files
// Returns true if README.md exists or any .md files are found in the directory tree
func hasMarkdownFiles(dir string) bool {
	// Quick check for README.md in the directory
	if _, err := os.Stat(filepath.Join(dir, "README.md")); err == nil {
		return true
	}

	// Walk through directory tree to find any .md files
	mdCount := 0
	filepath.WalkDir(dir, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return nil // Continue on errors
		}
		// Count markdown files (case-insensitive check)
		if !d.IsDir() && strings.HasSuffix(strings.ToLower(d.Name()), ".md") {
			mdCount++
		}
		return nil
	})
	return mdCount > 0
}

// copyFile copies a file from source to destination
// Creates destination directory if it doesn't exist
func copyFile(src, dst string) error {
	// Open source file for reading
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	
	// Create destination directory if needed
	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}
	
	// Create destination file
	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()
	
	// Copy file contents
	_, err = io.Copy(out, in)
	return err
}

// walkDir recursively processes a directory and writes entries to the summary file
// Parameters:
//   - currentDir: absolute path of the directory being processed
//   - relativePath: relative path for links in the summary
//   - indent: indentation string for nested entries
//   - f: file handle to write summary entries to
func walkDir(currentDir, relativePath, indent string, f *os.File) error {
	// Skip the destination directory to avoid infinite recursion
	if strings.HasPrefix(currentDir, destDir) {
		return nil
	}

	// Only process directories that contain markdown files
	include := hasMarkdownFiles(currentDir)

	// Handle README.md files - they become the main entry for a directory
	readmePath := filepath.Join(currentDir, "README.md")
	if _, err := os.Stat(readmePath); err == nil {
		dirName := prettify(filepath.Base(currentDir))
		// Write directory entry with link to README.md
		fmt.Fprintf(f, "%s- [%s](%s/README.md)\n", indent, dirName, relativePath)
		// Copy README.md to destination
		copyFile(readmePath, filepath.Join(destDir, relativePath, "README.md"))
	} else if include {
		// Directory has markdown files but no README.md - create entry without link
		dirName := prettify(filepath.Base(currentDir))
		fmt.Fprintf(f, "%s- [%s]()\n", indent, dirName)
	}

	// Collect all markdown files (except README.md) in the current directory
	mdFiles := []string{}
	filepath.WalkDir(currentDir, func(path string, d os.DirEntry, err error) error {
		if err != nil || d.IsDir() || strings.HasSuffix(d.Name(), "README.md") {
			return nil // Skip directories, errors, and README.md
		}
		// Add markdown files to the list
		if strings.HasSuffix(strings.ToLower(d.Name()), ".md") {
			mdFiles = append(mdFiles, path)
		}
		return nil
	})
	
	// Sort files alphabetically and add them as sub-entries
	sort.Strings(mdFiles)
	for _, mdFile := range mdFiles {
		title := prettify(strings.TrimSuffix(filepath.Base(mdFile), ".md"))
		// Write file entry with double indentation (sub-item)
		fmt.Fprintf(f, "%s  - [%s](%s/%s)\n", indent, title, relativePath, filepath.Base(mdFile))
		// Copy markdown file to destination
		copyFile(mdFile, filepath.Join(destDir, relativePath, filepath.Base(mdFile)))
	}

	// Add blank line after directory entries for better formatting
	if include {
		fmt.Fprintln(f, "")
	}

	// Recursively process subdirectories
	subdirs, _ := os.ReadDir(currentDir)
	sort.Slice(subdirs, func(i, j int) bool { return subdirs[i].Name() < subdirs[j].Name() })
	for _, sd := range subdirs {
		if !sd.IsDir() {
			continue // Skip files
		}
		
		// Check if directory should be ignored
		skip := false
		for _, ig := range ignoredDirs {
			if sd.Name() == ig {
				skip = true
				break
			}
		}
		if skip {
			continue
		}
		
		// Recursively process subdirectory with increased indentation
		walkDir(filepath.Join(currentDir, sd.Name()), filepath.Join(relativePath, sd.Name()), indent+"  ", f)
	}

	return nil
}

// generateIndex creates the SUMMARY.md file for mdBook by scanning the documentation directory
// It processes the directory structure and creates a hierarchical table of contents
func generateIndex() {
	// Ensure the destination directory exists
	if err := os.MkdirAll(destDir, 0755); err != nil {
		panic(err)
	}

	// Create the SUMMARY.md file
	f, err := os.Create(outputFile)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	// Write the required mdBook summary header
	fmt.Fprintln(f, "# Summary")

	// Process the first chapter directory first (if it exists)
	// This ensures the introduction appears at the top of the table of contents
	if _, err := os.Stat(filepath.Join(sourceDir, firstChapter)); err == nil {
		walkDir(filepath.Join(sourceDir, firstChapter), firstChapter, "", f)
	}

	// Process all other top-level directories in alphabetical order
	entries, _ := os.ReadDir(sourceDir)
	sort.Slice(entries, func(i, j int) bool { return entries[i].Name() < entries[j].Name() })
	for _, e := range entries {
		// Skip files and the first chapter (already processed)
		if !e.IsDir() || e.Name() == firstChapter {
			continue
		}
		
		// Skip ignored directories
		skip := false
		for _, ig := range ignoredDirs {
			if e.Name() == ig {
				skip = true
				break
			}
		}
		if skip {
			continue
		}
		
		// Process the directory
		walkDir(filepath.Join(sourceDir, e.Name()), e.Name(), "", f)
	}

	fmt.Printf("✅ SUMMARY.md generated at %s\n", outputFile)
}