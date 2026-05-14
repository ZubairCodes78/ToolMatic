from pathlib import Path
import re
import sys

root = Path(r'd:/ZUBAIR/ToolMatic')
html_files = list(root.rglob('*.html'))
pattern = re.compile(r'(?i)(?:href|src)="([^"]+)"')
ignore_prefix = ('http://','https://','mailto:','tel:','#','javascript:')
errors = []

for path in html_files:
    text = path.read_text(encoding='utf-8')
    for match in pattern.findall(text):
        url = match.strip()
        if not url or url.startswith(ignore_prefix):
            continue
        if url.startswith('/'):
            target = root / url.lstrip('/')
        else:
            target = (path.parent / url).resolve()
        target_str = str(target)
        if '?' in target_str:
            target = Path(target_str.split('?',1)[0])
        if '#' in target.name:
            target = Path(str(target).split('#',1)[0])
        if target.exists():
            continue
        if url.endswith('/') and (target / 'index.html').exists():
            continue
        errors.append((str(path.relative_to(root)), url, str(target.relative_to(root)) if target.exists() else 'MISSING'))

print('Checked', len(html_files), 'HTML files')
if errors:
    print('BROKEN LINKS:')
    for e in errors[:50]:
        print(e)
    print('... total', len(errors), 'failures')
    sys.exit(1)
print('All internal HTML links resolved successfully.')
