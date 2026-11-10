// RIAZ IDEAS — navigation, scroll reveals and subtle 3D pointer movement
document.addEventListener("DOMContentLoaded", function () {
  const mobilePerformanceMode = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
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

  // Scroll-triggered typing with several visible pointer cursors
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function addTypingPointers(container) {
    if (reducedMotion || mobilePerformanceMode || container.dataset.pointerTyping === "done") return;
    const targets = container.querySelectorAll("h1, h2, h3");
    targets.forEach(function (target) {
      if (target.dataset.pointerTyping === "done") return;
      target.dataset.pointerTyping = "done";
      target.classList.add("pointer-typing");
      ["lime", "violet", "white"].forEach(function (tone, index) {
        const pointer = document.createElement("span");
        pointer.className = "typing-pointer typing-pointer-" + tone;
        pointer.setAttribute("aria-hidden", "true");
        pointer.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path d="M4 2.5 20.5 13l-7.1 1.2-3.6 6.3L4 2.5Z" fill="currentColor" stroke="#08090d" stroke-width="1.2" stroke-linejoin="round"/></svg>';
        pointer.style.setProperty("--pointer-delay", (index * 0.16) + "s");
        target.appendChild(pointer);
      });
    });
    container.dataset.pointerTyping = "done";
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (!mobilePerformanceMode && "IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          addTypingPointers(entry.target);
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); addTypingPointers(item); });
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

  // Distinct motion language for each page template
  const pagePath = window.location.pathname.toLowerCase();
  let pageType = "legal";
  if (pagePath === "/" || pagePath.endsWith("/index.html") && !pagePath.includes("/blog/")) pageType = "home";
  else if (pagePath.endsWith("/services.html")) pageType = "services";
  else if (pagePath.endsWith("/about.html")) pageType = "about";
  else if (pagePath.endsWith("/contact.html")) pageType = "contact";
  else if (pagePath.endsWith("/blog/index.html")) pageType = "blog-index";
  else if (pagePath.includes("/blog/")) pageType = "blog-article";
  document.body.classList.add("page-motion-" + pageType);

  const motionGroups = {
    services: document.querySelectorAll(".service-card, .process-step"),
    about: document.querySelectorAll(".process-step, .feature-panel, .work-grid > div"),
    contact: document.querySelectorAll(".work-grid > div, #inquiry .section-head, #inquiry .feature-panel"),
    "blog-index": document.querySelectorAll(".blog-card, .blog-bottom-note"),
    "blog-article": document.querySelectorAll(".prose > h2, .prose > p, .prose > ul, .prose > .callout"),
    legal: document.querySelectorAll(".prose > h2, .prose > p, .prose > ul, .prose > .callout")
  };
  const pageMotionItems = mobilePerformanceMode ? [] : (motionGroups[pageType] || []);
  pageMotionItems.forEach(function (item, index) {
    item.classList.add("page-motion-item");
    item.style.setProperty("--motion-order", index);
  });
  if (pageType === "services") document.querySelectorAll(".service-card").forEach((item, index) => item.style.setProperty("--card-order", index));
  if (pageType === "blog-index") document.querySelectorAll(".blog-card").forEach((item, index) => item.style.setProperty("--card-order", index));

  if (pageMotionItems.length) {
    if ("IntersectionObserver" in window && !reducedMotion) {
      const pageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("page-motion-in");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -35px 0px" });
      pageMotionItems.forEach(function(item) { pageObserver.observe(item); });
    } else {
      pageMotionItems.forEach(function(item) { item.classList.add("page-motion-in"); });
    }
  }
  if (pageType !== "home") {
    const pageTitle = document.querySelector(".page-hero h1");
    if (pageTitle && !reducedMotion && !mobilePerformanceMode) pageTitle.classList.add("page-title-arrive");
  }

  // Site-wide soft spotlight that follows the mouse pointer
  if (window.matchMedia("(pointer:fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    cursorGlow.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursorGlow);

    window.addEventListener("pointermove", function (event) {
      cursorGlow.style.left = event.clientX + "px";
      cursorGlow.style.top = event.clientY + "px";
    }, { passive: true });

    window.addEventListener("pointerleave", function () {
      cursorGlow.style.opacity = "0";
    });
    window.addEventListener("pointerenter", function () {
      cursorGlow.style.opacity = ".72";
    });
  }
  // Interactive 3D layer: restrained tilt, magnetic controls and scroll depth
  if (!reducedMotion && window.matchMedia("(pointer:fine)").matches) {
    const tiltTargets = document.querySelectorAll(
      ".service-card, .work-card, .blog-card, .feature-panel, .process-step, .insight-card, .cta-inner, .hero-visual"
    );
    tiltTargets.forEach(function (card) {
      card.classList.add("has-3d-interaction");
      card.addEventListener("pointermove", function (event) {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const max = card.classList.contains("hero-visual") ? 9 : 11;
        card.style.setProperty("--tilt-x", ((.5 - py) * max) + "deg");
        card.style.setProperty("--tilt-y", ((px - .5) * max) + "deg");
        card.style.setProperty("--shine-x", (px * 100) + "%");
        card.style.setProperty("--shine-y", (py * 100) + "%");
      }, { passive: true });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--shine-x", "50%");
        card.style.setProperty("--shine-y", "50%");
      });
    });

    document.querySelectorAll(".btn, .nav-cta").forEach(function (button) {
      button.addEventListener("pointermove", function (event) {
        const rect = button.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) * .07;
        const dy = (event.clientY - rect.top - rect.height / 2) * .10;
        button.style.setProperty("--magnet-x", dx + "px");
        button.style.setProperty("--magnet-y", dy + "px");
      }, { passive: true });
      button.addEventListener("pointerleave", function () {
        button.style.setProperty("--magnet-x", "0px");
        button.style.setProperty("--magnet-y", "0px");
      });
    });
  }

  // Reading progress is desktop-only; avoid a scroll listener on mobile.
  if (!mobilePerformanceMode) {
    const progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);
    let progressQueued = false;
    function updateReadingProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.transform = "scaleX(" + Math.min(100, Math.max(0, amount)) / 100 + ")";
      progressQueued = false;
    }
    window.addEventListener("scroll", function () {
      if (!progressQueued) {
        progressQueued = true;
        window.requestAnimationFrame(updateReadingProgress);
      }
    }, { passive: true });
    updateReadingProgress();
  }


  // Gentle depth parallax for ambient hero elements
  const heroSection = document.querySelector(".hero-3d");
  if (heroSection && !reducedMotion && window.matchMedia("(pointer:fine)").matches) {
    const layers = heroSection.querySelectorAll(".hero-glow, .orbit, .float-label");
    heroSection.addEventListener("pointermove", function (event) {
      const rect = heroSection.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      layers.forEach(function (layer, index) {
        const depth = (index + 1) * 3;
        layer.style.translate = (x * depth) + "px " + (y * depth) + "px";
      });
    }, { passive: true });
    heroSection.addEventListener("pointerleave", function () {
      layers.forEach(function (layer) { layer.style.translate = "0 0"; });
    });
  }

});
