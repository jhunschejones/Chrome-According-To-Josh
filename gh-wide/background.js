chrome.action.onClicked.addListener((tab) => {
  // Restrict to just pulls or issues with: /https:\/\/.*github\.com\/.*\/(pull|issues)\/*/
  if (tab.url.match(/https:\/\/.*github\.com\/*/)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"]
    });
  }
});
