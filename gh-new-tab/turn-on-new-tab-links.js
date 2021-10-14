(function () {
  const ESTIMATED_PAGE_LOAD_TIME_MS = 600;

  function enableNewPageLinksForIssueCardBody() {
    setTimeout(function() {
      // === Enable for all links inside an issue card on the projects page
      Array.from(document.querySelectorAll(".js-project-issue-body-container a"), e => {
        e.target = "_blank";
        e.classList.add("changed-by-gh_new_tab");
      });
    }, ESTIMATED_PAGE_LOAD_TIME_MS);
  }

  // Don't run this script on tabs that don't match the github url
  if (window.location.href.match(/https:\/\/.*github\.com\/*/)) {
    // Enable new links in main README's container on github.com
    Array.from(document.querySelectorAll("#readme a"), e => {
      e.target = "_blank";
      e.classList.add("changed-by-gh_new_tab");
    });

    // === Enable new links in document body on thehub.github.com
    Array.from(document.querySelectorAll(".site-content .markdown-body a"), e => {
      e.target = "_blank";
      e.classList.add("changed-by-gh_new_tab");
    });

    // === Enable new links in cards on github project boards
    setTimeout(function() {
      // When a user clicks on an issue card, enable for all links there
      Array.from(document.querySelectorAll("a.js-project-card-issue-link"), e => {
        e.addEventListener("click", enableNewPageLinksForIssueCardBody);
      });

      // Enable for already open issue cards
      Array.from(document.querySelectorAll(".js-project-issue-body-container a"), e => {
        e.target = "_blank";
        e.classList.add("changed-by-gh_new_tab");
      });
    }, ESTIMATED_PAGE_LOAD_TIME_MS);
  }
})();
