/**
 * Creates a dark mode event triggered when the toggle is clicked
 * 
 * */
// Dark mode toggle
const darkModeToggle = document.getElementById("theme-toggle-button");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const logo= document.getElementById("logo");
  if (document.body.classList.contains("dark-mode")) {
    logo.src = "./assets/logo-dark.svg";
  }
  else {
    logo.src = "./assets/logo-light.svg";
  }
});  // swap logo image based on mode
