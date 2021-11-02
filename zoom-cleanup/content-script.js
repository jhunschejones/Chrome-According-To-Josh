const zoomTitle = document.querySelector("#zoom-ui-frame h1").innerText.replace("\n", ". ");
const expectedZoomTitles = ["Your meeting has been launched. Don’t see your Zoom meeting?", "Click Open zoom.us on the dialog shown by your browser. If you don’t see a dialog, click Launch Meeting below"]

if (expectedZoomTitles.includes(zoomTitle)) {
  // We're on the tab we want to cleanup
  setTimeout(() => {
    window.close();
  }, 1000);
}
