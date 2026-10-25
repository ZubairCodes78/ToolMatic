"""
ToolMatic Master Site Generator (REVISED: 2 TOOLS ONLY)
Assembles the complete bilingual (EN + ID) static website.
Generates:
- Homepage (EN & ID) with Hero Image Compressor + Converter Promo
- Flagship Image Compressor Dedicated Page (EN & ID)
- Image Converter Dedicated Page (EN & ID)
- 5 Legal Pages (EN & ID)
- Blog Index & 15 In-Depth Articles (EN & ID)
- sitemap.xml & robots.txt & vercel.json & _redirects
"""

import os
import json
import re
from pathlib import Path

from content_tools import TOOLS_DATA, get_compressor_hero_ui, get_converter_ui
from content_blog import BLOG_POSTS
from content_legal import LEGAL_PAGES

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://toolmatic.site"
GA_ID = "G-3K5EHMCYEV"
ADSENSE_ID = "ca-pub-8943765451617871"
EMAIL = "support@toolmatic.site"

def get_nav_html(lang="id", en_url="/en/", id_url="/"):
    is_id = lang == "id"
    active_en = "active" if not is_id else ""
    active_id = "active" if is_id else ""

    home_link = "/" if is_id else "/en/"
    compressor_link = "/id/kompres-gambar/" if is_id else "/image-compressor/"
    converter_link = "/id/konversi-gambar/" if is_id else "/image-converter/"
    blog_link = "/id/blog/" if is_id else "/blog/"

    return f"""
    <header class="navbar">
      <div class="navbar-inner">
        <a href="{home_link}" class="navbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          <span>Toolmatic</span>
        </a>

        <nav class="navbar-nav">
          <a href="{compressor_link}" class="navbar-link">{'Kompres Gambar' if is_id else 'Image Compressor'}</a>
          <a href="{converter_link}" class="navbar-link">{'Konversi Gambar' if is_id else 'Image Converter'}</a>
          <a href="{blog_link}" class="navbar-link">Blog</a>

          <!-- Visible Language Switcher Pill -->
          <div class="lang-switcher" aria-label="Language Selector">
            <a href="{en_url}" class="lang-btn {active_en}" hreflang="en" title="English">EN</a>
            <span class="lang-sep">|</span>
            <a href="{id_url}" class="lang-btn {active_id}" hreflang="id" title="Bahasa Indonesia">ID</a>
          </div>

          <a href="{compressor_link}" class="navbar-cta">{'Kompres Sekarang' if is_id else 'Compress Images'}</a>
        </nav>

        <!-- Mobile Controls (Visible on <= 900px) -->
        <div class="navbar-mobile-controls">
          <div class="lang-switcher lang-switcher-mobile" aria-label="Language Selector">
            <a href="{en_url}" class="lang-btn {active_en}" hreflang="en" title="English">EN</a>
            <span class="lang-sep">|</span>
            <a href="{id_url}" class="lang-btn {active_id}" hreflang="id" title="Bahasa Indonesia">ID</a>
          </div>

          <button class="navbar-toggle" aria-label="Toggle navigation menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div class="navbar-menu">
        <a href="{compressor_link}" class="navbar-menu-link">{'Kompres Gambar' if is_id else 'Image Compressor'}</a>
        <a href="{converter_link}" class="navbar-menu-link">{'Konversi Gambar' if is_id else 'Image Converter'}</a>
        <a href="{blog_link}" class="navbar-menu-link">{'Blog & Panduan' if is_id else 'Blog & Guides'}</a>
        
        <div style="padding: 10px 12px; display:flex; align-items:center; justify-content:space-between; border-top: 1px solid #E2E8F0; margin-top: 6px;">
          <span style="font-size:0.875rem; font-weight:600; color:#475569;">{'Pilih Bahasa:' if is_id else 'Select Language:'}</span>
          <div class="lang-switcher">
            <a href="{en_url}" class="lang-btn {active_en}" hreflang="en">EN</a>
            <span class="lang-sep">|</span>
            <a href="{id_url}" class="lang-btn {active_id}" hreflang="id">ID</a>
          </div>
        </div>
      </div>
    </header>
    """

