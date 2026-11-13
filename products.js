/* ==========================================================
   products.js — category filter, search, details modal
   Product data lives in the HTML cards (data-* attributes),
   so you can edit products without touching this file.
   ========================================================== */
(function () {
  "use strict";
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".product-card"));
  const filterBtns = document.querySelectorAll(".filter-btn");
  const search = document.getElementById("product-search");
  const empty = document.getElementById("no-results");
  let category = "all";

  function apply() {
    const q = (search ? search.value : "").trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const catOk = category === "all" || card.dataset.category === category;
      const hay = (card.dataset.name + " " + card.dataset.desc + " " + card.dataset.category).toLowerCase();
      const ok = catOk && (!q || hay.includes(q));
      card.classList.toggle("hide", !ok);
      if (ok) shown++;
    });
    empty.classList.toggle("show", shown === 0);
  }

  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      category = btn.dataset.filter;
      apply();
    })
  );
  if (search) search.addEventListener("input", apply);

  /* Details modal */
  const modal = document.getElementById("product-modal");
  const mImg = modal.querySelector("img");
  const mTitle = modal.querySelector("[data-m-title]");
  const mDesc = modal.querySelector("[data-m-desc]");
  const mSpecs = modal.querySelector("[data-m-specs]");
  const mWa = modal.querySelector("[data-m-wa]");
  let lastFocus = null;

  function openModal(card) {
    lastFocus = document.activeElement;
    mImg.src = card.querySelector("img").src;
    mImg.alt = card.dataset.name;
    mTitle.textContent = card.dataset.name;
    mDesc.textContent = card.dataset.desc;
    mSpecs.innerHTML = card.querySelector(".spec-list").innerHTML;
    mWa.onclick = () => openWhatsApp(WA_MESSAGES.product(card.dataset.name));
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
    history.replaceState(null, "", "#" + card.id);
  }
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-details]");
    if (btn) openModal(btn.closest(".product-card"));
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  /* Deep link from homepage: products.html#p-xxxx opens that product */
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains("product-card")) {
      setTimeout(() => { target.scrollIntoView({ block: "center" }); openModal(target); }, 300);
    }
  }
})();
