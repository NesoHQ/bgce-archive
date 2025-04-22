#!/usr/bin/env bash

# set -e

# OUTPUT_FILE="docs/src/SUMMARY.md"
# DEST_DIR="docs/src"
# IGNORED_DIRS=("scripts" "docs" ".git" "node_modules")

# if [ ! -d "$DEST_DIR" ]; then
#     echo "📁 Creating directory $DEST_DIR..."
#     mkdir -p "$DEST_DIR"
# fi

# echo "🗂️ Generating mdBook SUMMARY at $OUTPUT_FILE..."
# echo "# Summary" > "$OUTPUT_FILE"
# echo "" >> "$OUTPUT_FILE"

# # Prettify folder/file names
# function prettify() {
#     echo "$1" | sed -E 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++)$i=toupper(substr($i,1,1))tolower(substr($i,2)); print}' | paste -sd' ' -
# }

# # Recursive function to process directories
# function walk_dir() {
#     local current_path="$1"
#     local relative_path="$2"
#     local indent="$3"

#     local has_readme=0
#     local readme_path="$current_path/README.md"

#     # Check if README exists in current folder
#     if [[ -f "$readme_path" ]]; then
#         has_readme=1
#     fi

#     # If this is not root and has a README, list it
#     if [[ "$relative_path" != "." && "$has_readme" == 1 ]]; then
#         local title
#         title=$(prettify "$(basename "$current_path")")

#         echo "${indent}- [$title]()" >> "$OUTPUT_FILE"
#         local rel_md_path="./${relative_path}/README.md"
#         echo "${indent}  - [Readme](${rel_md_path})" >> "$OUTPUT_FILE"

#         # Copy README to destination
#         local dest_md_path="$DEST_DIR/$relative_path/README.md"
#         mkdir -p "$(dirname "$dest_md_path")"
#         cp "$readme_path" "$dest_md_path"
#     elif [[ "$relative_path" == "." ]]; then
#         # root README
#         if [[ -f "./README.md" ]]; then
#             echo "- [Readme](./README.md)" >> "$OUTPUT_FILE"
#             cp "./README.md" "$DEST_DIR/README.md"
#         fi
#     fi

#     # Recursively process subfolders
#     find "$current_path" -mindepth 1 -maxdepth 1 -type d | sort | while read -r subdir; do
#         local dirname
#         dirname=$(basename "$subdir")

#         # Skip ignored directories
#         for ignore in "${IGNORED_DIRS[@]}"; do
#             if [[ "$dirname" == "$ignore" ]]; then
#                 continue 2
#             fi
#         done

#         walk_dir "$subdir" "${relative_path}/${dirname}" "  ${indent}"
#     done
# }

# # Start from root
# walk_dir "." "." ""

# echo "✅ SUMMARY.md generated at $OUTPUT_FILE with only README.md files."

# ---------------------------------------------------------------------------

set -e

OUTPUT_FILE="docs/src/SUMMARY.md"
DEST_DIR="docs/src"
IGNORED_DIRS=("scripts" "docs" ".git" "node_modules" ".github" ".vscode")

# Create destination directory if it doesn't exist
if [ ! -d "$DEST_DIR" ]; then
    echo "📁 Creating directory $DEST_DIR..."
    mkdir -p "$DEST_DIR"
fi

echo "🗂️ Generating mdBook SUMMARY at $OUTPUT_FILE..."
echo "# Summary" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Prettify folder/file names
function prettify() {
    echo "$1" | sed -E 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++)$i=toupper(substr($i,1,1))tolower(substr($i,2)); print}' | paste -sd' ' -
}

# Check if a directory has any markdown files
function has_markdown_files() {
    local dir="$1"
    if [ -f "$dir/README.md" ]; then
        return 0  # True, has README.md
    fi
    
    local count
    count=$(find "$dir" -maxdepth 1 -name "*.md" | wc -l)
    [ "$count" -gt 0 ]
}

# Process directories and files recursively
function walk_dir() {
    local current_dir="$1"
    local relative_path="$2"
    local indent="$3"
    
    # Check if this directory should be included
    local include=false
    if has_markdown_files "$current_dir"; then
        include=true
    fi
    
    # If we have a README.md in this directory
    if [ -f "$current_dir/README.md" ]; then
        local dir_name
        
        # For root directory, use "Introduction"
        if [ "$relative_path" = "." ]; then
            echo "[Introduction](./README.md)" >> "$OUTPUT_FILE"
            # Copy README.md to docs/src
            cp "$current_dir/README.md" "$DEST_DIR/"
        else
            dir_name=$(prettify "$(basename "$current_dir")")
            echo "${indent}- [$dir_name]($relative_path/README.md)" >> "$OUTPUT_FILE"
            # Copy README.md to docs/src with directory structure
            mkdir -p "$DEST_DIR/$relative_path"
            cp "$current_dir/README.md" "$DEST_DIR/$relative_path/"
        fi
    elif [ "$include" = true ]; then
        # Directory has markdown files but no README
        local dir_name
        dir_name=$(prettify "$(basename "$current_dir")")
        echo "${indent}- $dir_name" >> "$OUTPUT_FILE"
    fi
    
    # Process other markdown files in this directory (excluding README.md)
    find "$current_dir" -maxdepth 1 -type f -name "*.md" ! -name "README.md" | sort | while read -r md_file; do
        local filename
        filename=$(basename "$md_file" .md)
        local title
        title=$(prettify "$filename")
        
        # Add entry to SUMMARY.md
        echo "${indent}  - [$title]($relative_path/$(basename "$md_file"))" >> "$OUTPUT_FILE"
        
        # Copy markdown file to docs/src
        mkdir -p "$DEST_DIR/$relative_path"
        cp "$md_file" "$DEST_DIR/$relative_path/"
    done
    
    # Only add a blank line if we included this directory
    if [ "$include" = true ]; then
        echo "" >> "$OUTPUT_FILE"
    fi
    
    # Process subdirectories
    find "$current_dir" -maxdepth 1 -type d ! -path "$current_dir" | sort | while read -r subdir; do
        local dir_basename
        dir_basename=$(basename "$subdir")
        
        # Skip ignored directories
        for ignored in "${IGNORED_DIRS[@]}"; do
            if [ "$dir_basename" = "$ignored" ]; then
                continue 2
            fi
        done
        
        # Process subdirectory with increased indentation
        walk_dir "$subdir" "$relative_path/$dir_basename" "$indent  "
    done
}

# Start processing from the current directory
walk_dir "." "." ""

echo "✅ SUMMARY.md successfully generated at $OUTPUT_FILE"