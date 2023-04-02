function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function buildImageSearchLink(wordToSearch) {
  const a = document.createElement("a");
  a.appendChild(document.createTextNode("📷"));
  a.title = "Image search";
  a.ariaLabel = "Image search";
  a.href = `https://www.google.com/search?q=${wordToSearch}&tbm=isch`;
  a.target = "_blank";
  a.style.padding = "0px 12px";
  a.style.marginRight = "-52px";
  a.style.fontSize = "28px"
  return a;
}

function addImageSearchLink() {
  const vocabWordNode = document.querySelector(".answer-box .plain").childNodes[2];
  let vocabWord = "";
  if (vocabWordNode.nodeName == "A") {
    vocabWord = vocabWordNode.href.split("/").slice("-1")[0].replace("#a", "");
    // It's a link out to the word definition page
  } else {
    // It's probably a div
    vocabWord = vocabWordNode.textContent;
  }

  if (vocabWord.length > 0) {
    const imageSearchLink = buildImageSearchLink(vocabWord);
    insertAfter(imageSearchLink, vocabWordNode);
  }
}

// Wait for js on the page to load before running
setTimeout(() => {

  const answerButton = document.querySelector("#show-answer");
  if (answerButton) {
    // React to answer button or space bar click
    answerButton.addEventListener("click", () => {
      if (document.querySelector(".answer-box .kind")?.textContent == "Vocabulary") {
        // This is a vocabulary card
        setTimeout(() => { addImageSearchLink() }, 100);
      }
    });
  }

  if (window.location.search.includes("?c=")) {
    // We're already on the answer page
    setTimeout(() => { addImageSearchLink() }, 100);
  }

  // If we need to observe URL changes, this works:
  // let previousUrl = "";
  // const observer = new MutationObserver(function(mutations) {
  //   if (window.location.href !== previousUrl) {
  //     previousUrl = window.location.href;
  //     console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
  //   }
  // });
  // const config = {subtree: true, childList: true};

  // // start listening to changes
  // observer.observe(document, config);
}, 100);
