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

// NOTE: order-dependant, executing after the issues icon change will affect issues that are part of the career-journal
if (window.location.pathname.includes("/jhunschejones/career-journal")) {
  document.querySelectorAll(".js-site-favicon").forEach((icon) => {
    icon.href = chrome.runtime.getURL("/images/career-journal-icon.png");
  });
}
