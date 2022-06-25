function makeDownloadLinkAfterClick(event) {
  const playButtonElement = event.target;
  let tooltip;

  if (playButtonElement.querySelector(".tooltip-text")) {
    // Use the already existing tooltip
    tooltip = playButtonElement.querySelector(".tooltip-text");
  } else {
    // Build and add tooltip that will appear after click
    tooltip = document.createElement("span");
    tooltip.appendChild(document.createTextNode("Audio link copied!"));
    tooltip.classList.add("tooltip-text");
    playButtonElement.classList.add("tooltip-target");
    playButtonElement.appendChild(tooltip);
  }

  // Wait for player to be updated
  setTimeout(() => {
    const audioLink = document.querySelector("#audio-player source").src;
    navigator.clipboard.writeText(audioLink);
    tooltip.classList.toggle("show", true);
    setTimeout(() => { tooltip.classList.toggle("show", false); }, 2000);
  }, 1000);
}

setTimeout(() => {
  Array.from(document.querySelectorAll(".play-button"), playButton => {
    playButton.addEventListener("click", makeDownloadLinkAfterClick);
  });
  console.log("Save Audio Satori Reader is ready.");
}, 3500);
