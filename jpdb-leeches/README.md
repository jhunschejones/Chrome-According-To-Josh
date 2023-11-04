# JPDB Leeches

### Overview
"Leeches" are are cards that are taking more than their fair share of time by coming up for review more often than others. This extension helps easily detect and handle leech cards during review sessions jpdb.io.

### In use
The `./bin/run` script coordinates the setup for this extension, downloading your `reviews.json` from jpdb.io, transforming the data into a list total study minutes per day, then logging the script session out of jpdb.io.

NOTE: The script will attempt to use the 1Password CLI to safely gather credentials for the web request to jpdb.io made in `./bin/download-jpdb-reviews`. You may also chose to set the environment values for `JPDB_USERNAME` and `JPDB_PASSWORD` if you don't have 1Password or don't want to mess with configuring it's CLI, and the script will read those instead.

Once the data is downloaded and parsed, you can load or re-load the extension in Chrome and it will read the most up to date leech data from your recently downloaded reviews.json 🎉

### Development
As the lapse counting logic in the setup script has grown in complexity, I added a simple test file to make sure I don't have any regressions. You can run this test with the command `ruby ./test/lapse_counter_test.rb`.
