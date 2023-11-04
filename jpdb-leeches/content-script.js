let kanjiLeeches = [];
let wordLeeches = [];
const loadLeeches = async () => {
  kanjiLeeches = await fetch(chrome.runtime.getURL("kanji_leeches.json")).then((response) => response.json()).catch((_error) => console.error("Looks like you still need to set up the kanji leeches data."));
  wordLeeches = await fetch(chrome.runtime.getURL("word_leeches.json")).then((response) => response.json()).catch((_error) => console.error("Looks like you still need to set up the kanji leeches data."));
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

const outlineLeech = () => {
  const answerBox = document.querySelector(".answer-box") || document.querySelector(".hbox");
  if (!answerBox) return;
  answerBox.style.border = "thick solid rgb(255, 59, 59)";
  answerBox.style.borderRadius = "8px";
  answerBox.style.padding = "16px";
};

const warnOnLeech = () => {
  if (isAnswerCardUrl() && reviewKind() === "Kanji") {
    const kanji = decodeURIComponent(document.querySelector(".result.kanji .kanji.plain").href.replace("https://jpdb.io/kanji/", "").replace("#a", ""));
    if (kanjiLeeches.includes(kanji)) outlineLeech();
  }

  if (isAnswerCardUrl() && reviewKind() === "Vocabulary") {
    const word = document.querySelector(".answer-box .plain .plain").innerHTML
      .replace(/<rt>.*<\/rt>/g, "")
      .replace(/<\/?ruby>/g, "");
    if (wordLeeches.includes(word)) outlineLeech();
  }
};

const showAnswerButton = document.querySelector("#show-answer");
if (showAnswerButton) {
  showAnswerButton.addEventListener("click", () => {
    setTimeout(() => warnOnLeech(), 100);
  }, {once: true, passive: true});
}

loadLeeches();
