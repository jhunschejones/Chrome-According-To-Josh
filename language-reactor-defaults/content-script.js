(() => {
  const keyboardShortcuts = {
    keysPressed: {},
    shortcutTimeout: null,
    parseKeyboardShortcuts: (e) => {
      switch (e.key) {
        case "Alt":
          keyboardShortcuts.keysPressed["option"] = true;
          break;
        case "Meta":
          keyboardShortcuts.keysPressed["command"] = true;
          break;
        default:
          if (!e.key) {
            return;
          }
          keyboardShortcuts.keysPressed[e.key.toLowerCase()] = true;
      }

      if (keyboardShortcuts.keysPressed["command"] && keyboardShortcuts.keysPressed["e"]) {
        e.preventDefault();
        return keyboardShortcuts.toggleSideTranslations();
      }

      if (keyboardShortcuts.keysPressed["command"] && keyboardShortcuts.keysPressed["b"]) {
        e.preventDefault();
        return keyboardShortcuts.toggleBottomTranslations();
      }
    },
    reset: () => {
      keyboardShortcuts.keysPressed = {};
    },
    execute: (e) => {
      // short manual de-bounce
      clearTimeout(keyboardShortcuts.shortcutTimeout);
      keyboardShortcuts.shortcutTimeout = setTimeout(() => {
        keyboardShortcuts.parseKeyboardShortcuts(e);
      }, 100);
    },
    toggleSideTranslations: () => {
      const sideTranslation = document.querySelector("#lln-v-sub-hover-translation");
      if (!sideTranslation) {
        return console.log("#lln-v-sub-hover-translation not found");
      }

      if (sideTranslation.style.display == "none" || sideTranslation.style.display == "") {
        return sideTranslation.style.display = "block";
      } else {
        return sideTranslation.style.display = "none";
      }
    },
    toggleBottomTranslations: () => {
      const bottomTranslationsContainer = document.querySelector("#lln-translations");
      const bottomTranslationText = document.querySelector(".translationText");
      if (!bottomTranslationsContainer) {
        return console.log("#lln-translations not found");
      }
      if (!bottomTranslationText) {
        return console.log(".translationText not found");
      }

      if (bottomTranslationsContainer.style.display == "none" || bottomTranslationsContainer.style.display == "") {
        bottomTranslationsContainer.style.display = "block";
        bottomTranslationText.style.display = "block";
        bottomTranslationText.style.filter = "none"; // remove blur filter
        return;
      } else {
        bottomTranslationsContainer.style.display = "none";
        bottomTranslationText.style.display = "none";
        return;
      }
    },
  }

  document.addEventListener("keydown", (e) => keyboardShortcuts.execute(e));
  document.addEventListener("keyup", () => keyboardShortcuts.reset());


  const cleanCopy = {
    copyWithoutFurigana: (e) => {
      const furigana = Array.from(document.querySelectorAll(".lln-vertical-view .lln-word .translit"));
      let furiganaVisibility;
      if (furigana[0]) {
        // Save origional furigana setting to reset later
        furiganaVisibility = furigana[0].style.visibility;
      }
      // Hide furigana before copying
      furigana.map((f) => f.style.visibility = "hidden");

      // Clean copy
      const selection = document.getSelection();
      let textToCopy = selection.toString().trim();
      const lineBreaks = /(\r\n|\n|\r)/gm;
      textToCopy = textToCopy
        .split(lineBreaks)
        .filter((item) => !item.match(lineBreaks)) // remove line breaks from array
        .join("");
      e.clipboardData.setData("text/plain", textToCopy);
      e.preventDefault();

      // Reset furigana visibility
      furigana.map((f) => f.style.visibility = furiganaVisibility);
    },
  }

  document.addEventListener("copy", (e) => cleanCopy.copyWithoutFurigana(e));
})();
