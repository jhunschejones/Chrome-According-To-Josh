// activate on icon press
chrome.action.onClicked.addListener(() => {
  chrome.tabGroups.query({}, (groups) => {
    groups.forEach(group => {
      chrome.tabGroups.update(group.id, { collapsed: true });
    });
  });
});

// activate on keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "collapse-all-groups") {
    chrome.tabGroups.query({}, (groups) => {
      groups.forEach(group => {
        chrome.tabGroups.update(group.id, { collapsed: true });
      });
    });
  }
});
