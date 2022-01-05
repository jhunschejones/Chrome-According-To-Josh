chrome.action.onClicked.addListener((tab) => {
  if (tab.url.match(/https:\/\/.*github\.com\/.*\/(pull|issues)\/*/)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"]
    });
  }
});
