# WaniKani Images Chrome Extension

A Chrome extension that parses markdown image syntax from WaniKani notes and displays the images on the page.

## Features

- Parses markdown image syntax `![alt text](url)` from WaniKani notes
- Renders those images directly in your notes
- Automatically reparses dynamically loaded content
- Manual reparse via the extension icon
- Validates URLs and displays helpful errors
- Supports direct **ImgBB** image URLs (fast, no album links)

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this directory (`wanikani-images`)

## Usage

### Adding Images to Notes

1. In your WaniKani note, use standard markdown image syntax: `![alt text](image-url)`
2. The extension will automatically detect and replace the markdown with the image when the page loads
3. To test, click the extension icon to manually reparse the current page.

### Manual Reparse

Click the extension icon in Chrome's toolbar to manually trigger a reparse of the current page. This is useful for testing after editing notes.

## Helper Scripts

The repository includes Ruby helper scripts to make uploading and linking images quick and automatic.

### `upload.rb`

Uploads a single image file to **ImgBB**, copies the direct URL to your clipboard, and prints a success message.

**Requirements:**
- Ruby (3.x recommended)
- macOS clipboard utility (`pbcopy`)
- [1Password CLI](https://developer.1password.com/docs/cli/) item named `ImgBB` with a field labeled `api_key`

**Usage:**
```bash
ruby upload.rb /path/to/image.jpg

> SUCCESS! Uploaded image.jpg: https://i.ibb.co/abcd123/image.jpg (Copied to clipboard)
```

### `watch.rb`

A directory watcher that automatically uploads new image files using upload.rb.
It’s written in pure Ruby using the listen gem (no shell scripts or fswatch needed).

**Requirements:**
- Ruby (3.x)
- Bundler (`gem install bundler`)

**Setup:**
```bash
gem install bundler
bundle install
```

**Run the watcher:**
```bash
bundle exec ruby watch.rb
```

It will watch your `~/Downloads/wanikani_images` folder (by default), and whenever a new image finishes downloading, it will:
- Wait until the file is completely written.
- Upload it to ImgBB.
- Copy the direct link to your clipboard.
- Print the success message.

You can then paste that URL directly into your WaniKani note using markdown syntax.

## Development

The extension uses:
- Manifest V3
- Content script that runs on wanikani.com pages
- Background service worker for icon click handling
- MutationObserver to handle dynamically loaded content
