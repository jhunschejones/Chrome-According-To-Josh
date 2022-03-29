document.addEventListener("copy", (event) => {
  // const lineBreaks = /(\r\n|\n|\r)/gm;
  const selection = document.getSelection();
  const textToCopy = selection.toString().trim();
  event.clipboardData.setData("text/plain", textToCopy);
  event.preventDefault();
});
