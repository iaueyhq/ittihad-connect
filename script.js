function setTheme(theme) {
  document.body.className = ""; // reset
  if (theme === "dark") document.body.classList.add("dark");
  if (theme === "glass") document.body.classList.add("glass");
  localStorage.setItem("theme", theme); // save theme
}

window.onload = () => {
  displayPosts();
  let saved = localStorage.getItem("theme") || "light";
  setTheme(saved);
};
