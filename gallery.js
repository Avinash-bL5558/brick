/* ==========================================================
   gallery.js — category filter + lightbox (gallery page & home preview)
   ========================================================== */
(function () {
  "use strict";
  const grid = document.querySelector("[data-gallery]");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".gallery-item"));
  const filterBtns = document.querySelectorAll(".filter-btn");

  /* Filter */
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      const f = btn.dataset.filter;
      items.forEach((it) => {
        const show = f === "all" || it.dataset.category === f;
        it.classList.toggle("hide", !show);
        if (show) { it.classList.remove("fade-in"); void it.offsetWidth; it.classList.add("fade-in"); }
      });
    })
  );

  /* Lightbox */
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  let visible = [], idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + visible.length) % visible.length;
    const it = visible[idx];
    const img = it.querySelector("img");
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = it.dataset.caption + " (" + (idx + 1) + " / " + visible.length + ")";
  }
  function open(item) {
    lastFocus = document.activeElement;
    visible = items.filter((it) => !it.classList.contains("hide"));
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    show(visible.indexOf(item));
    lb.querySelector(".lb-close").focus();
  }
  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  items.forEach((it) => it.addEventListener("click", () => open(it)));
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  /* Touch swipe */
  let sx = 0;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
  });
})();