def get_footer_html(lang="id", en_url="/en/", id_url="/"):
    is_id = lang == "id"
    home_link = "/" if is_id else "/en/"
    compressor_link = "/id/kompres-gambar/" if is_id else "/image-compressor/"
    converter_link = "/id/konversi-gambar/" if is_id else "/image-converter/"

    about_link = "/id/tentang-kami/" if is_id else "/about/"
    contact_link = "/id/kontak/" if is_id else "/contact/"
    privacy_link = "/id/kebijakan-privasi/" if is_id else "/privacy-policy/"
    terms_link = "/id/syarat-layanan/" if is_id else "/terms-of-service/"
    disc_link = "/id/disclaimer/" if is_id else "/disclaimer/"
    blog_link = "/id/blog/" if is_id else "/blog/"

    return f"""
    <!-- Compliant Ad Container -->
    <div class="container">
      <div class="ad-container">
        <div class="ad-label">{'IKLAN' if is_id else 'ADVERTISEMENT'}</div>
        <div class="ad-slot-box">
          <span><!-- Google AdSense Responsive Unit: ca-pub-8943765451617871 --></span>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Mission -->
          <div class="footer-brand-col">
            <a href="{home_link}" class="footer-brand-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>Toolmatic</span>
            </a>
            <p>{'Platform kompresi dan konversi gambar gratis, cepat, dan 100% client-side. Foto Anda diproses langsung di browser tanpa pernah diunggah ke server.' if is_id else 'Fast, modern, and 100% client-side free image utilities. Your photos never leave your device.'}</p>
            <div class="footer-privacy-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>{'100% Privasi di Browser' if is_id else '100% Client-Side Privacy'}</span>
            </div>
          </div>

          <!-- Col 2: Image Tools (ONLY 2 TOOLS) -->
          <div>
            <div class="footer-heading">{'Alat Gambar' if is_id else 'Image Tools'}</div>
            <ul class="footer-links">
              <li><a href="{compressor_link}">{'Kompres Gambar' if is_id else 'Image Compressor'}</a></li>
              <li><a href="{converter_link}">{'Konversi Gambar' if is_id else 'Image Converter'}</a></li>
            </ul>
          </div>

          <!-- Col 3: Legal & Company -->
          <div>
            <div class="footer-heading">{'Informasi & Legal' if is_id else 'Company & Legal'}</div>
            <ul class="footer-links">
              <li><a href="{about_link}">{'Tentang Kami' if is_id else 'About Us'}</a></li>
              <li><a href="{contact_link}">{'Kontak' if is_id else 'Contact'}</a></li>
              <li><a href="{privacy_link}">{'Kebijakan Privasi' if is_id else 'Privacy Policy'}</a></li>
              <li><a href="{terms_link}">{'Syarat Layanan' if is_id else 'Terms of Service'}</a></li>
              <li><a href="{disc_link}">Disclaimer</a></li>
            </ul>
          </div>

          <!-- Col 4: Resources & Language -->
          <div>
            <div class="footer-heading">{'Panduan & Bahasa' if is_id else 'Guides & Language'}</div>
            <ul class="footer-links">
              <li><a href="{blog_link}">{'Blog & Panduan Gambar' if is_id else 'Blog & Image Guides'}</a></li>
              <li style="margin-top:12px;"><a href="{en_url}" hreflang="en">English (EN)</a></li>
              <li><a href="{id_url}" hreflang="id">Bahasa Indonesia (ID)</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            &copy; 2026 Toolmatic.site — {'Hak cipta dilindungi. Bebas digunakan untuk kebutuhan pribadi dan komersial.' if is_id else 'All rights reserved. Free for personal and commercial projects.'}
          </div>
          <div class="footer-legal-bar">
            <span>Google AdSense & DoubleClick Cookie Compliant</span>
          </div>
        </div>
      </div>
    </footer>
    """

