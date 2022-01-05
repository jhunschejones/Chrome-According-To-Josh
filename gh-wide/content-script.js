var rightBar = document.querySelector("#partial-discussion-sidebar");
var mainLayout = document.querySelector(".Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end");

function wideView() {
  rightBar.style.display = "none";
  mainLayout.style.display = "block";
}

function defaultView() {
  rightBar.style.display = "";
  mainLayout.style.display = "grid";
}

// Toggle between wide view and default view when the script runs
if (rightBar.style.display == "none") {
  defaultView();
} else {
  wideView();
}
