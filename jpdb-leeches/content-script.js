(() => {
  const jpdbLeeches = {
    VOCABULARY: "Vocabulary",
    KANJI: "Kanji",
    kanjiLeeches: [],
    wordLeeches: [],
    loadLeeches: async () => {
      const leeches = await chrome.runtime.sendMessage("getLeeches");
      jpdbLeeches.kanjiLeeches = leeches ? leeches.kanjiLeeches : [];
      jpdbLeeches.wordLeeches = leeches ? leeches.wordLeeches : [];
      jpdbLeeches.unlearnableCards = leeches ? leeches.unlearnableCards : [];
      console.log(`The jpdb-leeches extension is set up to track \x1b[34m${jpdbLeeches.kanjiLeeches.length}\x1b[39m kanji leeches, \x1b[36m${jpdbLeeches.wordLeeches.length}\x1b[39m word leeches, and \x1b[33m${jpdbLeeches.unlearnableCards.length}\x1b[39m unlearnable cards 🐛`);

      jpdbLeeches.warnOnLeech();
    },
    isAnswerCardUrl: () => new URLSearchParams(window.location.search).has("c"),
    reviewKind: () => {
      let reviewKind;
      // this means we're on a question card
      if (!jpdbLeeches.isAnswerCardUrl() && document.querySelector(".answer-box .kind")) {
        reviewKind = document.querySelector(".answer-box .kind").textContent;
      }

      // this means we're on a kanji answer card
      if (reviewKind === undefined && jpdbLeeches.isAnswerCardUrl() && document.querySelector(".result.kanji .kanji.plain")) {
        reviewKind = jpdbLeeches.KANJI;
      }

      // this means we're on a vocabulary answer card
      if (reviewKind === undefined && jpdbLeeches.isAnswerCardUrl() && document.querySelector(".answer-box .plain .plain")) {
        reviewKind = jpdbLeeches.VOCABULARY;
      }

      return reviewKind;
    },
    blacklistOrResetCard: (event, isUnlearnable) => {
      let blacklistMessage = "";
      if (isUnlearnable) {
        blacklistMessage = "This card appears to be hard to learn 🧠 Blacklist this card? Esc to cancel.";
      } else {
        blacklistMessage = "Blacklist this leech card? 🐛 Esc to cancel.";
      }
      if (confirm(blacklistMessage) === true) {
        if (confirm("Are you sure you want to blacklist this card? ⚠️")) {
          // suppress the origional form submission
          event.preventDefault();
          event.stopPropagation();
          document.querySelector("#grade-blacklist").click();
        }
      } else {
        if (confirm("Would you like to reset the review history for this card?") === true) {
          if (jpdbLeeches.reviewKind() === jpdbLeeches.VOCABULARY) {
            window.open(
              document.querySelector(".answer-box .plain a").href.split("#")[0] + "/review-history",
              "_blank"
            ).focus();
          } else if (jpdbLeeches.reviewKind() === jpdbLeeches.KANJI) {
            window.open(
              document.querySelector(".result.kanji a").href.split("#")[0] + "/review-history",
              "_blank"
            ).focus();
          }
        }
      }
    },
    // If the user was going to fail the card, offer to blacklist instead
    handleLeechCard: (isUnlearnable = false) => {
      document
        .querySelector("input[value='✘ Something']")
        .addEventListener("click", (event) => { jpdbLeeches.blacklistOrResetCard(event, isUnlearnable) }, {once: true});
      document
        .querySelector("input[value='✘ Nothing']")
        .addEventListener("click", (event) => { jpdbLeeches.blacklistOrResetCard(event, isUnlearnable) }, {once: true});
    },
    warnOnLeech: () => {
      if (jpdbLeeches.isAnswerCardUrl() && jpdbLeeches.reviewKind() === jpdbLeeches.KANJI) {
        const kanji = decodeURIComponent(document.querySelector(".result.kanji .kanji.plain").href.replace("https://jpdb.io/kanji/", "").replace("#a", ""));
        if (jpdbLeeches.kanjiLeeches.includes(kanji)) {
          return jpdbLeeches.handleLeechCard();
        }
        if (jpdbLeeches.unlearnableCards.includes(kanji)) {
          return jpdbLeeches.handleLeechCard(true);
        }
      }

      if (jpdbLeeches.isAnswerCardUrl() && jpdbLeeches.reviewKind() === jpdbLeeches.VOCABULARY) {
        const word = [...document.querySelectorAll(".answer-box .plain .plain ruby")]
          .map((ruby) => ruby.innerHTML.replace(/<rt>.*<\/rt>/g, ""))
          .join("")
        if (jpdbLeeches.wordLeeches.includes(word)) {
          return jpdbLeeches.handleLeechCard();
        }
        if (jpdbLeeches.unlearnableCards.includes(word)) {
          return jpdbLeeches.handleLeechCard(true);
        }
      }
    },
  };

  jpdbLeeches.showAnswerButton = document.querySelector("#show-answer");
  if (jpdbLeeches.showAnswerButton) {
    jpdbLeeches.showAnswerButton.addEventListener("click", () => {
      setTimeout(() => jpdbLeeches.warnOnLeech(), 100);
    }, {once: true, passive: true});
  }

  jpdbLeeches.loadLeeches();
})();
