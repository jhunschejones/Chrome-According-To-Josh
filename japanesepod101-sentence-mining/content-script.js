function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function makeDownloadLinkFromAudioSource(audioSourceElement) {
  const audioClipName = audioSourceElement.dataset.src.split("/").reverse()[1];

  const a = document.createElement("a");
  a.appendChild(document.createTextNode("💾"));
  a.title = "Download or copy";
  a.ariaLabel = "Download or copy";
  a.href = audioSourceElement.dataset.src;
  a.download = audioClipName + ".mp3";
  a.target = "_blank"; // point the link at a new window in case it's clicked
  a.style.userSelect = "none";
  a.style.textDecoration = "none";
  a.classList.add("save-link");

  const td = document.createElement("td");
  td.appendChild(a);
  td.style.width = "36px";
  audioSourceElement.parentElement.style.width = "36px"; // set play button td width to match
  insertAfter(td, audioSourceElement.parentElement); // add our td after the play button td

  // Build and add tooltip that will appear after click
  const tooltip = document.createElement("span");
  tooltip.appendChild(document.createTextNode("Copied!"));
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

function buildSavedButtons() {
  // Tabs go in this order:
  // Kanji, English, Romaji, Hiragana, All
  const tabNumbers = ["00", "01", "02", "03", "all_0"];
  tabNumbers.forEach(tabNumber => {
    Array.from(
      document.querySelectorAll(`#dialogue_panel_${tabNumber} button[title="Play"]`),
      e => makeDownloadLinkFromAudioSource(e)
    );
  });
}

buildSavedButtons();

document.querySelector('[aria-label="Next Lesson"]').addEventListener("click", () => {
  // Wait for JS to run
  setTimeout(() => {
    buildSavedButtons();
  }, 600);
});
document.querySelector('[aria-label="Previous Lesson"]').addEventListener("click", () => {
  // Wait for JS to run
  setTimeout(() => {
    buildSavedButtons();
  }, 600);
});
