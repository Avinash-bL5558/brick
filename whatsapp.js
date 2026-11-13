/* ==========================================================
   whatsapp.js — single source of truth for WhatsApp enquiries
   Change WHATSAPP_NUMBER below (country code + number, digits only).
   ========================================================== */
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "919059005577",
  COMPANY_NAME: "Your Brand Name",
  OWNER_NAME: "ORUGANTI BABU RAO",
  PHONE_DISPLAY: "+91 90590 05577",
  EMAIL_DISPLAY: "info@yourdomain.com",
  ADDRESS: "Your Business Address, City, State, PIN"
};

const WA_MESSAGES = {
  general: "Hello, I would like to know more about your red bricks and request a quotation.",
  product: (name) => `Hello, I am interested in your ${name}. Please share the latest price and details.`
};

/** Reusable: builds the wa.me URL and opens it in a new tab. */
function openWhatsApp(message) {
  const text = message || WA_MESSAGES.general;
  const url = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}

/** Wire up any element using data attributes:
 *  data-wa="general"            -> general quote message
 *  data-wa-product="Product X"  -> product-specific message
 */
function initWhatsAppButtons(root) {
  (root || document).querySelectorAll("[data-wa], [data-wa-product]").forEach((el) => {
    if (el.dataset.waBound) return;
    el.dataset.waBound = "1";
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const product = el.getAttribute("data-wa-product");
      openWhatsApp(product ? WA_MESSAGES.product(product) : WA_MESSAGES.general);
    });
  });
}

/** Fill configurable contact placeholders (phone, address, etc.). */
function initSiteConfig() {
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.getAttribute("data-config");
    if (SITE_CONFIG[key]) el.textContent = SITE_CONFIG[key];
  });
  document.querySelectorAll("[data-config-tel]").forEach((el) => {
    el.setAttribute("href", "tel:" + SITE_CONFIG.PHONE_DISPLAY.replace(/[^\d+]/g, ""));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppButtons();
  initSiteConfig();
});
