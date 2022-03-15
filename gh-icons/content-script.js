if (window.location.pathname == "/notifications") {
  document.querySelectorAll(".js-site-favicon").forEach((icon) => {
    icon.href = chrome.runtime.getURL("/images/notifications-icon.png");
  });
}

if (window.location.pathname.includes("/projects/")) {
  // custom styling for my personal project board
  if (window.location.pathname.includes("/github/projects/5488")) {
    document.querySelectorAll(".js-site-favicon").forEach((icon) => {
      if (icon.type == "image/png") {
        icon.href = chrome.runtime.getURL("/images/to-do-list.png");
      } else {
        icon.parentNode.removeChild(icon);
      }
    });
  } else {
    document.querySelectorAll(".js-site-favicon").forEach((icon) => {
      if (icon.type == "image/png") {
        icon.href = chrome.runtime.getURL("/images/projects-icon.png");
      } else {
        icon.parentNode.removeChild(icon);
      }
    });
  }
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
