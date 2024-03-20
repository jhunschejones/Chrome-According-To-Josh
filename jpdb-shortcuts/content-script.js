const handleShortcut = (event) => {

  // shortcut to toggle open main nav
  if (event.key === "n") {
    const menuButton = document.querySelector("#menu-btn");
    if (menuButton) return menuButton.click();
  }

}

document.addEventListener("keydown", handleShortcut);
