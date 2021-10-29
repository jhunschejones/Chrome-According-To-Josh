// Replace the favicons
document.querySelectorAll(".js-site-favicon").forEach((icon) => {
  icon.href = chrome.runtime.getURL("/images/new-icon.png");
});