def render_html_page(
    title, desc, canonical_url, en_url, id_url,
    lang="id", h1=None, subtitle=None, body_html="",
    json_ld=None, is_compressor=False, is_converter=False
):
    is_id = lang == "id"
    html_lang = "id" if is_id else "en"

    css_links = """
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="stylesheet" href="/css/footer.css">
    <link rel="stylesheet" href="/css/compressor.css">
    <link rel="stylesheet" href="/css/blog.css">
    """

    scripts_html = '<script src="/js/main.js" defer></script>\n'
    if is_compressor or is_converter:
        scripts_html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>\n'
    if is_compressor:
        scripts_html += '<script src="/js/compressor.js" defer></script>\n'
    if is_converter:
        scripts_html += '<script src="/js/converter.js" defer></script>\n'

    schema_markup = ""
    if json_ld:
        schema_markup = f'<script type="application/ld+json">\n{json.dumps(json_ld, indent=2, ensure_ascii=False)}\n</script>'

    header_html = get_nav_html(lang, en_url, id_url)
    footer_html = get_footer_html(lang, en_url, id_url)

    h1_section = ""
    if h1:
        h1_section = f"""
        <section class="page-header-container">
          <div class="container text-center">
            <div class="page-header-inner">
              <h1 class="page-header-title">{h1}</h1>
              {f'<p class="page-header-subtitle">{subtitle}</p>' if subtitle else ''}
            </div>
          </div>
        </section>
        """

    return f"""<!DOCTYPE html>
<html lang="{html_lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{canonical_url}">
  <link rel="alternate" hreflang="id" href="{DOMAIN}{id_url}">
  <link rel="alternate" hreflang="en" href="{DOMAIN}{en_url}">
  <link rel="alternate" hreflang="x-default" href="{DOMAIN}{id_url}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical_url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{DOMAIN}/preview.webp">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{canonical_url}">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="{DOMAIN}/preview.webp">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_ID}" crossorigin="anonymous"></script>

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  {css_links}
  {schema_markup}
</head>
<body>
  {header_html}

  <main>
    {h1_section}
    {body_html}
  </main>

  {footer_html}
  {scripts_html}
</body>
</html>
"""

