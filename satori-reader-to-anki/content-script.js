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
    xhr.addEventListener("error", () => reject("failed to issue request"));
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

// Wait for remote data request and page load
setTimeout(async () => {
  await getPermission();

  Array.from(document.querySelectorAll(".review-card")).forEach((reviewCard) => {
    const targetWordTranslation = reviewCard.querySelector(".review-card-back").innerText;

    // a word can have multiple contexts, map through each
    Array.from(reviewCard.querySelectorAll(".review-card-example-sentences-article-container .article")).forEach((article) => {
      // click to expand tooltip and load remote content for each sentence in card
      article.querySelector(".sentence .notes-button").click();
      document.body.click();

      // hide readings so they don't show up in cards
      Array.from(article.querySelectorAll(".fg, .wpr")).map((reading) => reading.display = "hidden")

      const targetWord = article.querySelector(".sentence .emphasis").innerText;
      const japaneseSentence = article.querySelector(".sentence [data-type='run']").innerText;
      const englishSentence = article.querySelector(".discussion").innerText;

      const addToAnkiButton = document.createElement("button");
      addToAnkiButton.textContent = "Add to Anki";
      addToAnkiButton.classList.add("add-to-anki-button");

      const tooltip = document.createElement("span");
      tooltip.appendChild(document.createTextNode("Added!"));
      tooltip.classList.add("tooltip-text");
      addToAnkiButton.classList.add("tooltip-target");
      addToAnkiButton.appendChild(tooltip);

      addToAnkiButton.addEventListener("click", () => {
        addNote(
          {
            "note": {
              "deckName": "Shaping",
              "modelName": "Japanese 2022 Sentence Card",
              "fields": {
                "Sentence": japaneseSentence,
                "Sentence Reading": japaneseSentence.replace(targetWord, `<span style="color: rgb(0, 124, 255);">${targetWord}</span>`),
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

      article.appendChild(addToAnkiButton);
    });
  });
}, 3000);
