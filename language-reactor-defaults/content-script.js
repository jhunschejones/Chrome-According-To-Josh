// Wait for language reactor extension to load after page load
setTimeout(() => {
  try {
    // Hide hover translations in side panel by default
    document.querySelector("#lln-v-sub-hover-translation").style.display = "none";
  } catch {
    console.warn("Unable to find hover translations element in side pannel");
  }

  // Clean copy subtitles without furigana
  (() => {
    document.addEventListener("copy", (event) => {
      const furigana = Array.from(document.querySelectorAll(".lln-vertical-view .lln-word .translit"));
      let furiganaVisibility;
      if (furigana[0]) {
        // Save origional furigana setting to reset later
        furiganaVisibility = furigana[0].style.visibility;
      }
      // Hide furigana before copying
      furigana.map((e) => e.style.visibility = "hidden");

      // Clean copy
      const selection = document.getSelection();
      let textToCopy = selection.toString().trim();
      const lineBreaks = /(\r\n|\n|\r)/gm;
      textToCopy = textToCopy
        .split(lineBreaks)
        .filter((item) => !item.match(lineBreaks)) // remove line breaks from array
        .join("");
      event.clipboardData.setData("text/plain", textToCopy);
      event.preventDefault();

      // Reset furigana visibility
      furigana.map((e) => e.style.visibility = furiganaVisibility);
    });
  })();

}, 5000);