def generate_homepage(lang="id"):
    is_id = lang == "id"
    en_url = "/en/"
    id_url = "/"
    canonical_url = f"{DOMAIN}{id_url if is_id else en_url}"

    title = "ToolMatic - Kompres Gambar Online Gratis & Konversi Format (100% Aman)" if is_id else "ToolMatic - Free Online Image Compressor & Converter (100% Client-Side)"
    desc = "Kompres gambar online gratis tanpa kurangi kualitas. 100% aman di browser tanpa upload server, batch foto hingga 50 file, preset WhatsApp, dan unduh ZIP." if is_id else "100% free client-side image compressor and converter. Compress and convert JPG, PNG, WebP, and AVIF photos with target KB size mode and zero server uploads."

    h1 = "Kompres Gambar Online Gratis (100% Privat di Browser)" if is_id else "Free Online Image Compressor (100% Client-Side Privacy)"
    subtitle = "Kecilkan ukuran foto JPG, PNG, WebP, dan AVIF hingga 90% tanpa pecah. Gambar Anda tidak pernah meninggalkan perangkat." if is_id else "Compress JPG, PNG, WebP, and AVIF images up to 90% without losing quality. Your files never leave your device."

    compressor_ui = get_compressor_hero_ui(lang)

    # Converter Promo Banner
    converter_link = "/id/konversi-gambar/" if is_id else "/image-converter/"
    promo_html = f"""
    <div class="tool-promo-box" style="margin-top: 40px;">
      <div class="tool-promo-content">
        <h3>{'Butuh Mengubah Format Gambar?' if is_id else 'Need to Convert Image Formats?'}</h3>
        <p>{'Ubah format foto antara JPG, PNG, WebP, dan AVIF secara massal dengan alat Konversi Gambar kami.' if is_id else 'Easily convert between JPG, PNG, WebP, and AVIF formats in batch mode with our dedicated Image Converter.'}</p>
      </div>
      <a href="{converter_link}" class="btn btn-primary">{'Buka Konversi Gambar' if is_id else 'Open Image Converter'}</a>
    </div>
    """

    # FAQ Section
    faqs_data = TOOLS_DATA["image-compressor"][lang]["faqs"]
    faq_html = ""
    for f in faqs_data:
        faq_html += f"""
        <div class="faq-card">
          <div class="faq-header">
            <h3 class="faq-question">{f['q']}</h3>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-body">
            <p class="faq-direct-answer">{f['a']}</p>
          </div>
        </div>
        """

    guide_html = TOOLS_DATA["image-compressor"][lang]["guide_html"]

    body_html = f"""
    <!-- Hero Section with Flagship Image Compressor -->
    <section class="compressor-hero">
      <div class="container">
        <div class="hero-badge-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>{'100% Gratis & Tanpa Batasan' if is_id else '100% Free Forever • No Sign-up'}</span>
        </div>

        <h1 class="hero-title">{h1}</h1>
        <p class="hero-subtitle">{subtitle}</p>

        <div class="trust-signals-bar">
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{'Tanpa Perlu Login' if is_id else 'No Registration Required'}</span>
          </div>
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{'Tanpa Watermark' if is_id else 'No Watermarks'}</span>
          </div>
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{'100% Privat di Browser' if is_id else 'Zero Server Uploads'}</span>
          </div>
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{'Batch Hingga 50 Foto' if is_id else 'Batch Mode Up to 50 Files'}</span>
          </div>
        </div>

        {compressor_ui}
      </div>
    </section>

    <!-- In-Depth How-To Guide -->
    <section class="section">
      <div class="container container-narrow">
        {promo_html}
        {guide_html}

        <!-- FAQ Section (AEO) -->
        <div class="faq-section">
          <h2 class="faq-title">{'Pertanyaan yang Sering Diajukan (FAQ)' if is_id else 'Frequently Asked Questions (FAQ)'}</h2>
          {faq_html}
        </div>
      </div>
    </section>
    """

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": f"{DOMAIN}/#website",
                "url": DOMAIN,
                "name": "ToolMatic",
                "description": desc,
                "inLanguage": "id" if is_id else "en"
            },
            {
                "@type": "SoftwareApplication",
                "name": "ToolMatic Image Compressor",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": f["q"],
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": f["a"]
                        }
                    } for f in faqs_data
                ]
            }
        ]
    }

    return render_html_page(
        title=title, desc=desc, canonical_url=canonical_url,
        en_url=en_url, id_url=id_url, lang=lang,
        body_html=body_html, json_ld=schema, is_compressor=True
    )

def generate_tool_page(tool_key, lang="en"):
    tool_info = TOOLS_DATA[tool_key]
    is_id = lang == "id"
    en_url = tool_info["url_en"]
    id_url = tool_info["url_id"]
    canonical_url = f"{DOMAIN}{id_url if is_id else en_url}"

    data = tool_info[lang]
    title = data["title"]
    desc = data["desc"]
    h1 = data["h1"]
    subtitle = data["subtitle"]

    is_compressor = tool_key == "image-compressor"
    is_converter = tool_key == "image-converter"

    ui_html = get_compressor_hero_ui(lang) if is_compressor else get_converter_ui(lang)
    guide_html = data.get("guide_html", "")

    faqs = data.get("faqs", [])
    faq_html = ""
    for f in faqs:
        faq_html += f"""
        <div class="faq-card">
          <div class="faq-header">
            <h3 class="faq-question">{f['q']}</h3>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-body">
            <p class="faq-direct-answer">{f['a']}</p>
          </div>
        </div>
        """

    body_html = f"""
    <section class="section" style="padding-top:0;">
      <div class="container">
        {ui_html}
      </div>
    </section>

    <section class="section section-bg">
      <div class="container container-narrow">
        {guide_html}

        <!-- FAQ Section -->
        <div class="faq-section">
          <h2 class="faq-title">{'Pertanyaan yang Sering Diajukan (FAQ)' if is_id else 'Frequently Asked Questions (FAQ)'}</h2>
          {faq_html}
        </div>
      </div>
    </section>
    """

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": h1,
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Beranda" if is_id else "Home",
                        "item": f"{DOMAIN}{'/id/' if is_id else '/'}"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": h1,
                        "item": canonical_url
                    }
                ]
            }
        ]
    }

    if faqs:
        schema["@graph"].append({
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": f["q"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f["a"]
                    }
                } for f in faqs
            ]
        })

    return render_html_page(
        title=title, desc=desc, canonical_url=canonical_url,
        en_url=en_url, id_url=id_url, lang=lang,
        h1=h1, subtitle=subtitle, body_html=body_html,
        json_ld=schema, is_compressor=is_compressor, is_converter=is_converter
    )

