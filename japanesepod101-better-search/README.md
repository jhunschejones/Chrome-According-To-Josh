# JapanesePod101: Better Search

### Description
I frequently use the Japanese dictionary and Core 2000 vocabulary lists on on japanesepod101.com while studying and making Anki flashcards. This extension provides some simple improvements to the user experience for both of these tools.

1. First, if you hit the dictionary page with a `search` URI param, the extension will execute a search for you on the page. This brings the dictionary page in line with the word lists page on the site in terms of programatic search behavior.
2. On the word lists page, I noticed that searches will eventually default back to the Core 100 list. To prevent this, the extension will look for the `coreX` param in word lists and if it's missing or set to 100 it will redirect the search to the Core 2000 list.
