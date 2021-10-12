function executeScriptOnAllGitHubTabs(script) {
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      // Run JS to update page content for all tabs that are for github pages
      if (tabs[i].url.match(/https:\/\/github\.com\/*/)) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[i].id },
          files: [script]
        });
      }
    }
  });
}

chrome.webNavigation.onCompleted.addListener(function() {
  // 1. Check current local storage value
  chrome.storage.local.get(["gh_new_tab"], function(result) {
    if(result.gh_new_tab == "enabled") {
      // 2. Update all tabs if the extension is enabled
      console.log("enable on page load");
      executeScriptOnAllGitHubTabs("turn-on-new-tab-links.js");
      // 3. Update the icon
      chrome.action.setIcon({path: "/images/icon-32x32.png"});
    } else {
      chrome.action.setIcon({path: "/images/icon-disabled-32x32.png"});
    }
  });
});

chrome.action.onClicked.addListener((_tab) => {
  // 1. Check local storage
  chrome.storage.local.get(["gh_new_tab"], function(result) {
    if(result.gh_new_tab == "enabled") {
      // 2. Update local storage
      chrome.storage.local.set({"gh_new_tab": "disabled"}, function() {
        // 3. Update all tabs if the extension is enabled
        console.log("disable on click");
        executeScriptOnAllGitHubTabs("turn-off-new-tab-links.js");
        // 4. Update the icon
        chrome.action.setIcon({path: "/images/icon-disabled-32x32.png"});
      });
    } else {
      // 2. Update local storage
      chrome.storage.local.set({"gh_new_tab": "enabled"}, function() {
        // 3. Update all tabs if the extension is enabled
        console.log("enable on click");
        executeScriptOnAllGitHubTabs("turn-on-new-tab-links.js");
        // 4. Update the icon
        chrome.action.setIcon({path: "/images/icon-32x32.png"});
      });
    }
  });
});
