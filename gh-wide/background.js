function executeContentScript(tab) {
  // Restrict to just pulls or issues with: /https:\/\/.*github\.com\/.*\/(pull|issues)\/*/
  if (tab.url.match(/https:\/\/.*github\.com\/*/)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"]
    });
  }
}

chrome.action.onClicked.addListener((tab) => {
  executeContentScript(tab);
});

chrome.commands.onCommand.addListener((command) => {
  if (command == "toggle-gh-wide") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 1) {
        throw "More active tabs than anticipated";
      }
      executeContentScript(tabs[0]);
   });
  }
});
