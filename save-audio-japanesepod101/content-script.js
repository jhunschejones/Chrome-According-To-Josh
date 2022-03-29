function makeDownloadLinkFromAudioSource(audioSourceElement) {
  const audioClipNumber = audioSourceElement.src.split("/").slice(-1)[0].split("=").slice(-1)[0].split(".")[0];
  const a = document.createElement("a");
  a.appendChild(document.createTextNode("💾"));
  a.title = "Download or copy";
  a.ariaLabel = "Download or copy";
  a.href = audioSourceElement.src;
  if (!a.href.endsWith(".mp3")) {
  // 💁🏼 The `fileFormatForAnkiDownload` query param is only in this URL to activate Anki's
  // auto-download feature, it is not required to build a valid audio link.
    a.href = `${a.href}&fileFormatForAnkiDownload=.mp3`;
  }
  a.download = audioClipNumber + ".mp3";
  a.target = "_blank"; // point the link at a new window in case it's clicked
  a.style.userSelect = "none";
  a.style.textDecoration = "none";

  if (window.location.pathname == "/japanese-dictionary/") {
    audioSourceElement.parentElement.parentElement.parentElement.appendChild(a);
  } else if (window.location.pathname == "/japanese-word-lists/") {
    audioSourceElement.parentElement.appendChild(a);
  }

  // Build and add tooltip that will appear after click
  const tooltip = document.createElement("span");
  tooltip.appendChild(document.createTextNode("Coppied!"));
  tooltip.classList.add("tooltip-text");
  a.classList.add("tooltip-target");
  a.appendChild(tooltip);

  // Copy-on-click functionality
  a.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    navigator.clipboard.writeText(a.href);
    tooltip.classList.toggle("show", true);
    setTimeout(() => { tooltip.classList.toggle("show", false); }, 2000);
  });
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
if (window.location.pathname == "/japanese-dictionary/") {
  document.getElementById("dc-search-form").addEventListener("submit", reactToNewResults);
  document.getElementById("dc-search-button").addEventListener("click", reactToNewResults);
}

if (window.location.pathname == "/japanese-word-lists/") {
  Array.from(
    document.querySelectorAll(".wlv-item__word-container .wlv-item__audio-box audio"),
    e => makeDownloadLinkFromAudioSource(e)
  );
}
