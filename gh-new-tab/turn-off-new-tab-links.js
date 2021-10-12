// Don't run this script on tabs that don't match the github url
if (window.location.href.match(/https:\/\/github\.com\/*/)) {
  Array.from(
    document.querySelectorAll(".changed-by-gh_new_tab"),
    e => { e.target = "_self" }
  );
}
