# ToolMatic (toolmatic.site) — Rebuilt & Fully Optimized (REVISED)

> **Fast, Modern, 100% Free Online Image Tools — Zero Server Uploads**  
> **EXACTLY TWO TOOLS:** (1) **Image Compressor**, (2) **Image Converter**  
> Bilingual (English + Bahasa Indonesia), Google AdSense-Ready, SEO/AEO/GEO Optimized.

---

## 🌟 Key Features

1. **EXACTLY TWO TOOLS ONLY (100% Client-Side):**
   - **(1) Image Compressor** (Homepage hero `/` + dedicated `/image-compressor/` and Indonesian `/id/kompres-gambar/`):
     - **Batch Mode:** Drag & drop + click-to-upload at least 20+ images at once (tested up to 50).
     - **Input Formats:** JPG, JPEG, PNG, WebP, AVIF, and HEIC (via client-side decoding with clear unsupported message if browser lacks codec).
     - **Compression Modes:** Quality slider (5% to 100%) and **Target Size Mode** (compress to under 100 KB, 200 KB, 500 KB, or custom KB).
     - **Resize Options:** By percentage, by custom width/height (with aspect ratio lock), and social presets (WhatsApp, Instagram Post, Instagram Story, Facebook, Website).
     - **One-Click WhatsApp Preset:** Automatically scales dimensions to 1600px max and compresses to under 200 KB for optimal WhatsApp HD transmission (internal compression setting, no external WhatsApp chat/action buttons).
     - **Before/After Preview:** Original size vs new size, percentage saved, dimensions, and format.
     - **Download:** Download single image + **Download All as ZIP** via client-side JSZip.
     - **Privacy Guarantee:** 100% client-side processing using the browser Canvas API. Images never leave the device.
   - **(2) Image Converter** (Dedicated tool page `/image-converter/` and Indonesian `/id/konversi-gambar/`):
     - Batch mode drag & drop (up to 50 images).
     - Convert between JPG ↔ PNG ↔ WebP ↔ AVIF with format pills.
     - Quality setting for lossy outputs (JPG, WebP, AVIF).
     - Real-time before/after comparison with format and file size changes.
     - Download single image + **Download All as ZIP**.
     - 100% client-side privacy line prominently displayed.

2. **Purged Legacy Tools & Clichés:**
   - **Zero Legacy Tools:** Completely deleted Meta Tag Generator, Word Counter, Keyword Density Checker, BMI Calculator, Percentage Calculator, Age Calculator, Resume Builder, Plagiarism Checker, OCR, and PDF to Word.
   - **Zero WhatsApp Buttons:** Completely removed floating WhatsApp chat buttons, WhatsApp share buttons, and WhatsApp contact links.
   - **No AI Feel:** No glowing neon purple/blue gradients, no "AI-powered" buzzwords, no robot illustrations. Clean, trustworthy, human-crafted utility design (TinyPNG / Squoosh style).

3. **Full Bilingual Architecture (Default: Bahasa Indonesia):**
   - **Default Language (Indonesian):** The root URL (`/` and `index.html`) defaults to Bahasa Indonesia with `<html lang="id">` and active `ID` language switcher state.
   - **Secondary Language (English):** Fully accessible at `/en/`, `/image-compressor/`, `/image-converter/`, etc.
   - **Visible Header Language Switcher (`EN | ID`):** Active state on the current language; clicking toggles instantly to the exact corresponding page in the other language.
   - **Clean Parallel URL Architecture:**
     - Indonesian (Default): `/` (Home), `/id/kompres-gambar/`, `/id/konversi-gambar/`, `/id/blog/` (15 posts), `/id/tentang-kami/`, `/id/kontak/`, `/id/kebijakan-privasi/`, `/id/syarat-layanan/`, `/id/disclaimer/`.
     - English: `/en/` (Home), `/image-compressor/`, `/image-converter/`, `/blog/` (15 posts), `/about/`, `/contact/`, `/privacy-policy/`, `/terms-of-service/`, `/disclaimer/`.
   - **Correct Hreflang Tags:** Every page includes `hreflang="id"`, `hreflang="en"`, and `hreflang="x-default"` pointing to the Indonesian default version.
   - **Standard Indonesian Glossary:** Accurately implemented across all UI, tools, and guides (*Kompres Gambar*, *Konversi Gambar*, *Unggah Gambar*, *Unduh*, *Seret & letakkan*, *Kualitas*, *Ukuran file*, *Konversi*, *Ubah Ukuran*, *Kompres untuk WhatsApp*, *Kebijakan Privasi*, *Syarat Layanan*, *Tentang Kami*, *Kontak*, *Cara Penggunaan*).

4. **AdSense Approval Readiness:**
   - **Zero Prohibited Scripts:** Completely removed all Adsterra popunders (`profitableratecpmnetwork.com`), social bars, and third-party ad network scripts.
   - **Official Google AdSense Tag:** Integrated `ca-pub-8943765451617871`.
   - **Compliant Legal Pages (EN + ID):** About Us, Contact (`support@toolmatic.site` + direct mailto link), Privacy Policy (with Google AdSense / DoubleClick DART cookie clauses, GDPR, and CCPA opt-out links), Terms of Service, and Disclaimer.
   - **15 In-Depth Blog Articles (EN + ID, 800–1,500 words each):** Covering image compression, format comparisons, WhatsApp optimization, mobile resizing, WebP advantages, and image SEO.