def generate_blog_index(lang="en"):
    is_id = lang == "id"
    en_url = "/blog/"
    id_url = "/id/blog/"
    canonical_url = f"{DOMAIN}{id_url if is_id else en_url}"

    title = "Blog & Panduan Gambar Web ToolMatic (Tips SEO & Kompresi)" if is_id else "ToolMatic Blog - Web Optimization, Image Compression & SEO Guides"
    desc = "Kumpulan panduan lengkap dan artikel seputar kompresi gambar, SEO gambar, ukuran foto media sosial, dan optimasi kecepatan website." if is_id else "Explore in-depth articles on image compression, next-gen WebP formats, Core Web Vitals optimization, and image SEO strategies."

    h1 = "Blog & Panduan Gambar Web" if is_id else "ToolMatic Blog & Image Guides"
    subtitle = "Pelajari teknik kompresi gambar, format WebP, dan optimasi kecepatan website agar lolos Core Web Vitals." if is_id else "Master modern image compression, next-generation web formats, and speed optimization techniques."

    cards_html = ""
    for post in BLOG_POSTS:
        p_lang = post[lang]
        post_link = f"/id/blog/{post['slug_id']}/" if is_id else f"/blog/{post['slug_en']}/"
        tag = post["tag_id"] if is_id else post["tag_en"]
        read_time = post["read_time_id"] if is_id else post["read_time_en"]

        cards_html += f"""
        <a href="{post_link}" class="blog-card">
          <span class="blog-card-tag">{tag}</span>
          <h2 class="blog-card-title">{p_lang['title']}</h2>
          <p class="blog-card-excerpt">{p_lang['desc']}</p>
          <div class="blog-card-footer">
            <span>{post['date']}</span>
            <span>{read_time}</span>
          </div>
        </a>
        """

    body_html = f"""
    <section class="section" style="padding-top:0;">
      <div class="container">
        <div class="blog-index-grid">
          {cards_html}
        </div>
      </div>
    </section>
    """

    schema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": h1,
        "description": desc,
        "url": canonical_url
    }

    return render_html_page(
        title=title, desc=desc, canonical_url=canonical_url,
        en_url=en_url, id_url=id_url, lang=lang,
        h1=h1, subtitle=subtitle, body_html=body_html, json_ld=schema
    )

