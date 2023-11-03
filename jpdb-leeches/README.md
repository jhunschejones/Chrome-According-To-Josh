# JPDB Leeches

### Overview
This extension helps hi-light leech cards during review sessions jpdb.io. These are cards that are taking more than their fair share of time by coming up for review more often than others.

### In use
To use the extension, you can download your reviews from https://jpdb.io/settings, then import them into https://jpdb-stats.andmore.coffee/. At the bottom of the page you can export your `Problem words` from the table to a CSV. You may find it helpful to first sort the table by "Total Reviews". Open the resulting CSV file in the program of your choice and copy out the words you want to treat as leeches. Paste these words as strings into the `leeches` array in `content-script.js`. Kanji card leeches should look like `Kanji: 憂` and vocabulary leeches should look like `先日`. Be sure to reload the extension after making any changes to the content.
