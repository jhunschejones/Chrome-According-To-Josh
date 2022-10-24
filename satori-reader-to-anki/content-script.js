const getPermission = () => {
  // borrowed from https://foosoft.net/projects/anki-connect/
  return new Promise((resolve, reject) => {
    const action = "requestPermission";
    const version = 6;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("error", () => reject("failed to issue request"));
    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          alert(response.error);
          reject(response.error);
        }
        resolve(response.result);
      } catch (error) {
        reject(error);
      }
    });

    xhr.open("POST", "http://127.0.0.1:8765");
    xhr.send(JSON.stringify({action, version}));
  });
}

const addNote = (params={}) => {
  // borrowed from https://foosoft.net/projects/anki-connect/
  return new Promise((resolve, reject) => {
    const action = "addNote";
    const version = 6;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("error", () => {
      if (xhr.readyState == 4 && xhr.status == 0) {
        alert("Unknown Error Occured. Server response not received. Is Anki Connect running?");
      }
      reject("failed to issue request");
    });
    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length != 2) {
          throw "response has an unexpected number of fields";
        }
        if (!response.hasOwnProperty("error")) {
          throw "response is missing required error field";
        }
        if (!response.hasOwnProperty("result")) {
          throw "response is missing required result field";
        }
        if (response.error) {
          alert(response.error);
          reject(response.error);
        }
        resolve(response.result);
      } catch (error) {
        reject(error);
      }
    });

    xhr.open("POST", "http://127.0.0.1:8765");
    xhr.send(JSON.stringify({action, version, params}));
  });
};

const addButtons = () => {
  // turn on all furigana to get readings
  document.querySelector("#article-controls-furigana-all-label").click();

  Array.from(document.querySelectorAll(".review-card")).forEach((reviewCard) => {
    const targetWordTranslation = reviewCard.querySelector(".review-card-back").innerText;

    // a word can have multiple contexts, map through each
    Array.from(reviewCard.querySelectorAll(".review-card-example-sentences-article-container .article")).forEach((article) => {
      const buttonAlreadyExists = article.querySelector(".add-to-anki-button");
      if (buttonAlreadyExists) {
        return;
      }

      // click to expand tooltip and load remote content for each sentence in card
      article.querySelector(".sentence .notes-button").click();
      document.body.click();

      // hide extra readings so they don't show up in cards
      Array.from(article.querySelectorAll(".fg, .wpr")).map((reading) => reading.style.visibility = "hidden");

      const targetWord = Array.from(article.querySelectorAll(".sentence .emphasis"))
        .map((wordBit) => {
          // remove newlines
          return wordBit.innerText.split("\n").join("");
        })
        .join("");
      const targetWordWithReading = Array.from(article.querySelectorAll(".sentence .emphasis .wp"))
        .map((wordBit) => {
          const wordCharacterChunk = wordBit.querySelector(".wpt").textContent;
          const reading = wordBit.querySelector(".fg")?.textContent;
          if (reading) {
            return `${wordCharacterChunk}[${reading}]`;
          } else {
            return wordCharacterChunk;
          }
        })
        .join("");
      const japaneseSentence = article.querySelector(".sentence [data-type='run']").innerText.replace(/\n/g, "");
      const englishSentence = article.querySelector(".discussion").innerText;

      const addToAnkiButton = document.createElement("button");
      addToAnkiButton.textContent = "Add to Anki";
      addToAnkiButton.classList.add("add-to-anki-button");

      const tooltip = document.createElement("span");
      tooltip.appendChild(document.createTextNode("Added!"));
      tooltip.classList.add("tooltip-text");
      const container = document.createElement("div");
      container.classList.add("tooltip-target");
      container.appendChild(addToAnkiButton);
      container.appendChild(tooltip);
      article.appendChild(container);

      addToAnkiButton.addEventListener("click", () => {
        addNote(
          {
            "note": {
              "deckName": "Shaping",
              "modelName": "Japanese 2022 Sentence Card",
              "fields": {
                "Sentence": japaneseSentence,
                "Sentence Reading": japaneseSentence.replace(new RegExp(targetWord, "g"), `<span style="color: rgb(0, 124, 255);">${targetWordWithReading}</span>`),
                "Bilingual Definition": `${targetWordTranslation};<br><i>${englishSentence}</i>`,
                "Kanji Diagram Source": targetWord,
              },
              "tags": ["satori_reader"],
            }
          }
        ).then(() => {
          tooltip.classList.toggle("show", true);
          setTimeout(() => { tooltip.classList.toggle("show", false); }, 2000);
        }).catch((_error) => {
          // console.warn(error);
        })
      });
    });
  });

  // Load buttons for page navigation
  listenForPageNavigation();
};

const listenForPageNavigation = () => {
  Array.from(document.querySelectorAll(".review-card-browser-next")).forEach((button) => {
    button.addEventListener("click", () => {
      setTimeout(() => {
        addButtons();
      }, 2500);
    });
  });

  Array.from(document.querySelectorAll(".review-card-browser-previous")).forEach((button) => {
    button.addEventListener("click", () => {
      setTimeout(() => {
        addButtons();
      }, 2500);
    });
  });
};


// Wait for remote data request and initial page load
setTimeout(async () => {
  // await getPermission();
  addButtons();
}, 3000);