if (window.location.pathname == "/notifications") {
  document.querySelectorAll(".js-site-favicon").forEach((icon) => {
    icon.href = chrome.runtime.getURL("/images/notifications-icon.png");
  });
}

if (window.location.pathname.includes("/issues/")) {
  document.querySelectorAll(".js-site-favicon").forEach((icon) => {
    icon.href = chrome.runtime.getURL("/images/issues-icon.png");
  });
}
