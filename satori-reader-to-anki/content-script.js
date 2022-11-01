(() => {
  const app = {
    getPermission: () => {
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
    },
    addNote: (params = {}) => {
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
    },
    addCopyAllKanjiButton: () => {
      // don't create duplicate buttons, we can re-use the same button from one page to the next
      if (document.querySelector(".srta-copy-all-kanji-button")) {
        return;
      }

      const copyAllKanjiButton = document.createElement("button");
      copyAllKanjiButton.textContent = "Copy all kanji";
      copyAllKanjiButton.classList.add("srta-copy-all-kanji-button");
      copyAllKanjiButton.title = "Copy kanji in example sentences to clipboard";

      const tooltip = document.createElement("span");
      tooltip.appendChild(document.createTextNode("Copied!"));
      tooltip.classList.add("srta-tooltip-text");
      const buttonWithToolTipContainer = document.createElement("div");
      buttonWithToolTipContainer.classList.add("srta-tooltip-target");
      buttonWithToolTipContainer.appendChild(copyAllKanjiButton);
      buttonWithToolTipContainer.appendChild(tooltip);

      const allKanji = document.createElement("div");
      allKanji.classList.add("srta-all-kanji");
      allKanji.style.display = "none";

      const loadStatusMessage = document.querySelector("#review-card-browser-load-status");
      loadStatusMessage.parentNode.insertBefore(buttonWithToolTipContainer, loadStatusMessage.nextSibling);
      loadStatusMessage.parentNode.insertBefore(allKanji, loadStatusMessage.nextSibling);

      copyAllKanjiButton.addEventListener("click", () => {
        const textToCopy = document.querySelector(".srta-all-kanji").innerText;
        navigator.clipboard.writeText(textToCopy);
        tooltip.classList.toggle("show", true);
        setTimeout(() => { tooltip.classList.toggle("show", false); }, 2000);
      });
    },
    addCreateAnkiNoteButtons: () => {
      // turn on all furigana to get readings
      document.querySelector("#article-controls-furigana-all-label").click();

      Array.from(document.querySelectorAll(".review-card")).forEach((reviewCard) => {
        const targetWordTranslation = reviewCard.querySelector(".review-card-back").innerText;

        // a word can be saved with multiple contexts, map through each
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

          // we need to handle cases where the target word may be split into multiple words,
          // or occur multiple times in the example sentence
          let targetWordArray = [];
          let targetWordWithReadingArray = [];
          if (article.querySelectorAll(".sentence .emphasis").length > 1) {

            // this is definitly part of the word
            const firstWordBit = article.querySelectorAll(".sentence .emphasis")[0];
            targetWordArray.push(firstWordBit);
            targetWordWithReadingArray.push(firstWordBit.querySelector(".wp"));

            // this _may_ be part of the word
            let nextWordBit = firstWordBit.nextElementSibling;
            while (nextWordBit) {
              // skip trailing "space" elements
              if (nextWordBit.classList.contains("space")) {
                nextWordBit = nextWordBit.nextElementSibling;
              }
              // if the next child is still not an "emphasis" element we're done with the word
              if (!nextWordBit.classList.contains("emphasis")) {
                break;
              }

              // if we've reached here the next bit is still part of the word
              targetWordArray.push(nextWordBit);
              targetWordWithReadingArray.push(nextWordBit.querySelector(".wp"));
              nextWordBit = nextWordBit.nextElementSibling;
            }
          } else {
            // when there is just one "emphasis" element for the word we can take the easy way out
            targetWordArray = Array.from(article.querySelectorAll(".sentence .emphasis"));
            targetWordWithReadingArray = Array.from(article.querySelectorAll(".sentence .emphasis .wp"));
          }

          const targetWord = targetWordArray
            .map((wordBit) => {
              // remove newlines
              return wordBit.innerText.split("\n").join("");
            })
            .join("");
          const targetWordWithReading = targetWordWithReadingArray
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
          // add example sentence kanji to the all-kanji element which gets copied when the "Copy all kanji" button is clicked
          document.querySelector(".srta-all-kanji").innerText += japaneseSentence.replace(/[^一-龯]/g, "");
          const englishSentence = article.querySelector(".discussion").innerText;

          const addToAnkiButton = document.createElement("button");
          addToAnkiButton.textContent = "Add to Anki";
          addToAnkiButton.title = "Create a new note in Anki with this context";
          addToAnkiButton.classList.add("srta-add-to-anki-button");

          const tooltip = document.createElement("span");
          tooltip.appendChild(document.createTextNode("Added!"));
          tooltip.classList.add("srta-tooltip-text");
          const container = document.createElement("div");
          container.classList.add("srta-tooltip-target");
          container.classList.add("srta-add-to-anki-button-container");
          container.appendChild(addToAnkiButton);
          container.appendChild(tooltip);
          article.appendChild(container);

          addToAnkiButton.addEventListener("click", () => {
            app.addNote(
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

      app.resetOnPaginationClick();
    },
    addCreateAnkiNoteButtonsWithRetry: (retrySeconds = 2500) => {
      if (document.querySelectorAll(".review-card").length > 0) {
        // clean up any old buttons
        Array.from(document.querySelectorAll(".srta-add-to-anki-button-container")).forEach((button) => button.parentNode.removeChild(button));
        app.addCreateAnkiNoteButtons();
      } else {
        // retry one time in case page load is just slow
        setTimeout(() => {
          // clean up any old buttons
          Array.from(document.querySelectorAll(".srta-add-to-anki-button-container")).forEach((button) => button.parentNode.removeChild(button));
          app.addCreateAnkiNoteButtons();
        }, retrySeconds);
      }
    },
    resetOnPaginationClick: () => {
      Array.from(document.querySelectorAll(".review-card-browser-next")).forEach((button) => {
        button.addEventListener("click", () => {
          document.querySelector(".srta-all-kanji").innerText = "";
          document.querySelector(".srta-copy-all-kanji-button").style.visibility = "hidden";
          setTimeout(() => {
            document.querySelector(".srta-copy-all-kanji-button").style.visibility = "";
            app.addCreateAnkiNoteButtonsWithRetry();
          }, 1500);
        });
      });

      Array.from(document.querySelectorAll(".review-card-browser-previous")).forEach((button) => {
        button.addEventListener("click", () => {
          document.querySelector(".srta-all-kanji").innerText = "";
          document.querySelector(".srta-copy-all-kanji-button").style.visibility = "hidden";
          setTimeout(() => {
            document.querySelector(".srta-copy-all-kanji-button").style.visibility = "";
            app.addCreateAnkiNoteButtonsWithRetry();
          }, 1500);
        });
      });
    },
    addRefreshButton: () => {
      // don't create duplicate buttons, we can re-use the same button from one page to the next
      if (document.querySelector(".srta-recreate-kanji-buttons")) {
        return;
      }

      const recreateAnkiButtonsButton = document.createElement("button");
      recreateAnkiButtonsButton.textContent = "🔄";
      recreateAnkiButtonsButton.classList.add("srta-recreate-kanji-buttons");
      recreateAnkiButtonsButton.title = "Recreate all Add to Anki buttons";
      recreateAnkiButtonsButton.style.top = "64px";
      recreateAnkiButtonsButton.style.right = "12px";
      recreateAnkiButtonsButton.style.position = "absolute";
      recreateAnkiButtonsButton.style.background = "none";
      recreateAnkiButtonsButton.style.border = "none";
      recreateAnkiButtonsButton.style.fontSize = "1.4em";

      document.querySelector("#review-card-browser-cards-page").appendChild(recreateAnkiButtonsButton);

      recreateAnkiButtonsButton.addEventListener("click", app.addCreateAnkiNoteButtonsWithRetry);
    }
  };

  // wait for remote data request and initial page load
  setTimeout(async () => {
    // await app.getPermission();
    app.addCopyAllKanjiButton();
    app.addRefreshButton();
    app.addCreateAnkiNoteButtonsWithRetry(4000);
  }, 2500);
})();
