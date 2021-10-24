function makeDownloadLinkFromAudioSource(audioSourceElement) {
  const audioClipNumber = audioSourceElement.src.split("/").slice(-1)[0].split("=").slice(-1)[0].split(".")[0];
  const a = document.createElement("a");
  if (audioSourceElement.src.includes(".php")) {
    a.appendChild(document.createTextNode("👴🏻"));
    a.title = "Download";
    a.ariaLabel = "Download";
  } else {
    a.appendChild(document.createTextNode("💾"));
    a.title = "Download or copy";
    a.ariaLabel = "Download or copy";
  }
  a.href = audioSourceElement.src;
  a.download = audioClipNumber + ".mp3";
  a.target = "_blank"; // point the link at a new window in case it's clicked
  a.style.userSelect = "none";
  a.style.textDecoration = "none";

  if (window.location.pathname == "/japanese-dictionary/") {
    audioSourceElement.parentElement.parentElement.parentElement.appendChild(a);
  } else if (window.location.pathname == "/japanese-word-lists/") {
    audioSourceElement.parentElement.appendChild(a);
  }
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
}

if (window.location.pathname == "/japanese-word-lists/") {
  Array.from(
    document.querySelectorAll(".wlv-item__word-container .wlv-item__audio-box audio"),
    e => makeDownloadLinkFromAudioSource(e)
  );
}

// If we're on the ditionary page and a search was passed in, execute it!
if (window.location.pathname == "/japanese-dictionary/") {
  const search = Object.fromEntries(new URLSearchParams(window.location.search).entries())["search"];
  if (search != undefined) {
    document.getElementById("dc-search-input").value = search;
    document.getElementById("dc-search-button").click();
  }
}
