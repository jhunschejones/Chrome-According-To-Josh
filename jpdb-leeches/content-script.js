let kanjiLeeches = [];
let wordLeeches = [];
const loadLeeches = async () => {
  kanjiLeeches = await fetch(chrome.runtime.getURL("data/kanji_leeches.json")).then((response) => response.json()).catch((_error) => console.error("Looks like you still need to set up the kanji leeches data."));
  wordLeeches = await fetch(chrome.runtime.getURL("data/word_leeches.json")).then((response) => response.json()).catch((_error) => console.error("Looks like you still need to set up the kanji leeches data."));
  console.log(`The jpdb-leeches extension is set up to track \x1b[34m${kanjiLeeches.length}\x1b[39m kanji leeches and \x1b[36m${wordLeeches.length}\x1b[39m word leeches 🐛`);

  warnOnLeech();
}

const isAnswerCardUrl = () => {
  return new URLSearchParams(window.location.search).has("c");
};

const reviewKind = () => {
  let reviewKind;
  // this means we're on a question card
  if (!isAnswerCardUrl() && document.querySelector(".answer-box .kind")) {
    reviewKind = document.querySelector(".answer-box .kind").textContent;
  }

  // this means we're on a kanji answer card
  if (reviewKind === undefined && isAnswerCardUrl() && document.querySelector(".result.kanji .kanji.plain")) {
    reviewKind = "Kanji";
  }

  // this means we're on a vocabulary answer card
  if (reviewKind === undefined && isAnswerCardUrl() && document.querySelector(".answer-box .plain .plain")) {
    reviewKind = "Vocabulary";
  }

  return reviewKind;
};

const handleLeechCard = () => {
  if (confirm("Blacklist this leech card? 🐛 Esc to cancel.") === true) {
    if (confirm("Are you sure you want to blacklist this card? ⚠️")) {
      document.querySelector("#grade-blacklist").click();
    }
  }
};

const warnOnLeech = () => {
  if (isAnswerCardUrl() && reviewKind() === "Kanji") {
    const kanji = decodeURIComponent(document.querySelector(".result.kanji .kanji.plain").href.replace("https://jpdb.io/kanji/", "").replace("#a", ""));
    if (kanjiLeeches.includes(kanji)) handleLeechCard();
  }

  if (isAnswerCardUrl() && reviewKind() === "Vocabulary") {
    const word = [...document.querySelectorAll(".answer-box .plain .plain ruby")]
      .map((ruby) => ruby.innerHTML.replace(/<rt>.*<\/rt>/g, ""))
      .join("")
    if (wordLeeches.includes(word)) handleLeechCard();
  }
};

const showAnswerButton = document.querySelector("#show-answer");
if (showAnswerButton) {
  showAnswerButton.addEventListener("click", () => {
    setTimeout(() => warnOnLeech(), 100);
  }, {once: true, passive: true});
}

loadLeeches();
