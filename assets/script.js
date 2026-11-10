// RIAZ IDEAS — navigation, scroll reveals and subtle 3D pointer movement
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu");
  const navigation = document.getElementById("nav");

  if (menuButton && navigation) {
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
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  const visual = document.querySelector(".hero-visual");
  const orb = document.querySelector(".orb");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (visual && orb && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    visual.addEventListener("pointermove", function (event) {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      orb.style.marginLeft = (x * 13) + "px";
      orb.style.marginTop = (y * 13) + "px";
    });
    visual.addEventListener("pointerleave", function () {
      orb.style.marginLeft = "0";
      orb.style.marginTop = "0";
    });
  }
});
