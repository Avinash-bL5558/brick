# Red Bricks Website

A static, framework-free (HTML5, CSS3, vanilla JS) showcase website with WhatsApp as the primary enquiry channel. No backend, cart, payments or logins.

## Run it
Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Things to edit first
1. **WhatsApp number & contact details**: `js/whatsapp.js` → `SITE_CONFIG` (`WHATSAPP_NUMBER`, `COMPANY_NAME`, `OWNER_NAME`, `PHONE_DISPLAY`, `EMAIL_DISPLAY`, `ADDRESS`). Use country code + digits only, e.g. `919876543210`. Every WhatsApp button, the floating button and the contact form use this one value.
2. **Brand name**: search for `Your Brand Name` across the HTML files and replace it.
3. **Images**: all images in `images/` are labelled SVG placeholders. Replace them with real photos (keep file names, or update the `src` paths). Recommended: JPG/WebP, about 1600px wide, compressed.
4. **Products**: edit the cards in `products.html` (name, description, specs, `data-*` attributes) and the cards on `index.html`. Specs are placeholders; add real values only once verified.
5. **Text content**: all descriptive copy is placeholder. No certifications, years of experience, capacities or prices are claimed.
6. **Google Map**: paste your embed `<iframe>` into the `.map-placeholder` block in `contact.html`.
7. **SEO**: update the `canonical` / `og:url` domain (`https://www.yourdomain.com`) in each page's `<head>` and replace the Open Graph image with a real photo.

## Structure
```
index.html  products.html  about.html  quality.html  gallery.html  contact.html
css/   style.css (core) · responsive.css (breakpoints) · animations.css (reveals/keyframes)
js/    whatsapp.js (config + reusable openWhatsApp) · main.js (nav, reveal, form)
       products.js (filter, search, modal) · gallery.js (filter, lightbox)
images/ hero/ products/ manufacturing/ gallery/ about/
```

## WhatsApp messages
- General: "Hello, I would like to know more about your red bricks and request a quotation."
- Product: "Hello, I am interested in your [PRODUCT NAME]. Please share the latest price and details."
- Contact form: validated, then formatted into a WhatsApp message. Nothing is sent to a server.

Add `data-wa="general"` or `data-wa-product="Name"` to any element to make it a WhatsApp button.

## External resources
Google Fonts (Inter, Playfair Display) and Font Awesome (cdnjs) load from CDNs, so an internet connection is needed for fonts and icons.
