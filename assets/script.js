// RIAZ IDEAS — mobile navigation
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu");
  const navigation = document.getElementById("nav");

  if (!menuButton || !navigation) return;

  menuButton.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.querySelectorAll("nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
});
