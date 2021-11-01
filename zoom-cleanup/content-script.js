if (
  document.querySelector("#zoom-ui-frame h1").innerText.replace("\n", ". ") ==
    "Click Open zoom.us on the dialog shown by your browser. If you don’t see a dialog, click Launch Meeting below"
  ) {
  // We're on the tab we want to cleanup
  setTimeout(() => {
    window.close();
  }, 1000);
}
