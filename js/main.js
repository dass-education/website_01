document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("details.mobile-menu");
  if (!menu) return;
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => menu.removeAttribute("open")));
  document.addEventListener("pointerdown", (event) => { if (menu.open && !menu.contains(event.target)) menu.removeAttribute("open"); });
});
