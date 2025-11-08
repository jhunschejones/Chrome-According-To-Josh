# WaniKani Images Chrome Extension

A Chrome extension that parses markdown image syntax from WaniKani notes and displays the images on the page.

## Features

- Parses standard markdown image syntax `![alt text](url)` from notes
- Replaces markdown with rendered images directly in the notes
- Validates image URLs and provides helpful error messages
- Manual reparse via extension icon click for testing
- Handles dynamically loaded content automatically
- Supports Imgur direct image URLs (use direct links, not album links)

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this directory (`wanikani-images`)

## Usage

### Adding Images to Notes

1. In your WaniKani note, use standard markdown image syntax: `![alt text](image-url)`
2. The extension will automatically detect and replace the markdown with the image when the page loads
3. **For Imgur images**: Use direct image URLs (e.g., `https://i.imgur.com/xxxxx.jpg`) - right-click the image and "Copy image address", not the album/gallery link

### Manual Reparse

Click the extension icon in Chrome's toolbar to manually trigger a reparse of the current page. This is useful for testing after editing notes.

## Helper Scripts

The repository includes helper scripts for uploading images to Imgur:

- **`upload.rb`**: Uploads a single image file to Imgur and copies the direct image URL to your clipboard. Requires an Imgur API client ID (set in the script) and the `json` gem.
- **`watch.sh`**: Watches a directory for new image files and automatically uploads them using `upload.rb`. Requires `fswatch` (install via `brew install fswatch`).

These scripts make it easy to quickly upload images and get the direct URLs needed for the markdown syntax.

## Development

The extension uses:
- Manifest V3
- Content script that runs on wanikani.com pages
- Background service worker for icon click handling
- MutationObserver to handle dynamically loaded content

