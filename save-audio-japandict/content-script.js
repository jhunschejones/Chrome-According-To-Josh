function makeDownloadLinkFromAudioSource(audioSourceElement) {
  let url, text, token;
  [url, text, token] = JSON.parse(audioSourceElement.dataset.reading);

  // const possibleFileName = Array.from(
  //   document.querySelectorAll("div[lang='en']")
  // ).map((e) => e.innerText).join(", ");

  const a = document.createElement("a");
  a.appendChild(document.createTextNode("💾"));
  a.title = "Download or copy";
  a.ariaLabel = "Download or copy";
  // 💁🏼 The `fileFormatForAnkiDownload` query param is only in this URL to activate Anki's
  // auto-download feature, it is not required to build a valid audio link.
  a.href = `https:${url}/read?text=${text}&outputFormat=mp3&jwt=${token}&fileFormatForAnkiDownload=.mp3`;
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
