function makeDownloadLinkFromAudioSource(audioSourceElement) {
  const audioClipNumber = audioSourceElement.src.split("/").slice(-1)[0].split("=").slice(-1)[0].split(".")[0];
  const a = document.createElement("a");
  a.appendChild(document.createTextNode("💾"));
  a.title = "Download";
  a.ariaLabel = "Download";
  a.href = audioSourceElement.src;
  a.download = audioClipNumber + ".mp3";
  a.target = "_blank"; // point the link at a new window in case it's clicked
  a.style.userSelect = "none";

  audioSourceElement.parentElement.parentElement.parentElement.appendChild(a);
}

function reactToNewResults() {
  // Add the new download buttons to the DOM
  setTimeout(function() {
    Array.from(
      document.querySelectorAll('audio:not([data-speed="0.5"]) source'),
      e => makeDownloadLinkFromAudioSource(e)
    );
  }, 500);

  // Watch any new pagination buttons
  setTimeout(function() {
    Array.from(
      document.querySelectorAll(".r101-pagination--a__item"),
      e => e.addEventListener("click", reactToNewResults)
    );
  }, 1000);
}

// Watch the search form
document.getElementById("dc-search-form").addEventListener("submit", reactToNewResults);
