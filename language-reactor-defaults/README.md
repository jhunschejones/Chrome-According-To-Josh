# Language Reactor Defaults

### Description
Language Reactor is a great tool for language learning on video sites like Netflix and YouTube. This extension sets some sensible defaults on page load so you don't have to play with the DOM or bookmarklets. These include:
- Clean copy subtitles without furigana
- Hide hover translations in side panel by default
- Hide hover translations on the bottom of the page (via `ldr-styles.css`)

### Bonus
If you wish to toggle translations in the side, subtitles panel, you can create a bookmarklet with the following JavaScript:

```javascript
// The code
(() => {
 var sideTranslation = document.querySelector("#lln-v-sub-hover-translation");
 if (sideTranslation.style.display == "none" || sideTranslation.style.display == "") {
   sideTranslation.style.display = "block";
 } else {
   sideTranslation.style.display = "none";
 }
})();

// As a bookmarklet
javascript:((() => { var sideTranslation = document.querySelector("#lln-v-sub-hover-translation"); if (sideTranslation.style.display == "none" || sideTranslation.style.display == "") { sideTranslation.style.display = "block"; } else { sideTranslation.style.display = "none"; } })())
```

Or simply use the `command + e` keyboard shortcut!
