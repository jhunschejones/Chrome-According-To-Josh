(() => {
  const jpdbLeechesContentScript = {
    kanjiLeeches: [],
    wordLeeches: [],
    loadLeeches: async () => {
      const leeches = await chrome.runtime.sendMessage("getLeeches");
      jpdbLeechesContentScript.kanjiLeeches = leeches ? leeches.kanjiLeeches : [];
      jpdbLeechesContentScript.wordLeeches = leeches ? leeches.wordLeeches : [];
      console.log(`The jpdb-leeches extension is set up to track \x1b[34m${jpdbLeechesContentScript.kanjiLeeches.length}\x1b[39m kanji leeches and \x1b[36m${jpdbLeechesContentScript.wordLeeches.length}\x1b[39m word leeches 🐛`);

      jpdbLeechesContentScript.warnOnLeech();
    },
    isAnswerCardUrl: () => new URLSearchParams(window.location.search).has("c"),
    reviewKind: () => {
      let reviewKind;
      // this means we're on a question card
      if (!jpdbLeechesContentScript.isAnswerCardUrl() && document.querySelector(".answer-box .kind")) {
        reviewKind = document.querySelector(".answer-box .kind").textContent;
      }

      // this means we're on a kanji answer card
      if (reviewKind === undefined && jpdbLeechesContentScript.isAnswerCardUrl() && document.querySelector(".result.kanji .kanji.plain")) {
        reviewKind = "Kanji";
      }

      // this means we're on a vocabulary answer card
      if (reviewKind === undefined && jpdbLeechesContentScript.isAnswerCardUrl() && document.querySelector(".answer-box .plain .plain")) {
        reviewKind = "Vocabulary";
      }

      return reviewKind;
    },
    blacklistCard: (event) => {
      if (confirm("Blacklist this leech card? 🐛 Esc to cancel.") === true) {
        if (confirm("Are you sure you want to blacklist this card? ⚠️")) {
          // suppress the origional form submission
          event.preventDefault();
          event.stopPropagation();
          document.querySelector("#grade-blacklist").click();
        }
      }
    },
    // If the user was going to fail the card, offer to blacklist instead
    handleLeechCard: () => {
      document.querySelector("input[value='✘ Something']").addEventListener("click", jpdbLeechesContentScript.blacklistCard, {once: true});
      document.querySelector("input[value='✘ Nothing']").addEventListener("click", jpdbLeechesContentScript.blacklistCard, {once: true});
    },
    warnOnLeech: () => {
      if (jpdbLeechesContentScript.isAnswerCardUrl() && jpdbLeechesContentScript.reviewKind() === "Kanji") {
        const kanji = decodeURIComponent(document.querySelector(".result.kanji .kanji.plain").href.replace("https://jpdb.io/kanji/", "").replace("#a", ""));
        if (jpdbLeechesContentScript.kanjiLeeches.includes(kanji)) {
          jpdbLeechesContentScript.handleLeechCard();
        }
      }

      if (jpdbLeechesContentScript.isAnswerCardUrl() && jpdbLeechesContentScript.reviewKind() === "Vocabulary") {
        const word = [...document.querySelectorAll(".answer-box .plain .plain ruby")]
          .map((ruby) => ruby.innerHTML.replace(/<rt>.*<\/rt>/g, ""))
          .join("")
        if (jpdbLeechesContentScript.wordLeeches.includes(word)) {
          jpdbLeechesContentScript.handleLeechCard();
        }
      }
    },
  };

  jpdbLeechesContentScript.showAnswerButton = document.querySelector("#show-answer");
  if (jpdbLeechesContentScript.showAnswerButton) {
    jpdbLeechesContentScript.showAnswerButton.addEventListener("click", () => {
      setTimeout(() => jpdbLeechesContentScript.warnOnLeech(), 100);
    }, {once: true, passive: true});
  }
  jpdbLeechesContentScript.loadLeeches();
})();