def generate_blog_post(post, lang="en"):
    is_id = lang == "id"
    en_url = f"/blog/{post['slug_en']}/"
    id_url = f"/id/blog/{post['slug_id']}/"
    canonical_url = f"{DOMAIN}{id_url if is_id else en_url}"

    p_data = post[lang]
    title = p_data["title"]
    desc = p_data["desc"]
    h1 = p_data["h1"]
    intro = p_data["intro"]
    content = p_data["content"]
    faqs = p_data.get("faqs", [])

    faq_html = ""
    for f in faqs:
        faq_html += f"""
        <div class="faq-card">
          <div class="faq-header">
            <h3 class="faq-question">{f['q']}</h3>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-body">
            <p class="faq-direct-answer">{f['a']}</p>
          </div>
        </div>
        """

    body_html = f"""
    <div class="blog-header">
      <div class="container container-narrow">
        <div class="blog-meta-bar">
          <span class="badge badge-primary">{post['tag_id'] if is_id else post['tag_en']}</span>
          <span class="blog-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{post['date']}</span>
          </span>
          <span class="blog-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{post['read_time_id'] if is_id else post['read_time_en']}</span>
          </span>
        </div>

        <h1 class="blog-post-title">{h1}</h1>
        <p class="blog-post-intro">{intro}</p>
      </div>
    </div>

    <div class="blog-content">
      <div class="container container-narrow">
        <article class="blog-article">
          {content}

          <!-- FAQ Section -->
          {f'<div class="faq-section"><h2 class="faq-title">{"Pertanyaan yang Sering Diajukan" if is_id else "Frequently Asked Questions"}</h2>{faq_html}</div>' if faqs else ''}

          <!-- Author Bio Box -->
          <div class="author-card">
            <div class="author-avatar">TM</div>
            <div>
              <div class="author-name">{post['author']}</div>
              <p class="author-bio">{'Ditulis oleh tim rekayasa perangkat lunak ToolMatic yang berfokus pada kecepatan browser, format gambar, dan privasi web.' if is_id else 'Authored by the ToolMatic web engineering team specializing in client-side performance, image encoding algorithms, and web privacy.'}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
    """

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": h1,
                "description": desc,
                "datePublished": f"{post['date']}T08:00:00+00:00",
                "dateModified": f"{post['date']}T08:00:00+00:00",
                "author": {
                    "@type": "Organization",
                    "name": "ToolMatic"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "ToolMatic",
                    "url": DOMAIN
                },
                "mainEntityOfPage": canonical_url
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Beranda" if is_id else "Home",
                        "item": f"{DOMAIN}{'/id/' if is_id else '/'}"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": f"{DOMAIN}{'/id/blog/' if is_id else '/blog/'}"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": h1,
                        "item": canonical_url
                    }
                ]
            }
        ]
    }

    if faqs:
        schema["@graph"].append({
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": f["q"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f["a"]
                    }
                } for f in faqs
            ]
        })

    return render_html_page(
        title=title, desc=desc, canonical_url=canonical_url,
        en_url=en_url, id_url=id_url, lang=lang,
        body_html=body_html, json_ld=schema
    )

def generate_legal_page(legal_key, lang="en"):
    is_id = lang == "id"
    en_slug_map = {
        "about": "about",
        "contact": "contact",
        "privacy-policy": "privacy-policy",
        "terms-of-service": "terms-of-service",
        "disclaimer": "disclaimer"
    }
    id_slug_map = {
        "about": "tentang-kami",
        "contact": "kontak",
        "privacy-policy": "kebijakan-privasi",
        "terms-of-service": "syarat-layanan",
        "disclaimer": "disclaimer"
    }

    en_url = f"/{en_slug_map[legal_key]}/"
    id_url = f"/id/{id_slug_map[legal_key]}/"
    canonical_url = f"{DOMAIN}{id_url if is_id else en_url}"

    info = LEGAL_PAGES[legal_key][lang]
    title = info["title"]
    desc = info["desc"]
    h1 = info["h1"]
    subtitle = info["subtitle"]
    content = info["content"]

    body_html = f"""
    <section class="section" style="padding-top:0;">
      <div class="container container-narrow">
        <article class="blog-article">
          {content}
        </article>
      </div>
    </section>
    """

    schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": h1,
        "description": desc,
        "url": canonical_url
    }

    return render_html_page(
        title=title, desc=desc, canonical_url=canonical_url,
        en_url=en_url, id_url=id_url, lang=lang,
        h1=h1, subtitle=subtitle, body_html=body_html, json_ld=schema
    )

