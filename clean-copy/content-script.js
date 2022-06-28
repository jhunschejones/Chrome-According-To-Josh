console.log("Clean copy extension loaded.");

document.addEventListener("copy", (event) => {
  let textToCopy;

  // Sentences on jisho.org include furigana which coppies to the clipboard with
  // extra line breaks. If we're on that site, try to remove the furigana and
  // extra line breaks.
  if (["https://jisho.org"].includes(window.location.origin)) {

    // 1. Hide furigana
    const furigana = document.querySelectorAll(".furigana");
    if (furigana[0]) {
      Array.from(furigana, (f) => { f.style.display = "none" });
    }

    // 2. Get selection
    const selection = document.getSelection();
    textToCopy = selection.toString().trim();

    // 3. Remove line breaks from array
    const lineBreaks = /(\r\n|\n|\r)/gm;
    textToCopy = textToCopy
      .split(lineBreaks)
      .filter((item) => !item.match(lineBreaks))
      .join("");

    // 4. Re-show furigana if they were hidden
    if (furigana[0]) {
      Array.from(furigana, (f) => { f.style.display = "" });
    }
  } else {

    // Handle the simple case for other sites, just stripping formatting from selection
    const selection = document.getSelection();
    textToCopy = selection.toString().trim();
  }

  event.clipboardData.setData("text/plain", textToCopy);
  event.preventDefault();
});
