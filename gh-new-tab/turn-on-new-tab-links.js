// Don't run this script on tabs that don't match the github url
if (window.location.href.match(/https:\/\/github\.com\/*/)) {
  Array.from(document.querySelectorAll("#readme a"), e => {
    e.target = "_blank";
    e.classList.add("changed-by-gh_new_tab");
  });
}
