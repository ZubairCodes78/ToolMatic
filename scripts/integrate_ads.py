import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

POPUNDER_SCRIPT = '<script src="https://pl31082067.profitableratecpmnetwork.com/5f/47/5a/5f475a0559812399104f0edc60993993.js"></script>'
SOCIAL_BAR_SCRIPT = '<script src="https://pl31082068.profitableratecpmnetwork.com/37/62/52/37625204b19e74ce25495cd3b497864a.js"></script>'
NATIVE_BANNER_BLOCK = """  <!-- Adsterra Native Banner -->
  <div class="container" style="margin: 24px auto; text-align: center; max-width: 1200px;">
    <script async="async" data-cfasync="false" src="https://pl31082069.profitableratecpmnetwork.com/4f0143c28c037bb01761d989dc19754d/invoke.js"></script>
    <div id="container-4f0143c28c037bb01761d989dc19754d"></div>
  </div>"""

AD_SLOT_PATTERN = re.compile(
    r'\s*<!--\s*Ad Slot\s*-->\s*<div class="container">\s*<div class="ad-slot">\s*<!-- AdSense Ad Unit: Replace with your AdSense code -->\s*</div>\s*</div>',
    re.IGNORECASE
)

HTML_FILES = [f for f in ROOT.rglob('*.html') if '.venv' not in f.parts and f.name != 'google442de89fc977bfee.html']

def process_file(file_path: Path):
    text = file_path.read_text(encoding='utf-8')

    # 1. Popunder in <head>
    if 'pl31082067.profitableratecpmnetwork.com' not in text:
        # Place right after existing AdSense or right before </head>
        if 'ca-pub-8943765451617871' in text:
            # Place after AdSense script tag
            adsense_match = re.search(r'(<script\s+async\s+src="https://pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js\?client=ca-pub-8943765451617871"\s+crossorigin="anonymous">\s*</script>)', text, re.IGNORECASE)
            if adsense_match:
                adsense_tag = adsense_match.group(1)
                text = text.replace(adsense_tag, adsense_tag + '\n  <!-- Adsterra Popunder -->\n  ' + POPUNDER_SCRIPT, 1)
            else:
                text = text.replace('</head>', '  <!-- Adsterra Popunder -->\n  ' + POPUNDER_SCRIPT + '\n</head>', 1)
        else:
            text = text.replace('</head>', '  <!-- Adsterra Popunder -->\n  ' + POPUNDER_SCRIPT + '\n</head>', 1)

    # 2. Native Banner in page body
    if 'container-4f0143c28c037bb01761d989dc19754d' not in text:
        # Check if there is an existing <!-- Ad Slot --> placeholder
        if AD_SLOT_PATTERN.search(text):
            text = AD_SLOT_PATTERN.sub('\n\n' + NATIVE_BANNER_BLOCK, text, count=1)
        elif '<!-- Footer -->' in text:
            text = text.replace('<!-- Footer -->', NATIVE_BANNER_BLOCK + '\n\n  <!-- Footer -->', 1)
        elif '<footer' in text:
            text = text.replace('<footer', NATIVE_BANNER_BLOCK + '\n\n  <footer', 1)

    # 3. Social Bar right above closing </body>
    if 'pl31082068.profitableratecpmnetwork.com' not in text:
        if '</body>' in text:
            text = text.replace('</body>', '  <!-- Adsterra Social Bar -->\n  ' + SOCIAL_BAR_SCRIPT + '\n</body>', 1)

    file_path.write_text(text, encoding='utf-8')

def main():
    print(f"Processing {len(HTML_FILES)} HTML files...")
    for file_path in HTML_FILES:
        process_file(file_path)
    print("All files processed.")

if __name__ == '__main__':
    main()
