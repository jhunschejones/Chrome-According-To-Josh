// Background service worker for WaniKani Images extension
// Handles extension icon clicks to trigger re-parsing

chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes('wanikani.com')) {
    chrome.tabs.sendMessage(tab.id, { action: 'reparse' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('WaniKani Images: Error sending message:', chrome.runtime.lastError.message);
      }
    });
  }
});
