# Save Audio JapanesePod101

### Description
I frequently use the Japanese dictionary on japanesepod101.com while studying and making Anki flashcards. Unfortunately, their UI uses a large pile of JavaScript to serve audio clips which makes it a bit ungainly to save these files in Chrome. This extension parses the DOM when dictionary or word list results are loaded and adds a vanilla HTML anchor element for each audio clip for easier accessibility.

BONUS:
I've also added some small general site improvements into this extension that go beyond saving audio. First, if you hit the dictionary page with a `search` URI param, the extension will execute a search for you on the page. This brings the dictionary page in line with the word lists page on the site in terms of programatic search behavior.

On the word lists page, I got tired of the fact that searches default back to the core 100 list. The extension will now look for the `coreX` param in word lists and if present, redirect to the core 2000 list.
