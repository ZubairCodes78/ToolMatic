import re
from pathlib import Path

ROOT = Path(r"d:\ZUBAIR\ToolMatic")
HTML_FILES = list(ROOT.glob("**/*.html"))

CRITICAL_CSS = r"""
<style>
:root{--bg-white:#FFFFFF;--bg-section:#F8FAFC;--text-primary:#111827;--text-secondary:#6B7280;--border:#E5E7EB;--accent:#2563EB;--accent-hover:#1D4ED8}
html{scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;font-size:1rem;line-height:1.7;color:var(--text-primary);background:#fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;min-width:0;}
.container{width:100%;max-width:1200px;margin:0 auto;padding:0 16px;}
.section{padding:32px 0;}
.section-bg{background:var(--bg-section);}
.section-white{background:#fff;}
h1{font-size:2.25rem;line-height:1.2;margin-bottom:1rem;}
h2{font-size:1.75rem;line-height:1.3;margin-bottom:1rem;}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:6px;font-weight:500;cursor:pointer;border:none;font-family:inherit;font-size:1rem;min-height:48px;transition:background-color .2s;}
.btn-primary{background:var(--accent);color:#fff;}
.btn-secondary{background:#fff;color:var(--accent);border:1px solid var(--accent);}
.text-center{text-align:center;}
.navbar{position:sticky;top:0;left:0;right:0;background:#fff;border-bottom:1px solid var(--border);z-index:1000;}
.navbar-inner{max-width:1200px;margin:0 auto;padding:0 16px;height:64px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;}
.navbar-brand{display:flex;align-items:center;gap:8px;color:var(--text-primary);font-weight:700;font-size:1.25rem;}
.navbar-nav{display:flex;align-items:center;gap:24px;flex-wrap:wrap;}
.navbar-link,.navbar-menu-link,.navbar-menu-cta{min-height:48px;}
.navbar-menu{display:none;}
.navbar-toggle{display:none;}
@media(max-width:768px){.navbar-inner{padding:12px 16px;}.navbar-nav{display:none;}.navbar-toggle{display:flex;}.navbar-cta{display:none;}.tool-actions{flex-direction:column;}.card{padding:20px;}.tool-header h1{font-size:2rem;}.tool-intro{font-size:1rem;}.grid-3,.grid-2{grid-template-columns:1fr;}.preview-image{aspect-ratio:4/3;width:100%;height:auto;}.preview-container{min-height:320px;}.tool-output,.loading-container,.output-container,.dynamic-section{min-height:120px;}}
.preview-container{min-height:320px;}
.preview-image{aspect-ratio:4/3;width:100%;height:auto;display:block;}
.tool-output,.loading-container,.output-container,.dynamic-section{min-height:120px;}
#resumePreview{width:100%;max-width:800px;}
</style>
"""

FONT_PRELOAD = r"""
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" fetchpriority="high" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>
"""

VIEWPORT_RE = re.compile(r'<meta\s+name=["\']viewport["\']\s+content=["\'][^"\']*["\']\s*/?>', flags=re.IGNORECASE)
LINK_STYLESHEET_RE = re.compile(r'<link\s+rel=["\']stylesheet["\']\s+href=["\']([^"\']+)["\'][^>]*>', flags=re.IGNORECASE)
NOSCRIPT_BLOCK_RE = re.compile(r'<noscript>[\s\S]*?</noscript>', flags=re.IGNORECASE)
SCRIPT_SRC_RE = re.compile(r'(<script\s+[^>]*src=["\']([^"\']+)["\'][^>]*)(>)', flags=re.IGNORECASE)

SKIP_DEFER = ['googletagmanager.com', 'pagead2.googlesyndication.com']

