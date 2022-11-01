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
  }

  setTimeout(async () => {
    // await app.getPermission();

    const words = document.querySelectorAll("[data-index]");
    Array.from(words).forEach((word) => {
      const phrase = word.querySelector(".sentence-view");
      const translation = phrase.parentNode.parentNode.parentNode.nextSibling;

      const addToAnkiButton = document.createElement("button");
      addToAnkiButton.textContent = "Anki";
      addToAnkiButton.classList.add("add-to-anki-button");
      addToAnkiButton.style.cursor = "pointer";

      const tooltip = document.createElement("span");
      tooltip.appendChild(document.createTextNode("Added!"));
      tooltip.classList.add("lrd-tooltip-text");

      const container = document.createElement("div");
      container.classList.add("lrd-tooltip-target");
      container.appendChild(addToAnkiButton);
      container.appendChild(tooltip);

      const lastColumn = phrase.parentNode.parentNode.parentNode.nextSibling.nextSibling.nextSibling;
      lastColumn.setAttribute("style", "width: 120px; flex-shrink: 0;");
      lastColumn.appendChild(container);

      addToAnkiButton.addEventListener("click", () => {
        app.addNote(
          {
            "note": {
              "deckName": "Shaping",
              "modelName": "Japanese 2022 Sentence Card",
              "fields": {
                "Sentence": phrase.textContent,
                "Sentence Reading": phrase.textContent,
                "Bilingual Definition": `<br><i>${translation.textContent}</i>`,
              },
              "tags": ["language_reactor"],
            }
          }
        ).then(() => {
          // show confirmation new note was added
          tooltip.classList.toggle("show", true);
          setTimeout(() => { tooltip.classList.toggle("show", false); }, 2000);
        }).catch((_error) => {
          // console.warn(error);
        });
      })
    });
  }, 2000);
})();
