if (window.location.pathname == "/notifications") {
  document.querySelectorAll(".js-site-favicon").forEach((icon) => {
    icon.href = chrome.runtime.getURL("/images/notifications-icon.png");
  });
}

if (window.location.pathname.includes("/issues/")) {
  if (window.location.pathname.includes("/career-journal/")) {
    document.querySelectorAll(".js-site-favicon").forEach((icon) => {
      icon.href = chrome.runtime.getURL("/images/career-journal-icon.png");
    });
  } else {
    document.querySelectorAll(".js-site-favicon").forEach((icon) => {
      icon.href = chrome.runtime.getURL("/images/issues-icon.png");
    });
  }
}