for file_path in HTML_FILES:
    text = file_path.read_text(encoding='utf-8')
    if '<head>' not in text or '</head>' not in text:
        continue

    prefix, after_head = text.split('<head>', 1)
    head_inner, suffix = after_head.split('</head>', 1)
    original_head = head_inner

    viewport_present = VIEWPORT_RE.search(head_inner)
    if viewport_present:
        head_inner = VIEWPORT_RE.sub('<meta name="viewport" content="width=device-width, initial-scale=1.0">', head_inner)
    elif '<meta charset="UTF-8">' in head_inner:
        head_inner = head_inner.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    else:
        head_inner = '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + head_inner

    css_hrefs = [href for href in LINK_STYLESHEET_RE.findall(original_head) if 'fonts.googleapis.com' not in href]
    unique_css_hrefs = []
    for href in css_hrefs:
        if href not in unique_css_hrefs:
            unique_css_hrefs.append(href)

    head_inner = NOSCRIPT_BLOCK_RE.sub('', head_inner)
    head_inner = LINK_STYLESHEET_RE.sub('', head_inner)
    head_inner = re.sub(r'</?noscript>', '', head_inner, flags=re.IGNORECASE)

    head_inner = re.sub(r'<style>\s*:root\{--bg-white:[\s\S]*?</style>', '', head_inner, flags=re.IGNORECASE)

    # Determine CSS files to inline based on file path
    if 'tools' in file_path.parts:
        css_files = ['css/style.css', 'css/navbar.css', 'css/footer.css', 'css/tools.css']
    elif 'blog' in file_path.parts:
        css_files = ['css/style.css', 'css/navbar.css', 'css/footer.css', 'css/blog.css']
    else:
        css_files = ['css/style.css', 'css/navbar.css', 'css/footer.css']

    combined_css = ''
    for css_file in css_files:
        css_path = ROOT / css_file
        if css_path.exists():
            combined_css += css_path.read_text(encoding='utf-8') + '\n'

    if combined_css:
        head_inner = head_inner.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <style>\n' + combined_css + '  </style>')

    if 'rel="preload" href="https://fonts.googleapis.com/css2?family=Inter' not in head_inner:
        if 'rel="preconnect" href="https://fonts.googleapis.com"' in head_inner:
            head_inner = head_inner.replace('rel="preconnect" href="https://fonts.googleapis.com"', 'rel="preconnect" href="https://fonts.googleapis.com"\n  ' + FONT_PRELOAD)
        else:
            head_inner = head_inner.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n  ' + FONT_PRELOAD)

    text = prefix + '<head>' + head_inner + '</head>' + suffix

    def replace_script(match):
        full, src = match.group(1), match.group(2)
        if any(skip in src for skip in SKIP_DEFER):
            return full + match.group(3)
        if 'defer' in full.lower() or 'async' in full.lower():
            return full + match.group(3)
        return full + ' defer' + match.group(3)

    text = SCRIPT_SRC_RE.sub(replace_script, text)

    if '<head>' in text and '</head>' in text:
        prefix, after_head = text.split('<head>', 1)
        head_inner, suffix = after_head.split('</head>', 1)
        moved_scripts = []

        def move_scripts(match):
            tag = match.group(0)
            src = match.group(2)
            if any(skip in src for skip in SKIP_DEFER):
                return tag
            if 'defer' not in tag.lower() and 'async' not in tag.lower():
                tag = tag.replace('<script', '<script defer', 1)
            moved_scripts.append(tag)
            return ''

        head_inner = re.sub(r'(<script\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>\s*</script>)', move_scripts, head_inner, flags=re.IGNORECASE)
        if moved_scripts:
            body_parts = suffix.rsplit('</body>', 1)
            if len(body_parts) == 2:
                before_body, after_body = body_parts
                suffix = before_body + '\n  ' + '\n  '.join(moved_scripts) + '</body>' + after_body
            else:
                suffix = suffix + '\n  ' + '\n  '.join(moved_scripts)
        text = prefix + '<head>' + head_inner + '</head>' + suffix

    if 'id="previewImage"' in text:
        text = re.sub(r'(<img\s+[^>]*id="previewImage"[^>]*)(>)', lambda m: m.group(1) + ' width="800" height="600"' + m.group(2) if 'width="' not in m.group(1) and 'height="' not in m.group(1) else m.group(0), text)

    text = text.replace('preview.png', 'preview.webp')
    text = text.replace('width:800px;margin:auto;', 'width:100%;max-width:800px;margin:auto;')
    text = text.replace('width:800px;margin:auto;background:#ffffff;padding:30px;font-family:Arial,sans-serif;color:#000;box-shadow:0 0 10px rgba(0,0,0,0.1)',
                        'width:100%;max-width:800px;margin:auto;background:#ffffff;padding:30px;font-family:Arial,sans-serif;color:#000;box-shadow:0 0 10px rgba(0,0,0,0.1)')

    file_path.write_text(text, encoding='utf-8')

vercel_path = ROOT / 'vercel.json'
vercel_text = vercel_path.read_text(encoding='utf-8')
vercel_data = re.sub(r'"cleanUrls"\s*:\s*false', '"cleanUrls": true', vercel_text)
if '"headers"' not in vercel_data:
    headers_block = '''  "headers": [
    {
      "source": "/(.*.css)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*.js)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*.webp|.*.png|.*.jpg|.*.jpeg)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ],\n'''
    vercel_data = vercel_data.replace('{\n', '{\n' + headers_block, 1)
vercel_path.write_text(vercel_data, encoding='utf-8')

print('Processed', len(HTML_FILES), 'HTML files and updated vercel.json.')
