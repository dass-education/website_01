document.addEventListener("DOMContentLoaded", function () {
  var mobileMenu = document.querySelector(".mobile-menu");
  if (!mobileMenu) return;

  var links = mobileMenu.querySelectorAll("nav a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.removeAttribute("open");
    });
  });

  document.addEventListener("click", function (event) {
    if (mobileMenu.hasAttribute("open") && !mobileMenu.contains(event.target)) {
      mobileMenu.removeAttribute("open");
    }
  });
});
