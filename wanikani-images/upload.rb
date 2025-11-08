# Save this file somewhere permanent, e.g., ~/Scripts/upload_leech.rb
#!/usr/bin/env ruby
# Remember to install the 'json' gem: gem install json
require "json"

# Arguments from Automator will be passed as separate strings in ARGV
# The list of newly added files is passed to the script as arguments
# We use shift to get the first one, assuming only one image is added at a time.

file_path = ARGV[0]
if file_path.nil?
  puts "No file path provided."
  exit
end

# Check if the file is an image (simple check based on extension)
unless file_path.downcase.match?(/\.(jpe?g|png|gif)$/)
  puts "File #{file_path} is not an image. Skipping."
  exit
end

# --- Your Imgur Upload Function (Simplified) ---
client_id = "YOUR_CLIENT_ID_HERE"
curl_command = %Q(curl -s -X POST -H "Authorization: Client-ID #{client_id}" -F "image=@#{file_path}" https://api.imgur.com/3/upload)

json_output = `#{curl_command}`
response = JSON.parse(json_output)
direct_url = response.dig('data', 'link').to_s.sub('http://', 'https://') rescue nil

# --- Output the result to a log or notification ---
if direct_url && !direct_url.empty?
  # Copy the URL to the clipboard (macOS specific command)
  `echo -n "#{direct_url}" | pbcopy`
  puts "SUCCESS! Uploaded #{File.basename(file_path)}: #{direct_url} (Copied to clipboard)"
else
  puts "ERROR: Imgur upload failed for #{file_path}."
end


# Instructions to use with Automator:
#
# Set Up the Automator Folder Action
# 1. Open Automator (search in Spotlight).
# 2. Choose File > New, and select Folder Action. Click Choose.
# 3. At the top, select the folder you want to watch from the dropdown menu (e.g., "Downloads" or a new folder named "Wanikani Uploads").
# 4. In the Library pane, find and drag the "Run Shell Script" action to the workflow area.
#     - Set Shell: /usr/bin/ruby
#     - Set Pass input: as arguments
#     - Delete the default shell script content.
#     - Enter the following single line (which executes your saved script): /Users/YourName/Scripts/upload_leech.rb "$@"
#     -
# 5. Save the workflow (e.g., "Auto Upload Imgur").
#
# Now, every time an image is added to that folder, Automator will automatically run your Ruby script on that file.
