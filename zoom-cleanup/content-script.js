console.log("Running zoom-cleanup...")

const expectedZoomTitles = [
  "Your meeting has been launched. Don’t see your Zoom meeting?",
  "Click Open zoom.us on the dialog shown by your browser. If you don’t see a dialog, click Launch Meeting below"
];
const maxRetries = 15;
let retries = 0;

const interval = setInterval(() => {
  const zoomTitle = document.querySelector("#zoom-ui-frame h1").innerText.replace("\n", ". ");
  // We're on the tab we want to cleanup
  if (expectedZoomTitles.includes(zoomTitle)) {
    window.close();
  }

  if (retries == maxRetries) {
    clearInterval(interval);
  } else {
    console.log("Retrying zoom-cleanup...");
    retries += 1;
  }
}, 1000);
