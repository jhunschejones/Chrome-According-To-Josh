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
}

Array.from(
  document.querySelectorAll("span.play"),
  e => makeDownloadLinkFromAudioSource(e)
);

// I mean... might as well clean up adds layout while we're in here
document.querySelector(".main_aside").style.display = "none";
document.querySelector(".mainpage").style.paddingRight = "0px";
Array.from(
  document.querySelectorAll("div.ad"),
  e => { e.style.display = "none"; }
);