def main():
    print("Beginning ToolMatic site generation (2 Tools Only)...")
    all_pages = []

    # 1. Homepage (Default: Indonesian at root /, English at /en/)
    id_home = generate_homepage(lang="id")
    en_home = generate_homepage(lang="en")

    # Root index.html is INDONESIAN (Default Language)
    (ROOT / "index.html").write_text(id_home, encoding="utf-8")

    # /en/index.html is ENGLISH
    (ROOT / "en").mkdir(parents=True, exist_ok=True)
    (ROOT / "en" / "index.html").write_text(en_home, encoding="utf-8")

    # /id/index.html backward compatibility (identical copy of root)
    (ROOT / "id").mkdir(parents=True, exist_ok=True)
    (ROOT / "id" / "index.html").write_text(id_home, encoding="utf-8")

    all_pages.append(("index.html", "/en/", "/"))
    all_pages.append(("en/index.html", "/en/", "/"))
    all_pages.append(("id/index.html", "/en/", "/"))
    print("Generated Homepages (Default Indonesian at root /, English at /en/)")

    # 2. Both Tools: Image Compressor and Image Converter (EN & ID)
    for tool_key, tool_info in TOOLS_DATA.items():
        en_html = generate_tool_page(tool_key, lang="en")
        en_path = ROOT / tool_info["url_en"].strip("/") / "index.html"
        en_path.parent.mkdir(parents=True, exist_ok=True)
        en_path.write_text(en_html, encoding="utf-8")

        id_html = generate_tool_page(tool_key, lang="id")
        id_path = ROOT / tool_info["url_id"].strip("/") / "index.html"
        id_path.parent.mkdir(parents=True, exist_ok=True)
        id_path.write_text(id_html, encoding="utf-8")

        all_pages.append((str(en_path.relative_to(ROOT)), tool_info["url_en"], tool_info["url_id"]))
        all_pages.append((str(id_path.relative_to(ROOT)), tool_info["url_en"], tool_info["url_id"]))
        print(f"Generated Tool: {tool_key}")

    # 3. Blog Index (EN & ID)
    en_blog_idx = generate_blog_index(lang="en")
    id_blog_idx = generate_blog_index(lang="id")
    (ROOT / "blog").mkdir(parents=True, exist_ok=True)
    (ROOT / "blog" / "index.html").write_text(en_blog_idx, encoding="utf-8")
    (ROOT / "id" / "blog").mkdir(parents=True, exist_ok=True)
    (ROOT / "id" / "blog" / "index.html").write_text(id_blog_idx, encoding="utf-8")
    all_pages.append(("blog/index.html", "/blog/", "/id/blog/"))
    all_pages.append(("id/blog/index.html", "/blog/", "/id/blog/"))
    print("Generated Blog Index (EN & ID)")

    # 4. 15 Blog Articles (EN & ID)
    for post in BLOG_POSTS:
        en_post_html = generate_blog_post(post, lang="en")
        id_post_html = generate_blog_post(post, lang="id")

        en_p_path = ROOT / "blog" / post["slug_en"] / "index.html"
        en_p_path.parent.mkdir(parents=True, exist_ok=True)
        en_p_path.write_text(en_post_html, encoding="utf-8")

        id_p_path = ROOT / "id" / "blog" / post["slug_id"] / "index.html"
        id_p_path.parent.mkdir(parents=True, exist_ok=True)
        id_p_path.write_text(id_post_html, encoding="utf-8")

        all_pages.append((str(en_p_path.relative_to(ROOT)), f"/blog/{post['slug_en']}/", f"/id/blog/{post['slug_id']}/"))
        all_pages.append((str(id_p_path.relative_to(ROOT)), f"/blog/{post['slug_en']}/", f"/id/blog/{post['slug_id']}/"))
        print(f"Generated Article #{post['id']}: {post['slug_en']}")

    # 5. Legal Pages (EN & ID)
    legal_keys = ["about", "contact", "privacy-policy", "terms-of-service", "disclaimer"]
    for lk in legal_keys:
        en_legal = generate_legal_page(lk, lang="en")
        id_legal = generate_legal_page(lk, lang="id")

        en_slug = {"about": "about", "contact": "contact", "privacy-policy": "privacy-policy", "terms-of-service": "terms-of-service", "disclaimer": "disclaimer"}[lk]
        id_slug = {"about": "tentang-kami", "contact": "kontak", "privacy-policy": "kebijakan-privasi", "terms-of-service": "syarat-layanan", "disclaimer": "disclaimer"}[lk]

        en_l_path = ROOT / en_slug / "index.html"
        en_l_path.parent.mkdir(parents=True, exist_ok=True)
        en_l_path.write_text(en_legal, encoding="utf-8")

        id_l_path = ROOT / "id" / id_slug / "index.html"
        id_l_path.parent.mkdir(parents=True, exist_ok=True)
        id_l_path.write_text(id_legal, encoding="utf-8")

        all_pages.append((str(en_l_path.relative_to(ROOT)), f"/{en_slug}/", f"/id/{id_slug}/"))
        all_pages.append((str(id_l_path.relative_to(ROOT)), f"/{en_slug}/", f"/id/{id_slug}/"))
        print(f"Generated Legal Page: {lk}")

    # 6. Generate sitemap.xml
    sitemap_entries = []
    seen_urls = set()
    for rel_path, en_u, id_u in all_pages:
        is_id = rel_path.startswith("id\\") or rel_path.startswith("id/") or rel_path == "index.html"
        curr_url = f"{DOMAIN}{id_u if is_id else en_u}"
        if curr_url in seen_urls:
            continue
        seen_urls.add(curr_url)

        entry = f"""  <url>
    <loc>{curr_url}</loc>
    <lastmod>2026-10-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="{DOMAIN}{en_u}"/>
    <xhtml:link rel="alternate" hreflang="id" href="{DOMAIN}{id_u}"/>
  </url>"""
        sitemap_entries.append(entry)

    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
{chr(10).join(sitemap_entries)}
</urlset>
"""
    (ROOT / "sitemap.xml").write_text(sitemap_xml, encoding="utf-8")
    print(f"Generated sitemap.xml with {len(sitemap_entries)} URLs")

    # 7. Generate robots.txt
    robots_txt = f"""User-agent: *
