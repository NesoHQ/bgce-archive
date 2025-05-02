#!/usr/bin/env bash

set -e

SOURCE_DIR="docs"
OUTPUT_FILE="$SOURCE_DIR/src/SUMMARY.md"
DEST_DIR="$SOURCE_DIR/src"
IGNORED_DIRS=("scripts" "src" ".git" "node_modules" ".github" ".vscode")
FIRST_CHAPTER="introduction"

[ ! -d "$DEST_DIR" ] && mkdir -p "$DEST_DIR"
echo "# Summary" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

prettify() {
    echo "$1" | sed -E 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++)$i=toupper(substr($i,1,1))tolower(substr($i,2)); print}' | paste -sd' ' -
}

has_markdown_files() {
    local dir="$1"
    [ -f "$dir/README.md" ] && return 0
    [ "$(find "$dir" -maxdepth 1 -name "*.md" | wc -l)" -gt 0 ] && return 0
    for subdir in "$dir"/*/; do
        [ -d "$subdir" ] || continue
        [ "$(find "$subdir" -maxdepth 1 -name "*.md" | wc -l)" -gt 0 ] && return 0
    done
    return 1
}

walk_dir() {
    local current_dir="$1"
    local relative_path="$2"
    local indent="$3"

    [[ "$current_dir" == "$DEST_DIR"* ]] && return

    local include=false
    has_markdown_files "$current_dir" && include=true

    if [ -f "$current_dir/README.md" ]; then
        local dir_name=$(prettify "$(basename "$current_dir")")
        echo "$indent- [$dir_name]($relative_path/README.md)" >> "$OUTPUT_FILE"
        mkdir -p "$DEST_DIR/$relative_path"
        cp "$current_dir/README.md" "$DEST_DIR/$relative_path/"
    elif [ "$include" = true ]; then
        local dir_name=$(prettify "$(basename "$current_dir")")
        echo "$indent- [$dir_name]()" >> "$OUTPUT_FILE"
    fi

    find "$current_dir" -maxdepth 1 -type f -name "*.md" ! -name "README.md" | sort | while read -r md_file; do
        local filename=$(basename "$md_file" .md)
        local title=$(prettify "$filename")
        echo "$indent  - [$title]($relative_path/$(basename "$md_file"))" >> "$OUTPUT_FILE"
        mkdir -p "$DEST_DIR/$relative_path"
        cp "$md_file" "$DEST_DIR/$relative_path/"
    done

    [ "$include" = true ] && echo "" >> "$OUTPUT_FILE"

    find "$current_dir" -maxdepth 1 -type d ! -path "$current_dir" | sort | while read -r subdir; do
        local dir_basename=$(basename "$subdir")
        for ignored in "${IGNORED_DIRS[@]}"; do
            [ "$dir_basename" = "$ignored" ] && continue 2
        done
        walk_dir "$subdir" "$relative_path/$dir_basename" "$indent  "
    done
}

[ -d "$SOURCE_DIR/$FIRST_CHAPTER" ] && walk_dir "$SOURCE_DIR/$FIRST_CHAPTER" "$FIRST_CHAPTER" ""

find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d | sort | while read -r dir; do
    dir_basename=$(basename "$dir")
    [ "$dir_basename" = "$FIRST_CHAPTER" ] && continue
    for ignored in "${IGNORED_DIRS[@]}"; do
        [ "$dir_basename" = "$ignored" ] && continue 2
    done
    walk_dir "$dir" "$dir_basename" ""
done

echo "✅ SUMMARY.md generated at $OUTPUT_FILE"