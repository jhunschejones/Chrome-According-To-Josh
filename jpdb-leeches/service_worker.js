const getLeechesFromGitHub = async () => {
  console.log("getLeechesFromGitHub");
  const kanjiLeeches = await fetch("https://raw.githubusercontent.com/jhunschejones/jpdb_stats/main/data/kanji_leeches.json", {mode: "no-cors"})
    .then((response) => response.json())
    .catch((_error) => console.error("Unable to get kanji leeches data from GitHub."));
  const wordLeeches = await fetch("https://raw.githubusercontent.com/jhunschejones/jpdb_stats/main/data/word_leeches.json", {mode: "no-cors"})
    .then((response) => response.json())
    .catch((_error) => console.error("Unable to get word leeches data from GitHub."));

  return {kanjiLeeches, wordLeeches};
};

const todayDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}`;
};

const setLeechesInLocalStorage = () => {
  console.log("setLeechesInLocalStorage")
  return getLeechesFromGitHub().then(({kanjiLeeches, wordLeeches}) => {
    chrome.storage.local.set({leechesValidOn: todayDateString()});
    chrome.storage.local.set({kanjiLeeches});
    chrome.storage.local.set({wordLeeches});
    return {kanjiLeeches, wordLeeches};
  })
};

const getLeechesFromLocalStorage = async () => {
  console.log("getLeechesFromLocalStorage")
  const {leechesValidOn} = await chrome.storage.local.get("leechesValidOn");
  // if these leeches are from today use the local ones
  if (leechesValidOn == todayDateString()) {
    const {kanjiLeeches} = await chrome.storage.local.get("kanjiLeeches");
    const {wordLeeches} = await chrome.storage.local.get("wordLeeches");
    return {kanjiLeeches, wordLeeches};
  }
  // ...otherwise get new ones
  return setLeechesInLocalStorage();
};

// Save leaches into local storage on extension install or update
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install" || reason === "update") {
    setLeechesInLocalStorage();
  }
});

// Send leeches to content script via messaging
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message === "getLeeches") {
    // getLeechesFromGitHub().then(leeches => sendResponse(leeches));
    getLeechesFromLocalStorage().then(leeches => sendResponse(leeches));
    return true;
  }
});
