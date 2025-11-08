#!/usr/bin/env ruby
require 'listen'
require 'shellwords'

WATCH_DIR   = File.expand_path("~/Downloads/wanikani_images")
RUBY_SCRIPT = File.expand_path("~/Documents/GitHub/Chrome-According-To-Josh/wanikani-images/upload.rb")

puts "👀 Watching #{WATCH_DIR} for new image files... (Ctrl+C to stop)"

listener = Listen.to(WATCH_DIR, only: /\.(jpg|jpeg|png|gif)$/i) do |_modified, added, _removed|
  added.each do |file_path|
    # Skip temporary browser download files
    next if file_path =~ /\.(crdownload|download)$/
    next unless File.exist?(file_path)

    # Wait until file is fully written and stable
    sleep 0.5
    while system("lsof #{Shellwords.escape(file_path)} >/dev/null 2>&1")
      sleep 0.5
    end

    puts "--- ✅ New completed file detected: #{file_path} ---"

    # Run your uploader once per file
    system(RUBY_SCRIPT, file_path)
  end
end

listener.start
sleep
