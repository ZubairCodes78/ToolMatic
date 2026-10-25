"""
ToolMatic Quality & Integrity Checker
Verifies:
1. Internal links
2. Hreflang alternates
3. Canonical tags
4. Absence of disallowed ad networks (Adsterra, etc.)
5. Schema JSON-LD validity
6. Sitemap.xml coverage
"""

import re
import json
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent

html_files = [f for f in ROOT.rglob("*.html") if ".venv" not in f.parts and f.name != "google442de89fc977bfee.html" and not f.name.endswith(".test.html")]

print(f"Auditing {len(html_files)} HTML files for SEO, AEO, Links, and AdSense readiness...")

broken_links = []
banned_scripts = []
missing_canonicals = []
missing_hreflangs = []
invalid_jsonld = []

for file_path in html_files:
    content = file_path.read_text(encoding="utf-8")
    rel_path = file_path.relative_to(ROOT)

    # 1. Banned scripts check (Adsterra, profitableratecpmnetwork, etc.)
    if "profitableratecpmnetwork" in content or "pl31082067" in content or "pl31082068" in content:
        banned_scripts.append(str(rel_path))

    # 2. Canonical check
    if 'rel="canonical"' not in content:
        missing_canonicals.append(str(rel_path))

    # 3. Hreflang check
    if 'hreflang="en"' not in content or 'hreflang="id"' not in content:
        missing_hreflangs.append(str(rel_path))

    # 4. JSON-LD check
    json_ld_matches = re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', content)
    for j_str in json_ld_matches:
        try:
            json.loads(j_str.strip())
        except Exception as e:
            invalid_jsonld.append((str(rel_path), str(e)))

    # 5. Internal link check
    links = re.findall(r'(?:href|src)="([^"]+)"', content)
    for link in links:
        link = link.strip()
        if not link or link.startswith(("http://", "https://", "mailto:", "tel:", "#", "javascript:", "data:")):
            continue
        
        # Clean query strings and hashes
        clean_target = link.split("?")[0].split("#")[0]
        if not clean_target:
            continue

        if clean_target.startswith("/"):
            target_path = ROOT / clean_target.lstrip("/")
        else:
            target_path = file_path.parent / clean_target

        # Check if direct file exists or if it's a directory with index.html
        if target_path.exists():
            continue
        if target_path.is_dir() and (target_path / "index.html").exists():
            continue
        if (ROOT / (clean_target.strip("/") + ".html")).exists():
            continue
        if (target_path / "index.html").exists():
            continue

        # Check if it's a valid static directory route
        if clean_target.endswith("/") and (ROOT / clean_target.strip("/") / "index.html").exists():
            continue

        broken_links.append((str(rel_path), link))

print("\n--- AUDIT RESULTS ---")
print(f"Total HTML files audited: {len(html_files)}")
print(f"Banned ad scripts detected: {len(banned_scripts)}")
if banned_scripts:
    print(f"  Files with banned scripts: {banned_scripts[:5]}")

print(f"Missing canonicals: {len(missing_canonicals)}")
print(f"Missing hreflangs: {len(missing_hreflangs)}")
print(f"Invalid JSON-LD blocks: {len(invalid_jsonld)}")
if invalid_jsonld:
    print(f"  Invalid JSON-LD details: {invalid_jsonld[:5]}")

print(f"Broken links: {len(broken_links)}")
if broken_links:
    for bl in broken_links[:20]:
        print(f"  In {bl[0]}: {bl[1]}")

# Check sitemap.xml
sitemap_path = ROOT / "sitemap.xml"
if sitemap_path.exists():
    try:
        tree = ET.parse(sitemap_path)
        urls = tree.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        print(f"sitemap.xml valid! Contains {len(urls)} URLs")
    except Exception as e:
        print(f"sitemap.xml error: {e}")
else:
    print("sitemap.xml MISSING!")

# Check robots.txt
robots_path = ROOT / "robots.txt"
if robots_path.exists():
    print(f"robots.txt present ({len(robots_path.read_text())} bytes)")
else:
    print("robots.txt MISSING!")
