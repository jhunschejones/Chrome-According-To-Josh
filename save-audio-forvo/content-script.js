function makeDownloadLinkFromAudioSource(audioSourceElement) {
  console.log(audioSourceElement.getAttribute("onclick"))
  const encodedPath = String(audioSourceElement.getAttribute("onclick")).match(/Play\(\d+,'([A-Za-z0-9=]+)',/)[1];
  const path = atob(encodedPath);

  const a = document.createElement("a");
  a.appendChild(document.createTextNode("💾"));
  a.title = "Download or copy";
  a.ariaLabel = "Download or copy";
  a.href = `https://audio00.forvo.com/mp3/${path}`;
  a.download = path.split("/").slice(-1)[0];
  a.target = "_blank"; // point the link at a new window in case it's clicked
  a.style.userSelect = "none";
  a.style.textDecoration = "none";

  audioSourceElement.parentElement.appendChild(a);

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
  document.querySelectorAll("span.play"),
  e => makeDownloadLinkFromAudioSource(e)
);

// Clean up UI to remove unneded sections
document.querySelector(".main_aside").style.display = "none";
document.querySelector(".sidebar-language").style.display = "none";
document.querySelector(".page_word").style.justifyContent = "center";
document.querySelector(".main_section").style.paddingRight = "0px";
document.querySelector(".main_section").style.width = "fit-content";

// I mean... might as well clean up adds layout while we're in here
Array.from(
  document.querySelectorAll("div.ad"),
  e => { e.style.display = "none"; }
);