Allow: /

Sitemap: {DOMAIN}/sitemap.xml
"""
    (ROOT / "robots.txt").write_text(robots_txt, encoding="utf-8")
    print("Generated robots.txt")

    # 8. Generate vercel.json & _redirects
    vercel_config = {
        "cleanUrls": True,
        "trailingSlash": True,
        "headers": [
            {
                "source": "/(.*.css)",
                "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]
            },
            {
                "source": "/(.*.js)",
                "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]
            },
            {
                "source": "/(.*.webp|.*.png|.*.jpg|.*.jpeg|.*.svg)",
                "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]
            }
        ],
        "redirects": [
            {"source": "/tools/:path*", "destination": "/image-compressor/", "permanent": True},
            {"source": "/id/penghitung-kata", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/generator-meta-tag", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/cek-kepadatan-kata-kunci", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/kalkulator-bmi", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/kalkulator-persentase", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/kalkulator-umur", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/cek-kemiripan-teks", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/gambar-ke-teks", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/pdf-ke-word", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/id/pembuat-cv", "destination": "/id/kompres-gambar/", "permanent": True},
            {"source": "/pages/:path*", "destination": "/", "permanent": True}
        ]
    }
    (ROOT / "vercel.json").write_text(json.dumps(vercel_config, indent=2), encoding="utf-8")

    redirects_content = """# Legacy 301 Redirects
/tools/* /image-compressor/ 301
/id/penghitung-kata/* /id/kompres-gambar/ 301
/id/generator-meta-tag/* /id/kompres-gambar/ 301
/id/cek-kepadatan-kata-kunci/* /id/kompres-gambar/ 301
/id/kalkulator-bmi/* /id/kompres-gambar/ 301
/id/kalkulator-persentase/* /id/kompres-gambar/ 301
/id/kalkulator-umur/* /id/kompres-gambar/ 301
/id/cek-kemiripan-teks/* /id/kompres-gambar/ 301
/id/gambar-ke-teks/* /id/kompres-gambar/ 301
/id/pdf-ke-word/* /id/kompres-gambar/ 301
/id/pembuat-cv/* /id/kompres-gambar/ 301
/pages/* / 301
"""
    (ROOT / "_redirects").write_text(redirects_content, encoding="utf-8")
    print("Generated vercel.json and _redirects")

if __name__ == "__main__":
    main()
