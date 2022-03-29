function makeDownloadLinkFromAudioSource(audioSourceElement) {
  const audioElementId = audioSourceElement.getAttribute("data-id");
  const audioElement = document.getElementById(audioElementId);
  const mp3Source = audioElement.querySelector("source[type='audio/mpeg']");
  const japaneseWord = audioElementId.match(/audio_(.+):/)[1];

  const a = document.createElement("a");
  a.appendChild(document.createTextNode("💾"));
  a.title = "Download or copy";
  a.ariaLabel = "Download or copy";
  a.href = mp3Source.src;
  a.download = japaneseWord;
  a.target = "_blank"; // point the link at a new window in case it's clicked
  a.style.userSelect = "none";
  a.style.textDecoration = "none";

  audioSourceElement.after(a);

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

Array.from(
  document.querySelectorAll("a.concept_audio"),
  e => makeDownloadLinkFromAudioSource(e)
);
