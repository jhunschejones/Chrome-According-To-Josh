#!/bin/bash

# brew install fswatch
# chmod +x watch.sh
# ./watch.sh

WATCH_DIR="/Users/YourName/Wanikani_Uploads"
RUBY_SCRIPT="/Users/YourName/Scripts/upload.rb"

echo "Watching directory: $WATCH_DIR. Press Ctrl+C to stop."

# -0: Use NUL as separator
# -r: Watch recursively (optional)
# -E: Use extended regular expressions
# --include='\. (jpe?g|png|gif)$': Only trigger on image files
fswatch -0 -r -E --include='\. (jpe?g|png|gif)$' "$WATCH_DIR" | while read -d "" file_path
do
  echo "--- Detected new file: $file_path ---"

  # Execute the Ruby script for the uploaded image
  # "$file_path" is wrapped in quotes to handle spaces in filenames
  "$RUBY_SCRIPT" "$file_path"

  # Optionally delete the file after successful processing
  # rm "$file_path"

done
