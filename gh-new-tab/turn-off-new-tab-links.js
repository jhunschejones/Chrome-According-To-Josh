(function () {
  // Don't run this script on tabs that don't match the github url
  if (window.location.href.match(/https:\/\/.*github\.com\/*/)) {
    // Re-set all previously updated elements
    Array.from(
      document.querySelectorAll(".changed-by-gh_new_tab"),
      e => { e.target = "_self" }
    );
    // Remove event listener on issue title clicks from project cards
    Array.from(document.querySelectorAll("a.js-project-card-issue-link"), e => {
      const newElement = e.cloneNode(true);
      e.parentNode.replaceChild(newElement, e);
    });
  }
})();
