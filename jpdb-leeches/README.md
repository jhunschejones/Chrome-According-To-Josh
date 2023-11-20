# JPDB Leeches

### Overview
"Leeches" in an SRS flashcard program like jpdb.io are flashcards that take more than their fair share of a users review time by coming up for review more often than others. The term comes from the SRS program Anki, and this extension in combination with the script run from https://github.com/jhunschejones/jpdb_stats attempt to replicate the way Anki handles leeches for use on the jpdb.io website.

The script in https://github.com/jhunschejones/jpdb_stats reads my `reviews.json` from jpdb.io and calculates which cards are leeches based on how many times they've lapsed. The Chrome extension then uses this data to flag these cards during my review sessions on jpdb.io so that I can blacklist them if desired.
