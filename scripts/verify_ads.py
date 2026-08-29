import sys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_FILES = [f for f in ROOT.rglob('*.html') if '.venv' not in f.parts and f.name != 'google442de89fc977bfee.html']

POPUNDER_URL = 'https://pl31082067.profitableratecpmnetwork.com/5f/47/5a/5f475a0559812399104f0edc60993993.js'
SOCIAL_URL = 'https://pl31082068.profitableratecpmnetwork.com/37/62/52/37625204b19e74ce25495cd3b497864a.js'
NATIVE_URL = 'https://pl31082069.profitableratecpmnetwork.com/4f0143c28c037bb01761d989dc19754d/invoke.js'
CONTAINER_ID = 'container-4f0143c28c037bb01761d989dc19754d'

def verify():
    errors = []
    print(f"Auditing {len(HTML_FILES)} HTML files for Adsterra ad integrations...\n")

    for f in sorted(HTML_FILES):
        text = f.read_text(encoding='utf-8')
        rel_path = f.relative_to(ROOT)

        # 1. Popunder check: exactly 1, inside <head>
        p_count = text.count(POPUNDER_URL)
        if p_count != 1:
            errors.append(f"{rel_path}: Popunder script count is {p_count} (expected exactly 1)")
        head_match = re.search(r'<head.*?</head>', text, re.DOTALL | re.IGNORECASE)
        if not head_match:
            errors.append(f"{rel_path}: No <head>...</head> block found")
        elif POPUNDER_URL not in head_match.group(0):
            errors.append(f"{rel_path}: Popunder script is not located inside <head>")

        # 2. Social Bar check: exactly 1, immediately before closing </body>
        s_count = text.count(SOCIAL_URL)
        if s_count != 1:
            errors.append(f"{rel_path}: Social Bar script count is {s_count} (expected exactly 1)")
        idx = text.rfind('</body>')
        if idx == -1:
            errors.append(f"{rel_path}: No closing </body> tag found")
        else:
            before_body = text[max(0, idx - 400):idx]
            if SOCIAL_URL not in before_body:
                errors.append(f"{rel_path}: Social Bar is not directly before closing </body>")

        # 3. Native Banner check: script + container exactly 1 each, located in <body>
        n_count = text.count(NATIVE_URL)
        c_count = text.count(CONTAINER_ID)
        if n_count != 1:
            errors.append(f"{rel_path}: Native Banner script count is {n_count} (expected exactly 1)")
        if c_count != 1:
            errors.append(f"{rel_path}: Container ID '{CONTAINER_ID}' count is {c_count} (expected exactly 1)")

        body_match = re.search(r'<body.*?</body>', text, re.DOTALL | re.IGNORECASE)
        if not body_match:
            errors.append(f"{rel_path}: No <body>...</body> block found")
        else:
            body_text = body_match.group(0)
            if NATIVE_URL not in body_text:
                errors.append(f"{rel_path}: Native Banner script is not located inside <body>")
            if CONTAINER_ID not in body_text:
                errors.append(f"{rel_path}: Native Banner container is not located inside <body>")

    if errors:
        print("FAILED with the following errors:")
        for err in errors:
            print(" -", err)
        sys.exit(1)
    else:
        print(f"SUCCESS: All {len(HTML_FILES)} HTML files verified!")
        print("Summary of verification:")
        print("  [PASS] Popunder script: Exactly 1 per page, located inside <head> before </head>")
        print("  [PASS] Social Bar script: Exactly 1 per page, located directly before closing </body>")
        print("  [PASS] Native Banner script + container: Exactly 1 per page, placed together in <body>")
        print("  [PASS] Zero container ID duplicates across all pages")
        print("  [PASS] Exact URLs and container IDs preserved without modification")

if __name__ == '__main__':
    verify()

