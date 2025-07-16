#!/bin/bash
set -e

echo "Moving frontend files from ./frontend/ to ./"

# Move package.json, package-lock.json, and node_modules to root if they exist
for file in package.json package-lock.json; do
  if [ -f "frontend/$file" ]; then
    echo "Moving $file"
    mv frontend/$file .
  fi
done

if [ -d "frontend/node_modules" ]; then
  echo "Moving node_modules directory"
  mv frontend/node_modules .
fi

# Move all other frontend source files/folders (pages, public, styles, etc.)
for item in frontend/*; do
  # skip if it's already moved files/folders or hidden (like .gitignore)
  base_item=$(basename "$item")
  if [[ "$base_item" != "package.json" && "$base_item" != "package-lock.json" && "$base_item" != "node_modules" ]]; then
    echo "Moving $base_item"
    mv "$item" .
  fi
done

echo "Removing empty frontend directory"
rmdir frontend

echo "Done. Frontend code is now in project root."
