/* =========================================================
   ATLAS STUDIO — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    Array.prototype.forEach.call(navLinks.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, .reveal-right").forEach(function (el) { io.observe(el); });

  /* ---- Nav background on scroll + progress bar ---- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Current year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
