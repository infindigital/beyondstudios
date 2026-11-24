/* =========================================================
   BEYOND STUDIOS — interactions (replica of reference motion)
   ========================================================= */
(function () {
  "use strict";
  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
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

  /* ---- Scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .bwband")
    .forEach(function (el) { io.observe(el); });

  /* ---- Scroll progress bar + hero parallax + scroll-driven strip ---- */
  var progress = document.getElementById("progress");
  var heroContent = document.querySelector(".hero__content");
  var heroSlides = document.getElementById("heroSlides");
  var strip = document.getElementById("photostrip");
  var stripImgs = strip ? strip.querySelectorAll("img") : [];
  var services = strip ? strip.closest(".services") : null;
  var vh = window.innerHeight;
  window.addEventListener("resize", function () { vh = window.innerHeight; });

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (progress) {
      var h = document.documentElement.scrollHeight - vh;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (y > 0 && y < vh) {
      if (heroContent) {
        heroContent.style.transform = "translateY(" + (y * 0.28) + "px)";
        heroContent.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
      }
      if (heroSlides) heroSlides.style.transform = "translateY(" + (y * 0.18) + "px)";
    }
    // scroll-driven reveal: the whole card + first image fade in together (never a blank
    // white sheet), then the remaining images appear one after another as you keep scrolling
    if (services && stripImgs.length) {
      var p = clamp01((y + vh * 0.72 - services.offsetTop) / (services.offsetHeight * 0.55));
      var cardO = clamp01((p - 0.05) / 0.12);      // card + image 1 appear together
      strip.style.opacity = cardO;
      for (var i = 0; i < stripImgs.length; i++) {
        var o = i === 0 ? cardO : clamp01((p - (0.05 + i * 0.16)) / 0.14);
        stripImgs[i].style.opacity = o;
        stripImgs[i].style.transform = "translateY(" + (18 * (1 - o)) + "px)";
      }
      strip.classList.toggle("caps-in", p > 0.05 + stripImgs.length * 0.16);
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Testimonials carousel ---- */
  var track = document.getElementById("tTrack");
  if (track) {
    var slidesT = track.children.length, idx = 0, timer;
    var dotsWrap = document.getElementById("tDots");
    for (var i = 0; i < slidesT; i++) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Testimonial " + (i + 1));
      (function (n) { b.addEventListener("click", function () { go(n, true); }); })(i);
      dotsWrap.appendChild(b);
    }
    var dots = dotsWrap.children;
    function go(n, manual) {
      idx = (n + slidesT) % slidesT;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      for (var k = 0; k < dots.length; k++) dots[k].classList.toggle("active", k === idx);
      if (manual) restart();
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 7000); }
    document.getElementById("tNext").addEventListener("click", function () { go(idx + 1, true); });
    document.getElementById("tPrev").addEventListener("click", function () { go(idx - 1, true); });
    go(0); restart();
  }
})();
