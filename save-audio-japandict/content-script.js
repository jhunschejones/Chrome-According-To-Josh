function makeDownloadLinkFromAudioSource(audioSourceElement) {
  let url, text, token;
  [url, text, token] = JSON.parse(audioSourceElement.dataset.reading);

  const a = document.createElement("a");
  a.appendChild(document.createTextNode("💾"));
  a.title = "Download or copy";
  a.ariaLabel = "Download or copy";
  a.href = `https:${url}/read?text=${text}&outputFormat=mp3&jwt=${token}`;
  a.download = `${text}.mp3`;
  a.target = "_blank"; // point the link at a new window in case it's clicked
  a.style.userSelect = "none";
  a.style.textDecoration = "none";

  // Sentence audio files can go in the same parent
  if (audioSourceElement.parentElement.lang == "ja") {
    audioSourceElement.parentElement.appendChild(a);
  } else {
    // All other audio files can go up two parents
    audioSourceElement.parentElement.parentElement.appendChild(a);
  }
}

Array.from(
  document.querySelectorAll(".play-reading-btn"),
  e => makeDownloadLinkFromAudioSource(e)
);

// I mean... might as well hide adds while we're in here
Array.from(
  document.querySelectorAll(".adsbygoogle"),
  e => { e.style.display = "none" }
);
