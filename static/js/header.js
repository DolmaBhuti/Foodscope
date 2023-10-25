//get references to nav bar list and hamburger menu button
const navList = document.querySelector(".primary-navigation");
const navMenuToggle = document.querySelector(".mobile-nav-toggle");

navMenuToggle.addEventListener("click", () => {
  const visibility = navList.getAttribute("data-visible");

  if (visibility === "false") {
    navList.setAttribute("data-visible", true);
    navMenuToggle.setAttribute("aria-expanded", true);
  } else if (visibility === "true") {
    navList.setAttribute("data-visible", false);
    navMenuToggle.setAttribute("aria-expanded", false);
  }
});
