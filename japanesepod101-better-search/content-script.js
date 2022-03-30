if (window.location.pathname == "/japanese-dictionary/") {

  // If there's a signup modal, close it
  try {
    document.querySelector(".lightBox-signup-header-close").click();
  } catch (error) {
    console.log("No removable modal found");
  }

  // If there's a banner on the page, try to remove it
  try {
    const xpath = "//p[starts-with(text(),'Start Learning Japanese')]";
    const banner = document
      .evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      .singleNodeValue
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .parentElement;
    banner.parentNode.removeChild(banner);
  } catch (error) {
    console.log("No removable banner found");
  }

  // If there's a free trial link, try to remove it
  try {
    // Remove the free trial link from the top menu
    const freeTrialLink = document.querySelector("a.dashbar-a__free-trial");
    const freeTrialMenuBlock = freeTrialLink.parentNode.parentNode;
    freeTrialMenuBlock.parentNode.removeChild(freeTrialMenuBlock);

    // Float the login button right
    const signInLink = document.querySelector("a.dashbard-a__sign-in");
    const signInMenueBlock = signInLink.parentNode.parentNode;
    signInMenueBlock.style.float = "right";

    // Remove the features block below the results
    const featuresBlock = document.querySelector(".dc-features-box");
    featuresBlock.parentNode.removeChild(featuresBlock);
  } catch (error) {
    console.log("No free trial link found")
  }

  // If we're on the ditionary page and a search was passed in, execute it
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("search")) {
    setTimeout(function() {
      document.getElementById("dc-search-input").value = urlParams.get("search");
      document.getElementById("dc-search-button").click();
    }, 500); // give the page enough time to load so the click event can be picked up by event listeners
  }

  // If no search results are found, try to search again with uncommon words included
  setTimeout(function() {
    if (document.querySelector(".dc-found-text").innerText == "Found 0 entries") {
      if (document.querySelector("#dc-search-common").checked) {
        document.querySelector("#dc-search-common").click();
        document.getElementById("dc-search-button").click();
      }
    }
  }, 6000);
}

// If we're on the wordlist page and getting the default core 100 list, go to the core 2000 list instead
if (window.location.pathname == "/japanese-word-lists/") {
  const urlParams = new URLSearchParams(window.location.search);
  if (["100", null].includes(urlParams.get("coreX"))) {
    urlParams.set("coreX", "2000");
    window.location.search = `?${urlParams.toString()}`;
  }
}
