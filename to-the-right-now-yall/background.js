function closeAllTabsToTheRightOf(currentTab) {
  // Close all tabs to the right of the current tab but only in the current window
  chrome.tabs.query({ windowId: currentTab.windowId }, function(allTabs) {
    const tabIds = allTabs.map((tab) => tab.id);
    const currentTabIndex = tabIds.indexOf(currentTab.id);

    for (let index = 0; index < allTabs.length; index++) {
      const tab = allTabs[index];
      if (index > currentTabIndex) {
        chrome.tabs.remove(tab.id);
      }
    }
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command == "close-tabs-to-the-right") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 1) {
        throw "More active tabs than anticipated";
      }
      closeAllTabsToTheRightOf(tabs[0]);
   });
  }
});

chrome.action.onClicked.addListener((currentTab) => {
  closeAllTabsToTheRightOf(currentTab);
});
