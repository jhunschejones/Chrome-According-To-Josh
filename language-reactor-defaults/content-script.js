// Wait for language reactor extension to load after page load
setTimeout(() => {
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


// Add bonus keyboard shortcuts
(() => {
  const bonusShortcuts = {
    keysPressed: {},
    shortcutTimeout: null,
    parseKeyboardShortcuts: (e) => {
      switch (e.key) {
        case "Alt":
          bonusShortcuts.keysPressed["option"] = true;
          break;
        case "Meta":
          bonusShortcuts.keysPressed["command"] = true;
          break;
        default:
          if (!e.key) {
            return;
          }
          bonusShortcuts.keysPressed[e.key.toLowerCase()] = true;
      }

      if (bonusShortcuts.keysPressed["command"] && bonusShortcuts.keysPressed["e"]) {
        e.preventDefault();

        const sideTranslation = document.querySelector("#lln-v-sub-hover-translation");
        if (!sideTranslation) {
          return console.log("#lln-v-sub-hover-translation not found");
        } else if (sideTranslation.style.display == "none" || sideTranslation.style.display == "") {
          return sideTranslation.style.display = "block";
        } else {
          return sideTranslation.style.display = "none";
        }
      }
    },
    reset: () => {
      bonusShortcuts.keysPressed = {};
    },
    execute: (e) => {
      // short manual de-bounce
      clearTimeout(bonusShortcuts.shortcutTimeout);
      bonusShortcuts.shortcutTimeout = setTimeout(() => {
        bonusShortcuts.parseKeyboardShortcuts(e);
      }, 100);
    },
  }

  document.addEventListener("keydown", (e) => bonusShortcuts.execute(e));
  document.addEventListener("keyup", () => bonusShortcuts.reset());
})();