5. **SEO, AEO, and GEO Optimization:**
   - **Semantic HTML5:** Strict single `<h1>` per page, logical `<h2>`/`<h3>` hierarchy, schema markup (`WebSite`, `SoftwareApplication`, `FAQPage`, `Article`, `BreadcrumbList`).
   - **AEO (Answer Engine Optimization):** 5–8 FAQ questions per page with concise, direct 40–60 word answers first, followed by detail.
   - **GEO (Generative Engine Optimization):** "In short" summary boxes at the top of guides, comparison tables, numbered step cards, and key takeaway boxes.
   - **Clean Indexing:** Complete `sitemap.xml` listing all 48 EN and ID URLs, clean `robots.txt`, and 301 redirects in `vercel.json` and `_redirects`.

---

## 🚀 How to Deploy the Static Files

Because ToolMatic is built exclusively with static HTML5, modular Vanilla CSS, and client-side JavaScript, it can be deployed to **any** static host at zero cost.

### Option 1: Vercel (Recommended)
1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** *(Leave empty)*
   - **Output Directory:** `./`
4. Click **Deploy**. Vercel will automatically read `vercel.json` to handle clean URLs, trailing slashes, and immutable asset caching.
5. In your project settings, add your custom domain: `toolmatic.site`.

### Option 2: Cloudflare Pages / Netlify / GitHub Pages
- **Cloudflare Pages:** Connect Git repository, select build output directory as `./` (root).
- **Netlify:** Drag and drop the folder or connect Git repository. The included `_redirects` file will automatically handle all clean directory routing.
- **GitHub Pages:** Go to repository **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: `main` / `root`.

### Local Development / Testing
Run with Node.js:
```bash
node server.js
```
Open [http://localhost:3000/](http://localhost:3000/) in your web browser.

Or run with Python:
```bash
python -m http.server 3000
```

---

## ✅ Deliverables & Verification Checklist

- [x] **0. Revision Enforcement:**
  - [x] Exactly TWO tools remain: (1) Image Compressor, (2) Image Converter.
  - [x] Deleted completely: Meta Tag Generator, Word Counter, Keyword Density Checker, BMI Calculator, Percentage Calculator, Age Calculator, Resume Builder, Plagiarism Checker, OCR, PDF to Word.
  - [x] Completely removed WhatsApp floating buttons, share buttons, and contact links.
  - [x] Clean human-made look (TinyPNG/Squoosh style) — no glowing purple/blue gradients, no AI badges, no AI wording.

- [x] **1. The Two Tools (100% Client-Side):**
  - [x] **1A. Image Compressor:**
    - [x] Batch mode drag & drop (up to 50 images).
    - [x] Formats: JPG, PNG, WebP, AVIF, HEIC.
    - [x] Dual modes: Quality slider (5-100%) and Target Size mode (100KB, 200KB, 500KB, custom).
    - [x] Resize: % scaling, custom px with aspect ratio lock, social presets (WhatsApp, IG, FB, Web).
    - [x] WhatsApp preset setting applied smoothly.
    - [x] Before/after preview cards (original size vs compressed size, % saved, dimensions).
    - [x] Single download + "Download All as ZIP" via JSZip.
    - [x] Client-side privacy statement prominently displayed.
  - [x] **1B. Image Converter:**
    - [x] Batch mode drag & drop (up to 50 images).
    - [x] Converts between JPG ↔ PNG ↔ WebP ↔ AVIF.
    - [x] Quality slider for lossy outputs.
    - [x] Before/after preview cards with size & format changes.
    - [x] Single download + "Download All as ZIP" via JSZip.
    - [x] Client-side privacy statement prominently displayed.

- [x] **2. Bilingual Architecture (EN + ID):**
  - [x] Visible header language switcher (`EN | ID`) on all pages.
  - [x] Separate clean URLs for English and Indonesian.
  - [x] Full `hreflang` tags on all pages (`en`, `id`, `x-default`).
  - [x] Standard Indonesian glossary applied accurately.

- [x] **3. Tool Guides & FAQ:**
  - [x] Both tool pages have 800+ word guides.
  - [x] AEO FAQ sections with direct 40–60 word answers.
  - [x] Zero fake reviews, zero fake stats, zero fake testimonials.

- [x] **4. AdSense Readiness:**
  - [x] Zero banned scripts / zero popunders.
  - [x] 5 Legal pages in EN + ID (About, Contact, Privacy Policy with AdSense cookie clause, Terms, Disclaimer).
  - [x] 15 original, high-value blog articles in EN + ID (800–1,500 words each).

- [x] **5. SEO, AEO, and GEO:**
  - [x] Semantic HTML5, 1 H1 per page, proper heading hierarchy.
  - [x] Valid Schema.org JSON-LD (WebSite, SoftwareApplication, FAQPage, Article, BreadcrumbList).
  - [x] Answer-first paragraphs & FAQPage schema.
  - [x] Comparison tables, "In short" summary boxes, and numbered step cards.
  - [x] Valid `sitemap.xml` (48 bilingual URLs) and clean `robots.txt`.
  - [x] Verified zero broken internal links via `audit_site.py`.
