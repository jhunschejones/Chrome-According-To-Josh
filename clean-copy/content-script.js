console.log("Clean copy extension loaded.");

document.addEventListener("copy", (event) => {
  const selection = document.getSelection();
  let textToCopy = selection.toString().trim();

  // Strip line breaks and remove odd index words
  if (["https://jisho.org"].includes(window.location.origin)) {
    // Sentences on jisho.org include furigana which coppies to the clipboard with
    // extra line breaks. If we're on that site, try to remove the furigana and
    // extra line breaks.
    const lineBreaks = /(\r\n|\n|\r)/gm;
    textToCopy = textToCopy
      .split(lineBreaks)
      .filter((item) => !item.match(lineBreaks)) // remove line breaks from array
      .filter((_v, i) => i % 2 == 0) // take only the even indexes in the array
      .join("");
  }

  event.clipboardData.setData("text/plain", textToCopy);
  event.preventDefault();
});
