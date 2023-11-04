# JPDB Leeches

### Overview
"Leeches" in an SRS flashcard program like jpdb.io are flashcards that take more than their fair share of a users review time by coming up for review more often than others. The term comes from the SRS program Anki, and this extension and included setup script attempt to replicate the way Anki handles leeches for use on the jpdb.io website.

The setup script reads your `reviews.json` from jpdb.io, calculates which cards are leeches based on how many times they've lapsed. The Chrome extension then flags these cards during review sessions on jpdb.io so that the user can blacklist them if desired.

### In use
Run the setup script using `./bin/run`. The script coordinates the setup for this extension by downloading your `reviews.json` from jpdb.io and transforming the data into a list of kanji leech cards and a list of vocabulary word leech cards.

NOTE: The script will attempt to use the 1Password CLI to safely gather credentials for the web request to jpdb.io made in `./bin/download-jpdb-reviews`. You may instead chose to manually set the environment values for `JPDB_USERNAME` and `JPDB_PASSWORD` if you don't have 1Password or just don't want to mess with configuring it's CLI.

Once the data is downloaded and parsed, you should load or re-load the unpacked extension in Chrome and it will read the most up to date leech data from your recently downloaded `reviews.json` 🎉

### Development
As the lapse calculation logic in the setup script has grown in complexity, I decided to add a simple test file to make sure I don't introduce any regressions. You can run this test with the command `ruby ./test/lapse_counter_test.rb`.
