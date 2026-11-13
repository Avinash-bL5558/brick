/* ==========================================================
   main.js — shared behaviour: navbar, menu, reveal, back-to-top
   ========================================================== */
(function () {
  "use strict";

  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const toTop = document.querySelector(".to-top");

  /* Sticky navbar: transparent over hero, solid after scrolling */
  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 60);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function setMenu(open) {
    if (!toggle || !links) return;
    toggle.classList.toggle("open", open);
    links.classList.toggle("open", open);
    navbar.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 960) setMenu(false); });
  }

  /* Active nav state (based on current file name) */
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
    if (a.getAttribute("data-page") === current) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* Back to top */
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* Footer year */
  document.querySelectorAll(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* Contact form: validate, then build a WhatsApp message (no server involved) */
  const form = document.getElementById("enquiry-form");
  if (form) {
    const rules = {
      name: (v) => v.trim().length >= 2 || "Please enter your name.",
      phone: (v) => /^[+]?[\d\s-]{10,15}$/.test(v.trim()) || "Enter a valid phone number (10–15 digits).",
      product: (v) => v !== "" || "Please choose a product.",
      quantity: (v) => v.trim().length > 0 || "Please enter the quantity required.",
      message: (v) => v.trim().length >= 5 || "Please add a short message."
    };
    function check(field) {
      const group = field.closest(".form-group");
      const rule = rules[field.name];
      const result = rule ? rule(field.value) : true;
      const ok = result === true;
      group.classList.toggle("invalid", !ok);
      if (!ok) group.querySelector(".error-msg").textContent = result;
      return ok;
    }
    form.querySelectorAll("input, select, textarea").forEach((f) => {
      f.addEventListener("blur", () => check(f));
      f.addEventListener("input", () => { if (f.closest(".form-group").classList.contains("invalid")) check(f); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true, firstBad = null;
      form.querySelectorAll("input, select, textarea").forEach((f) => {
        if (!check(f)) { valid = false; if (!firstBad) firstBad = f; }
      });
      if (!valid) { firstBad.focus(); return; }
      const d = Object.fromEntries(new FormData(form).entries());
      const msg =
        "*New Enquiry – " + SITE_CONFIG.COMPANY_NAME + " Website*\n\n" +
        "*Name:* " + d.name.trim() + "\n" +
        "*Phone:* " + d.phone.trim() + "\n" +
        "*Product:* " + d.product + "\n" +
        "*Quantity:* " + d.quantity.trim() + "\n" +
        "*Message:* " + d.message.trim() + "\n\n" +
        "Please share the latest price and details.";
      openWhatsApp(msg);
    });
  }

  /* Pre-select product on contact page via ?product=... */
  const productSelect = document.getElementById("product");
  if (productSelect) {
    const wanted = new URLSearchParams(location.search).get("product");
    if (wanted) Array.from(productSelect.options).forEach((o) => { if (o.value === wanted) o.selected = true; });
  }
})();
